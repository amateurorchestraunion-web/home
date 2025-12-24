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

const BASE_ORNAMENT_SIZE = 160;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

/* ==============================================
   모바일 초기 UI 설정
============================================== */
if (isMobile) {
  floatingBtn.style.display = "flex";
  document.body.classList.add("panel-closed");
  document.body.classList.remove("panel-open");
}

/* ==============================================
   스케일 계산
============================================== */
function getTreeScale() {
  return treeImg.clientWidth / treeImg.naturalWidth;
}

function getOrnamentSize() {
  return BASE_ORNAMENT_SIZE * getTreeScale();
}

/* ==============================================
   PC 패널 열기/닫기
============================================== */
document.querySelector(".close-panel").onclick = () => {
  if (isMobile) return;
  document.body.classList.add("panel-closed");
  document.body.classList.remove("panel-open");

  floatingBtn.style.display = "flex";
  setTimeout(updateAll, 260);
};

/* ==============================================
   모바일 패널 열기/닫기
============================================== */
closeMobileBtn.onclick = () => {
  mobilePanel.classList.remove("open");
  document.body.classList.remove("mobile-panel-open");
  floatingBtn.style.display = "flex";

  setTimeout(updateAll, 260);
};

floatingBtn.onclick = () => {
  floatingBtn.style.display = "none";

  if (isMobile) {
    mobilePanel.classList.add("open");
    document.body.classList.add("mobile-panel-open");
  } else {
    document.body.classList.add("panel-open");
    document.body.classList.remove("panel-closed");
  }

  setTimeout(updateAll, 260);
};

/* ==============================================
   PC 오너먼트 로드
============================================== */
function createOrnament(src, id) {
  const wrap = document.createElement("div");
  const img = document.createElement("img");
  img.src = src;
  img.dataset.id = id;
  img.draggable = true;

  img.addEventListener("dragstart", e => {
    e.dataTransfer.setData("src", src);
  });

  wrap.appendChild(img);
  return wrap;
}

/* ==============================================
   PC + 모바일 오너먼트 로드
============================================== */
for (let i = 1; i <= 37; i++) {
  const num = i.toString().padStart(2, "0");
  const src = `./assets/img/ornaments/ornament-${num}.png`;
  const id = `orn_${num}`;

  ornamentGrid.appendChild(createOrnament(src, id));

  const wrap = document.createElement("div");
  wrap.className = "mobile-grid-item";
  const img = document.createElement("img");
  img.src = src;
  img.dataset.id = id;
  img.draggable = false;

  wrap.appendChild(img);
  mobileGrid.appendChild(wrap);

  addMobileLongPressDrag(img);
}

/* ==============================================
   모바일 Long Press Drag
============================================== */

let longPressTimer = null;
let isDragging = false;
let dragGhost = null;
let dragSrc = null;

function addMobileLongPressDrag(img) {
  img.addEventListener("contextmenu", e => e.preventDefault());

  img.addEventListener("touchstart", (e) => {
    e.preventDefault();

    dragSrc = img.src;

    longPressTimer = setTimeout(() => {
      isDragging = true;

      dragGhost = document.createElement("img");
      dragGhost.src = dragSrc;
      dragGhost.classList.add("drag-ghost");
      document.body.appendChild(dragGhost);

      const t = e.touches[0];
      dragGhost.style.left = t.clientX + "px";
      dragGhost.style.top = t.clientY + "px";
    }, 350);
  }, { passive: false });

  img.addEventListener("touchmove", (e) => {
    if (isDragging && dragGhost) {
      const t = e.touches[0];
      dragGhost.style.left = t.clientX + "px";
      dragGhost.style.top = t.clientY + "px";
      e.preventDefault();
    }
  });

  img.addEventListener("touchend", async (e) => {
    clearTimeout(longPressTimer);

    if (!isDragging || !dragGhost) return;

    const t = e.changedTouches[0];
    dragGhost.remove();
    dragGhost = null;
    isDragging = false;

    const rect = treeImg.getBoundingClientRect();
    if (t.clientX < rect.left || t.clientX > rect.right ||
        t.clientY < rect.top  || t.clientY > rect.bottom) return;

    const xRatio = (t.clientX - rect.left) / rect.width;
    const yRatio = (t.clientY - rect.top) / rect.height;

    const ornamentDoc = doc(collection(db, "ornaments"));
    await setDoc(ornamentDoc, { id: ornamentDoc.id, src: dragSrc, xRatio, yRatio, hasMemo: false });

    placeOrnament(ornamentDoc.id, dragSrc, xRatio, yRatio);
  });
}

/* ==============================================
   PC 드롭
============================================== */
treeArea.addEventListener("dragover", e => e.preventDefault());

treeArea.addEventListener("drop", async (e) => {
  e.preventDefault();

  const src = e.dataTransfer.getData("src");
  if (!src) return;

  const rect = treeImg.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const xRatio = x / rect.width;
  const yRatio = y / rect.height;

  const ornamentDoc = doc(collection(db, "ornaments"));
  await setDoc(ornamentDoc, { id: ornamentDoc.id, src, xRatio, yRatio, hasMemo: false });

  placeOrnament(ornamentDoc.id, src, xRatio, yRatio);
});

