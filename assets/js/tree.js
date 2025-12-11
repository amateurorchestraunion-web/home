import {
  db, collection, doc, setDoc, getDoc, deleteDoc, onSnapshot
} from "./firebase.js";

console.log("Tree.js loaded");

const treeArea = document.getElementById("tree-area");
const treeImg = document.getElementById("tree-img");

const ornamentGrid = document.getElementById("ornament-grid");
const mobileGrid = document.getElementById("mobile-grid");

const panel = document.getElementById("panel");
const mobilePanel = document.getElementById("mobile-panel");

const floatingBtn = document.getElementById("floating-btn");

const popupOverlay = document.getElementById("popup-overlay");
const memoListBox = document.getElementById("memo-list");
const memoInput = document.querySelector(".memo-input");
const sendBtn = document.querySelector(".memo-send-btn");

const closePopupBtn = document.querySelector(".close-popup");
const closeMobileBtn = document.querySelector(".close-mobile");
const deleteBtn = document.querySelector(".delete-btn");

let currentOrnamentId = null;

const BASE_ORNAMENT_SIZE = 60;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

/* ==============================================
   ★ 모바일 초기 상태 강제 세팅
============================================== */
if (isMobile) {
  document.body.classList.remove("panel-open");
  document.body.classList.add("panel-closed");
  floatingBtn.style.display = "flex";
}

/* ==============================================
   트리 스케일
============================================== */
function getTreeScale() {
  return treeImg.clientWidth / treeImg.naturalWidth;
}

function getOrnamentSize() {
  return BASE_ORNAMENT_SIZE * getTreeScale();
}

/* ==============================================
   패널 열기 / 닫기
============================================== */
document.querySelector(".close-panel").onclick = () => {
  if (isMobile) return;

  document.body.classList.remove("panel-open");
  document.body.classList.add("panel-closed");
  floatingBtn.style.display = "flex";

  setTimeout(updateAll, 260); // ★ 패널 transition 후 재정렬
};

closeMobileBtn.onclick = () => {
  mobilePanel.style.bottom = "-40%";
  floatingBtn.style.display = "flex";

  setTimeout(updateAll, 260); // ★ 모바일 패널 닫아도 전체 업데이트
};

floatingBtn.onclick = () => {
  floatingBtn.style.display = "none";

  if (isMobile) {
    mobilePanel.style.bottom = "0";
  } else {
    document.body.classList.add("panel-open");
    document.body.classList.remove("panel-closed");
  }

  setTimeout(updateAll, 260); // ★ 패널 열기 후 재정렬
};

/* ==============================================
   오너먼트 이미지 생성
============================================== */
function createOrnament(src, id) {
  const wrapper = document.createElement("div");
  const img = document.createElement("img");
  img.src = src;
  img.dataset.id = id;
  img.draggable = true;

  img.addEventListener("dragstart", e => {
    e.dataTransfer.setData("src", src);
  });

  wrapper.appendChild(img);
  return wrapper;
}

for (let i = 1; i <= 12; i++) {
  const num = i.toString().padStart(2, "0");
  const src = `./assets/img/ornaments/ornament-${num}.png`;
  const id = `orn_${num}`;

  ornamentGrid.appendChild(createOrnament(src, id));

  const mobileImg = document.createElement("img");
  mobileImg.src = src;
  mobileImg.dataset.id = id;
  mobileImg.draggable = true;

  mobileImg.addEventListener("dragstart", e => {
    e.dataTransfer.setData("src", src);
  });

  mobileGrid.appendChild(mobileImg);
}

/* ==============================================
   오너먼트 간 거리 검사
============================================== */
function isTooClose(newX, newY, size) {
  const ornaments = treeArea.querySelectorAll(".placed");
  const minDist = size * 0.5;

  const rect = treeImg.getBoundingClientRect();

  for (const o of ornaments) {
    const xRatio = parseFloat(o.dataset.xRatio);
    const yRatio = parseFloat(o.dataset.yRatio);

    const ox = rect.width * xRatio;
    const oy = rect.height * yRatio;

    const dist = Math.sqrt((ox - newX) ** 2 + (oy - newY) ** 2);
    if (dist < minDist) return true;
  }
  return false;
}

