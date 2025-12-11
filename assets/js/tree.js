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
  const treeRect = treeImg.getBoundingClientRect();
  const xRatio = x / treeRect.width;
  const yRatio = y / treeRect.height;
  
  await setDoc(ornamentDoc, { 
    id: ornamentDoc.id, 
    src, 
    xRatio, 
    yRatio, 
    hasMemo: false 
  });

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
  
  const rect = treeImg.getBoundingClientRect();
  const actualX = rect.left + rect.width * xRatio;
  const actualY = rect.top + rect.height * yRatio;
  
  img.style.left = `${actualX}px`;
  img.style.top = `${actualY}px`;
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
   화면 크기 변화 시 오너먼트 재배치
============================================================ */
window.addEventListener("resize", () => updateAllOrnaments());

function updateAllOrnaments() {
  const ornaments = document.querySelectorAll(".placed");

  ornaments.forEach((o) => {
    const xRatio = parseFloat(o.dataset.xratio);
    const yRatio = parseFloat(o.dataset.yratio);

    const rect = treeImg.getBoundingClientRect();
    const newX = rect.width * xRatio;
    const newY = rect.height * yRatio;

    const size = getOrnamentSize();

    o.style.width = `${size}px`;
    o.style.left = `${newX}px`;
    o.style.top = `${newY}px`;
  });
}
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

/* ============================================================
   팝업 열기
============================================================ */
function openPopup(id) {
  currentOrnamentId = id;
  popupOverlay.style.display = "flex";
  loadMemoList();
}

/* ============================================================
   팝업 닫기
============================================================ */
closePopupBtn.onclick = () => {
  popupOverlay.style.display = "none";
};


/* ============================================================
   메모 불러오기
============================================================ */
async function loadMemoList() {
  memoListBox.innerHTML = "";

  const memoCol = collection(db, "ornaments", currentOrnamentId, "memoList");

  onSnapshot(memoCol, async (snapshot) => {
    memoListBox.innerHTML = "";

    // 메모 없으면 hasMemo = false로 업데이트
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

/* ============================================================
   메모 입력
============================================================ */
memoInput.addEventListener("keydown", (e) => {
  // Shift+Enter → 줄바꿈
  if (e.key === "Enter" && e.shiftKey) return;

  // Enter → 전송
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
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
   오너먼트 삭제
============================================================ */
deleteBtn.onclick = async () => {
  const ref = doc(db, "ornaments", currentOrnamentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  if (snap.data().hasMemo) {
    alert("메모가 없을 때만 삭제 가능합니다.");
    return;
  }

  if (confirm("정말 삭제하시겠습니까?")) {
    await deleteDoc(ref);
    popupOverlay.style.display = "none";
    currentOrnamentId = null;
  }
};