/* ==============================================
   오너먼트 배치
============================================== */
function placeOrnament(id, src, xRatio, yRatio) {
  const o = document.createElement("img");

  o.src = src;
  o.dataset.oid = id;
  o.dataset.xRatio = xRatio;
  o.dataset.yRatio = yRatio;

  o.classList.add("placed");
  o.style.position = "absolute";
  o.style.transform = "translate(-50%, -50%)";

  updateOne(o);

  o.addEventListener("click", () => openPopup(id));

  treeImg.parentElement.appendChild(o);
}

/* ==============================================
   위치 재계산
============================================== */
function updateOne(o) {
  const areaRect = treeArea.getBoundingClientRect();
  const imgRect = treeImg.getBoundingClientRect();

  const xRatio = parseFloat(o.dataset.xRatio);
  const yRatio = parseFloat(o.dataset.yRatio);

  o.style.width = `${getOrnamentSize()}px`;

  const offsetX = imgRect.left - areaRect.left;
  const offsetY = imgRect.top - areaRect.top;

  o.style.left = offsetX + imgRect.width * xRatio + "px";
  o.style.top  = offsetY + imgRect.height * yRatio + "px";
}

function updateAll() {
  document.querySelectorAll(".placed").forEach(updateOne);
}

window.addEventListener("resize", updateAll);
new ResizeObserver(updateAll).observe(treeImg);

/* ==============================================
   Firestore Sync
============================================== */
onSnapshot(collection(db, "ornaments"), (snap) => {
  const parent = treeImg.parentElement;

  snap.docChanges().forEach((ch) => {
    const d = ch.doc.data();

    if (ch.type === "added") {
      if (!parent.querySelector(`[data-oid="${d.id}"]`)) {
        placeOrnament(d.id, d.src, d.xRatio, d.yRatio);
      }
    }

    if (ch.type === "removed") {
      const el = parent.querySelector(`[data-oid="${ch.doc.id}"]`);
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

closePopupBtn.onclick = () => popupOverlay.style.display = "none";

/* ==============================================
   메모 로드
============================================== */
async function loadMemoList() {
  memoListBox.innerHTML = "";

  const memoCol = collection(db, "ornaments", currentOrnamentId, "memoList");

  onSnapshot(memoCol, async (snap) => {
    memoListBox.innerHTML = "";

    if (snap.empty) {
      await setDoc(doc(db, "ornaments", currentOrnamentId), { hasMemo: false }, { merge: true });
    }

    snap.forEach((docu) => {
      const d = docu.data();

      const box = document.createElement("div");
      box.className = "memo-item";
      box.innerHTML = `
        <div class="memo-timestamp">${new Date(d.timestamp).toLocaleString()}</div>
        <div>${d.text}</div>
      `;

      const del = document.createElement("span");
      del.className = "delete-memo-btn";
      del.textContent = "✕";

      del.onclick = async () => {
        if (confirm("메모를 삭제하시겠습니까?")) {
          await deleteDoc(doc(db, "ornaments", currentOrnamentId, "memoList", docu.id));
        }
      };

      box.appendChild(del);
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

  const memoId = doc(collection(db, "ornaments", currentOrnamentId, "memoList")).id;

  await setDoc(
    doc(db, "ornaments", currentOrnamentId, "memoList", memoId),
    { text, timestamp: Date.now() }
  );

  await setDoc(
    doc(db, "ornaments", currentOrnamentId),
    { hasMemo: true }, { merge: true }
  );

  memoInput.value = "";
};

/* ==============================================
   ★ 오너먼트 삭제 (애니메이션 포함)
============================================== */
deleteBtn.onclick = async () => {
  const id = currentOrnamentId;
  if (!id) return;

  const ref = doc(db, "ornaments", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  if (snap.data().hasMemo) {
    alert("메모가 없어야 삭제할 수 있습니다.");
    return;
  }

  if (!confirm("정말 삭제하시겠습니까?")) return;

  const el = document.querySelector(`[data-oid="${id}"]`);
  const src = snap.data().src;

  if (el) {
    if (src.includes("ornament-08")) {
      el.classList.add("ornament-08-dust");
    } else {
      el.classList.add("ornament-default-fade");
    }

    el.addEventListener("animationend", () => {
      el.remove();
    }, { once: true });
  }

  deleteDoc(ref); // Firestore 삭제 (UI 제거는 이미 완료)

  popupOverlay.style.display = "none";
  currentOrnamentId = null;
};

/* ============================================
   ❄️ 눈 생성 로직
============================================ */
function createSnow() {
  const snow = document.createElement("div");
  snow.className = "snowflake";
  snow.textContent = "❄";

  const treeRect = treeArea.getBoundingClientRect();

  // 랜덤 가로 위치
  snow.style.left = Math.random() * treeRect.width + "px";

  // 랜덤 크기
  const size = 8 + Math.random() * 14; 
  snow.style.fontSize = size + "px";

  // 랜덤 지속 시간
  const duration = 4 + Math.random() * 6;
  snow.style.animationDuration = duration + "s";

  // 랜덤 좌우 흔들림 추가
  snow.style.animationTimingFunction = "ease-in-out";

  treeArea.appendChild(snow);

  // 애니메이션 끝나면 자동 삭제
  setTimeout(() => snow.remove(), duration * 1000);
}

// 초당 4~7개 눈 생성
setInterval(createSnow, 100);
