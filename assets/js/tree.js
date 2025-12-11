import { 
  db, collection, doc, setDoc, getDoc, deleteDoc, onSnapshot
} from "./firebase.js";
console.log("Tree.js loaded");
const treeArea = document.getElementById("tree-area");
const ornamentGrid = document.getElementById("ornament-grid");
const panel = document.getElementById("panel");
const floatingBtn = document.getElementById("floating-btn");

const popupOverlay = document.getElementById("popup-overlay");
const popup = document.getElementById("memo-popup");
const memoListBox = document.getElementById("memo-list");
const memoInput = document.querySelector(".memo-input");
const sendBtn = document.querySelector(".memo-send-btn");
const closePopupBtn = document.querySelector(".close-popup");
const deleteBtn = document.querySelector(".delete-btn");

let currentOrnamentId = null;
let panelWasOpen = true;

/* ============================================================
   1) 오너먼트 10개 자동 생성
============================================================ */
for (let i = 1; i <= 12; i++) {
  let img = document.createElement("img");
  const num = i.toString().padStart(2, "0");
  img.src = `./assets/img/ornaments/ornament-${num}.png`;
  img.dataset.id = `ornament_${num}`;
  img.draggable = true;

  img.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("ornament-id", img.dataset.id);
    e.dataTransfer.setData("src", img.src);
  });

  ornamentGrid.appendChild(img);
}

/* ============================================================
   2) 패널 열기/닫기
============================================================ */
document.querySelector(".close-panel").onclick = () => {
  document.body.classList.remove("panel-open"); // 패널 닫기
    floatingBtn.style.display = "flex";
    panelWasOpen = false;
};

floatingBtn.onclick = () => {
  document.body.classList.add("panel-open"); // 패널 열기
    floatingBtn.style.display = "none";
    panelWasOpen = true;
};

/* ============================================================
   3) 트리 polygon 경계 (여유 15px 주기)
============================================================ */
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
    
    const intersect = (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

/* ============================================================
   4) 충돌 검사 (20%만 겹침 허용)
============================================================ */
function isColliding(x, y) {
  const ornaments = treeArea.querySelectorAll(".placed");
  const radius = 30;  // width 60px 기준

  for (let o of ornaments) {
    const ox = parseFloat(o.style.left);
    const oy = parseFloat(o.style.top);

    const dist = Math.sqrt((ox - x)**2 + (oy - y)**2);
    if (dist < radius * 2 * 0.8) return true;
  }
  return false;
}

/* ============================================================
   5) 트리 드래그&드롭 배치
============================================================ */
treeArea.addEventListener("dragover", (e) => e.preventDefault());

treeArea.addEventListener("drop", async (e) => {
  e.preventDefault();

  const id = e.dataTransfer.getData("ornament-id");
  const src = e.dataTransfer.getData("src");

  const rect = treeArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 트리 비율 조정
  const treeImg = document.getElementById("tree-img");
  const scaleX = treeImg.naturalWidth / treeImg.clientWidth;
  const scaleY = treeImg.naturalHeight / treeImg.clientHeight;

  const scaledX = x * scaleX;
  const scaledY = y * scaleY;

  // polygon 검사
  if (!pointInPolygon(scaledX, scaledY, treePolygon)) {
    alert("트리 영역 안에서만 장식할 수 있어요!");
    return;
  }

  // 충돌 검사
  if (isColliding(x, y)) {
    alert("오너먼트가 너무 가까워요! (20%만 겹침 허용)");
    return;
  }

  // Firestore에 저장
  const ornamentDoc = doc(collection(db, "ornaments"));
  await setDoc(ornamentDoc, {
    id: ornamentDoc.id,
    src, x, y,
    hasMemo: false
  });

  placeOrnament(ornamentDoc.id, src, x, y);
});

/* ============================================================
   6) 오너먼트 DOM 생성 + 클릭 → 팝업
============================================================ */
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

/* ============================================================
   7) Firestore 실시간 반영
============================================================ */
onSnapshot(collection(db, "ornaments"), (snapshot) => {
  snapshot.docChanges().forEach((ch) => {
    if (ch.type === "added") {
      const d = ch.doc.data();
      if (!treeArea.querySelector(`img[data-oid="${d.id}"]`)) {
        placeOrnament(d.id, d.src, d.x, d.y);
      }
    }
    if (ch.type === "removed") {
      const el = treeArea.querySelector(`img[data-oid="${ch.doc.id}"]`);
      if (el) el.remove();
    }
  });
});

/* ============================================================
   8) 팝업 열기
============================================================ */
async function openPopup(ornamentId) {
    currentOrnamentId = ornamentId;

    popupOverlay.style.display = "flex";

    // 패널이 열려있는지 확인 (body 클래스 기반)
    panelWasOpen = document.body.classList.contains("panel-open");

    // 패널 숨기기
    document.body.classList.remove("panel-open");
    floatingBtn.style.display = "none";

    loadMemoList();
}

/* ============================================================
   9) 팝업 닫기
============================================================ */
closePopupBtn.onclick = () => {
    popupOverlay.style.display = "none";

    if (panelWasOpen) {
        document.body.classList.add("panel-open");  // 원래 열려 있었음
    } else {
        floatingBtn.style.display = "flex";         // 닫힌 상태로 유지
    }
};

/* ============================================================
   10) 메모 목록 불러오기
============================================================ */
async function loadMemoList() {
  memoListBox.innerHTML = "";

  const memoCol = collection(db, "ornaments", currentOrnamentId, "memoList");
  onSnapshot(memoCol, (snapshot) => {
    memoListBox.innerHTML = "";

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

        // 삭제 버튼
        const delBtn = document.createElement("span");
        delBtn.textContent = "✕";
        delBtn.style.float = "right";
        delBtn.style.cursor = "pointer";
        delBtn.style.color = "#999";
        delBtn.style.fontWeight = "bold";

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

/* ============================================================
   11) 메모 입력 + 저장
============================================================ */
memoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") e.preventDefault();
});

sendBtn.onclick = async () => {
  const text = memoInput.value.trim();
  if (!text) return;

  const memoId = doc(collection(db, "ornaments", currentOrnamentId, "memoList")).id;

  await setDoc(doc(db, "ornaments", currentOrnamentId, "memoList", memoId), {
    text,
    timestamp: Date.now()
  });

  await setDoc(
    doc(db, "ornaments", currentOrnamentId),
    { hasMemo: true },
    { merge: true }
  );

  memoInput.value = "";
};

/* ============================================================
   12) 오너먼트 삭제 기능
============================================================ */
deleteBtn.onclick = async () => {
  const ornamentRef = doc(db, "ornaments", currentOrnamentId);
  const ornamentSnap = await getDoc(ornamentRef);

  if (!ornamentSnap.exists()) return;

  if (ornamentSnap.data().hasMemo) {
    alert("메모가 없을 때만 삭제 가능합니다.");
    return;
  }

  if (confirm("이 오너먼트를 삭제하시겠습니까?")) {
    await deleteDoc(ornamentRef);
    closePopupBtn.click();
  }
};