/* ==============================================
   드롭 이벤트
============================================== */
treeArea.addEventListener("dragover", (e) => e.preventDefault());

treeArea.addEventListener("drop", async (e) => {
  e.preventDefault();

  const src = e.dataTransfer.getData("src");
  if (!src) return;

  const rect = treeImg.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const size = getOrnamentSize();
  if (isTooClose(x, y, size)) {
    alert("오너먼트가 너무 가까워요!");
    return;
  }

  const xRatio = x / rect.width;
  const yRatio = y / rect.height;

  const ornamentDoc = doc(collection(db, "ornaments"));
  await setDoc(ornamentDoc, {
    id: ornamentDoc.id,
    src,
    xRatio,
    yRatio,
    hasMemo: false
  });

  placeOrnament(ornamentDoc.id, src, xRatio, yRatio);
});

/* ==============================================
   오너먼트 DOM 생성
============================================== */
function placeOrnament(id, src, xRatio, yRatio) {
  if (!id || !src) return;

  const img = document.createElement("img");
  img.src = src;
  img.dataset.oid = id;
  img.dataset.xRatio = xRatio;
  img.dataset.yRatio = yRatio;

  img.classList.add("placed");
  img.style.position = "absolute";
  img.style.transform = "translate(-50%, -50%)";

  updateOne(img);

  img.addEventListener("click", () => openPopup(id));

  treeArea.appendChild(img);
}

/* ==============================================
   오너먼트 위치 업데이트
============================================== */
function updateOne(o) {
  const rect = treeImg.getBoundingClientRect();
  const xRatio = parseFloat(o.dataset.xRatio);
  const yRatio = parseFloat(o.dataset.yRatio);

  const size = getOrnamentSize();
  o.style.width = `${size}px`;

  o.style.left = `${rect.width * xRatio}px`;
  o.style.top = `${rect.height * yRatio}px`;
}

function updateAll() {
  document.querySelectorAll(".placed").forEach(updateOne);
}

window.addEventListener("resize", updateAll);

/* ==============================================
   Firestore Sync
============================================== */
onSnapshot(collection(db, "ornaments"), (snapshot) => {
  snapshot.docChanges().forEach((ch) => {
    const d = ch.doc.data();

    if (ch.type === "added") {
      if (!treeArea.querySelector(`[data-oid="${d.id}"]`)) {
        placeOrnament(d.id, d.src, d.xRatio, d.yRatio);
      }
    }

    if (ch.type === "removed") {
      const el = treeArea.querySelector(`[data-oid="${ch.doc.id}"]`);
      if (el) el.remove();
    }
  });
});

/* ==============================================
   팝업
============================================== */
function openPopup(id) {
  currentOrnamentId = id;
  popupOverlay.style.display = "flex";
  loadMemoList();
}

closePopupBtn.onclick = () => {
  popupOverlay.style.display = "none";
};

/* ==============================================
   메모 로드
============================================== */
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

    snapshot.forEach((docu) => {
      const d = docu.data();

      const box = document.createElement("div");
      box.className = "memo-item";
      box.innerHTML = `
        <div class="memo-timestamp">${new Date(d.timestamp).toLocaleString()}</div>
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

/* ==============================================
   메모 입력
============================================== */
memoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
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

/* ==============================================
   오너먼트 삭제
============================================== */
deleteBtn.onclick = async () => {
  const ref = doc(db, "ornaments", currentOrnamentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  if (snap.data().hasMemo) {
    alert("메모가 없어야 삭제할 수 있습니다.");
    return;
  }

  if (confirm("정말 삭제하시겠습니까?")) {
    await deleteDoc(ref);
    popupOverlay.style.display = "none";
    currentOrnamentId = null;
  }
};
