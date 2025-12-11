import { 
  db, collection, doc, setDoc, getDoc, deleteDoc, onSnapshot
} from "./firebase.js";

console.log("Tree.js loaded");

const treeArea = document.getElementById("tree-area");
const treeImg = document.getElementById("tree-img");
const ornamentGrid = document.getElementById("ornament-grid");
const panel = document.getElementById("panel");
const floatingBtn = document.getElementById("floating-btn");

const popupOverlay = document.getElementById("popup-overlay");
const memoListBox = document.getElementById("memo-list");
const memoInput = document.querySelector(".memo-input");
const sendBtn = document.querySelector(".memo-send-btn");
const closePopupBtn = document.querySelector(".close-popup");
const deleteBtn = document.querySelector(".delete-btn");

let currentOrnamentId = null;

const BASE_ORNAMENT_SIZE = 60;   // 기준 크기(px)

/* ============================================================
   트리 스케일 계산 (오너먼트 자동 크기 조정에 사용)
============================================================ */
function getTreeScale() {
  const displayWidth = treeImg.clientWidth;
  const naturalWidth = treeImg.naturalWidth;
  return displayWidth / naturalWidth;  // 스케일 비율
}

function getOrnamentSize() {
  return BASE_ORNAMENT_SIZE * getTreeScale();
}


/* ============================================================
   패널 열기 / 닫기
============================================================ */
document.querySelector(".close-panel").onclick = () => {
  document.body.classList.remove("panel-open");
  document.body.classList.add("panel-closed");
  floatingBtn.style.display = "flex";
};

floatingBtn.onclick = () => {
  document.body.classList.add("panel-open");
  document.body.classList.remove("panel-closed");
  floatingBtn.style.display = "none";
};


/* ============================================================
   오너먼트 자동 생성
============================================================ */
for (let i = 1; i <= 12; i++) {
  const div = document.createElement("div");
  const img = document.createElement("img");

  const num = i.toString().padStart(2, "0");
  img.src = `./assets/img/ornaments/ornament-${num}.png`;
  img.dataset.id = `orn_${num}`;
  img.draggable = true;

  img.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("src", img.src);
  });

  div.appendChild(img);
  ornamentGrid.appendChild(div);
}


/* ============================================================
   오너먼트 간 최소 거리 충돌 검사 (1/4 규칙)
============================================================ */
function isTooClose(newX, newY, size) {
  const ornaments = treeArea.querySelectorAll(".placed");

  const minDistance = size * 0.25 * 2; // 지름 × 0.25

  for (const o of ornaments) {
    const ox = parseFloat(o.dataset.x);
    const oy = parseFloat(o.dataset.y);
    const dist = Math.sqrt((ox - newX)**2 + (oy - newY)**2);

    if (dist < minDistance) return true;
  }
  return false;
}


/* ============================================================
   트리 드롭 이벤트
============================================================ */
treeArea.addEventListener("dragover", e => e.preventDefault());

treeArea.addEventListener("drop", async (e) => {
  e.preventDefault();

  const src = e.dataTransfer.getData("src");
  if (!src) return;

  const rect = treeArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const size = getOrnamentSize();

  if (isTooClose(x, y, size)) {
    alert("오너먼트가 너무 가까워요! 최소 간격을 유지해주세요.");
    return;
  }

  const ornamentDoc = doc(collection(db, "ornaments"));
  await setDoc(ornamentDoc, { id: ornamentDoc.id, src, x, y, hasMemo: false });

  placeOrnament(ornamentDoc.id, src, x, y);
});


/* ============================================================
   오너먼트 DOM 생성 (자동 리사이즈 포함)
============================================================ */
function placeOrnament(id, src, x, y) {
  if (!id || !src) return;

  const img = document.createElement("img");
  img.src = src;
  img.dataset.oid = id;
  img.dataset.x = x;
  img.dataset.y = y;

  const size = getOrnamentSize();

  img.classList.add("placed");
  img.style.position = "absolute";
  img.style.width = `${size}px`;
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  img.style.transform = "translate(-50%, -50%)";

  img.addEventListener("click", () => openPopup(id));

  treeArea.appendChild(img);
}


/* ============================================================
   화면 리사이즈 시 오너먼트 크기 자동 업데이트
============================================================ */
window.addEventListener("resize", () => {
  const ornaments = document.querySelectorAll(".placed");
  const size = getOrnamentSize();

  ornaments.forEach(o => {
    o.style.width = `${size}px`;
  });
});


/* ============================================================
   Firestore 실시간 반영
============================================================ */
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


/* 이하 메모 기능은 동일하므로 생략 (원래 코드 그대로 사용하면 됨) */
