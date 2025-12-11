import { 
  db, collection, doc, setDoc, getDoc, deleteDoc, onSnapshot
} from "./firebase.js";

console.log("tree.js loaded");

const treeArea = document.getElementById("tree-area");
const ornamentGrid = document.getElementById("ornament-grid");
const panel = document.getElementById("panel");
const floatingBtn = document.getElementById("floating-btn");

const popupOverlay = document.getElementById("popup-overlay");
const memoPopup = document.getElementById("memo-popup");
const memoListBox = document.getElementById("memo-list");
const memoInput = document.querySelector(".memo-input");
const sendBtn = document.querySelector(".memo-send-btn");
const closePopupBtn = document.querySelector(".close-popup");
const deleteBtn = document.querySelector(".delete-btn");

let currentOrnamentId = null;

/* -----------------------
     오너먼트 자동 생성
------------------------*/
for (let i = 1; i <= 12; i++) {
  let img = document.createElement("img");
  let num = i.toString().padStart(2, "0");

  img.src = `./assets/img/ornaments/ornament-${num}.png`;
  img.dataset.id = `ornament_${num}`;
  img.draggable = true;

  img.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("ornament-id", img.dataset.id);
    e.dataTransfer.setData("src", img.src);
  });

  ornamentGrid.appendChild(img);
}

/* -----------------------
     패널 열기 / 닫기
------------------------*/
document.querySelector(".close-panel").onclick = () => {
  document.body.classList.remove("panel-open");
  document.body.classList.add("panel-closed");
  floatingBtn.style.display = "flex";
};

floatingBtn.onclick = () => {
  document.body.classList.remove("panel-closed");
  document.body.classList.add("panel-open");
  floatingBtn.style.display = "none";
};

/* -----------------------
     트리 polygon 영역
------------------------*/
const treePolygon = [
  [200, 300], [540, 60], [880, 300],  
  [900, 450], [750, 500], [800, 650],
  [600, 700], [700, 850], [540, 980],
  [380, 850], [480, 700], [300, 650],
  [350, 500], [180, 450]
];

function pointInPolygon(x, y, polygon) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect =
      (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/* -----------------------
     충돌 검사 (20%)
------------------------*/
function isColliding(x, y) {
  const ornaments = treeArea.querySelectorAll(".placed");
  const radius = 30;

  for (let o of ornaments) {
    const ox = parseFloat(o.style.left);
    const oy = parseFloat(o.style.top);
    const dist = Math.sqrt((ox - x)**2 + (oy - y)**2);

    if (dist < radius * 2 * 0.8) return true;
  }
  return false;
}

/* -----------------------
     드래그 & 드롭
------------------------*/
treeArea.addEventListener("dragover", (e) => e.preventDefault());

treeArea.addEventListener("drop", async (e) => {
  e.preventDefault();

  const src = e.dataTransfer.getData("src");

  const rect = treeArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const treeImg = document.getElementById("tree-img");
  const scaleX = treeImg.naturalWidth / treeImg.clientWidth;
  const scaleY = treeImg.naturalHeight / treeImg.clientHeight;

  const scaledX = x * scaleX;
  const scaledY = y * scaleY;

  if (!pointInPolygon(scaledX, scaledY, treePolygon)) {
    alert("트리 영역 안에서만 장식할 수 있어요!");
    return;
  }

  if (isColliding(x, y)) {
    alert("오너먼트가 너무 가까워요!");
    return;
  }

  const ornamentDoc = doc(collection(db, "ornaments"));
  await setDoc(ornamentDoc, {
    id: ornamentDoc.id,
    src, x, y,
    hasMemo: false
  });

  placeOrnament(ornamentDoc.id, src, x, y);
});

/* -----------------------
     오너먼트 DOM 배치
------------------------*/
function placeOrnament(id, src, x, y) {
  const img = document.createElement("img");
  img.src = src;
  img.classList.add("placed");
  img.style.position = "absolute";
  img.style.width = "60px";
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  img.style.transform = "translate(-50%, -50%)";
  img.dataset.oid = id;

  img.addEventListener("click", () => openPopup(id));

  treeArea.appendChild(img);
}

/* -----------------------
     실시간 반영
------------------------*/
onSnapshot(collection(db, "ornaments"), (snapshot) => {
  snapshot.docChanges().forEach((ch) => {
    if (ch.type === "added") {
      const d = ch.doc.data();
      if (!treeArea.querySelector(`[data-oid="${d.id}"]`)) {
        placeOrnament(d.id, d.src, d.x, d.y);
      }
    }

    if (ch.type === "removed") {
      const el = treeArea.querySelector(`[data-oid="${ch.doc.id}"]`);
      if (el) el.remove();
    }
  });
});

/* -----------------------
     팝업 열기
------------------------*/
async function openPopup(ornamentId) {
  currentOrnamentId = ornamentId;

  popupOverlay.style.display = "flex";

  document.body.classList.add("panel-closed");
  document.body.classList.remove("panel-open");

  floatingBtn.style.display = "none";

  loadMemoList();
}

/* -----------------------
     팝업 닫기
------------------------*/
closePopupBtn.onclick = () => {
  popupOverlay.style.display = "none";
  floatingBtn.style.display = "flex";
};

/* -----------------------
     메모 목록 표시
------------------------*/
async function loadMemoList() {
  memoListBox.innerHTML = "";

  const memoCol = collection(db, "ornaments", currentOrnamentId, "memoList");

  onSnapshot(memoCol, async (snapshot) => {
    memoListBox.innerHTML = "";

    if (snapshot.empty) {
      await setDoc(
        doc(db, "ornaments", currentOrnamentId),
        { hasMemo: false },
        { merge: true }
      );
    }

    snapshot.docs
      .sort((a, b) => a.data().timestamp - b.data().timestamp)
      .forEach((docu) => {
        const d = docu.data();
        const box = document.createElement("div");
        box.className = "memo-item";

        const t = new Date(d.timestamp).toLocaleString("ko-KR");

        box.innerHTML = `
          <div class="memo-timestamp">${t}</div>
          <div>${d.text}</div>
        `;

        const delBtn = document.createElement("span");
        delBtn.className = "delete-memo-btn";
        delBtn.textContent = "✕";

        delBtn.onclick = async () => {
          if (confirm("메모를 삭제하시겠습니까?")) {
            await deleteDoc(
              doc(db, "ornaments", currentOrnamentId, "memoList", docu.id)
            );
          }
        };

        box.appendChild(delBtn);
        memoListBox.appendChild(box);
      });
  });
}

/* -----------------------
     메모 작성
------------------------*/
memoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") e.preventDefault();
});

sendBtn.onclick = async () => {
  const text = memoInput.value.trim();
  if (!text) return;

  const memoId = doc(
    collection(db, "ornaments", currentOrnamentId, "memoList")
  ).id;

  await setDoc(
    doc(db, "ornaments", currentOrnamentId, "memoList", memoId),
    { text, timestamp: Date.now() }
  );

  await setDoc(
    doc(db, "ornaments", currentOrnamentId),
    { hasMemo: true },
    { merge: true }
  );

  memoInput.value = "";
};

/* -----------------------
     오너먼트 삭제
------------------------*/
deleteBtn.onclick = async () => {
  const ref = doc(db, "ornaments", currentOrnamentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  if (snap.data().hasMemo) {
    alert("메모가 없을 때만 삭제 가능합니다.");
    return;
  }

  if (confirm("이 오너먼트를 삭제하시겠습니까?")) {
    await deleteDoc(ref);
    popupOverlay.style.display = "none";
    floatingBtn.style.display = "flex";
  }
};
