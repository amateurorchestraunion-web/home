import { 
  db, collection, doc, setDoc, getDoc, deleteDoc, onSnapshot
} from "./firebase.js";

console.log("Tree.js loaded");

const treeArea = document.getElementById("tree-area");
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


/* ============================================
   패널 열기 / 닫기
============================================ */
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


/* ============================================
   오너먼트 자동 생성
============================================ */
for (let i = 1; i <= 12; i++) {
  let img = document.createElement("img");
  const num = i.toString().padStart(2, "0");
  img.src = `./assets/img/ornaments/ornament-${num}.png`;
  img.dataset.id = `orn_${num}`;
  img.draggable = true;

  img.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("oid", img.dataset.id);
    e.dataTransfer.setData("src", img.src);
  });

  ornamentGrid.appendChild(img);
}


/* ============================================
   트리 드롭
============================================ */
treeArea.addEventListener("dragover", e => e.preventDefault());

treeArea.addEventListener("drop", async (e) => {
  e.preventDefault();

  const src = e.dataTransfer.getData("src");
  if (!src) return;

  const rect = treeArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ornamentDoc = doc(collection(db, "ornaments"));
  await setDoc(ornamentDoc, { id: ornamentDoc.id, src, x, y, hasMemo: false });

  placeOrnament(ornamentDoc.id, src, x, y);
});


/* ============================================
   오너먼트 DOM 생성
============================================ */
function placeOrnament(id, src, x, y) {

  if (!id || !src) return;  // 🔥 ghost bug 완전 차단

  const img = document.createElement("img");
  img.src = src;
  img.dataset.oid = id;
  img.classList.add("placed");
  img.style.position = "absolute";
  img.style.width = "60px";
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  img.style.transform = "translate(-50%, -50%)";

  img.addEventListener("click", () => openPopup(id));

  treeArea.appendChild(img);
}


/* ============================================
   Firestore 실시간 반영
============================================ */
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


/* ============================================
   팝업 열기
============================================ */
function openPopup(id) {
  currentOrnamentId = id;
  popupOverlay.style.display = "flex";
  loadMemoList();
}


/* ============================================
   팝업 닫기
============================================ */
closePopupBtn.onclick = () => {
  popupOverlay.style.display = "none";
};


/* ============================================
   메모 불러오기
============================================ */
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

/* ============================================
   메모 입력
============================================ */
memoInput.addEventListener("keydown", (e) => {
  // Shift+Enter → 줄바꿈 허용
  if (e.key === "Enter" && e.shiftKey) return;

  // Enter → 전송
  if (e.key === "Enter") {
    e.preventDefault();

    const text = memoInput.value.trim();
    if (!text) return; // 빈 입력 방지

    sendBtn.click();   // 기존 전송 기능 그대로 사용
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

  await setDoc(doc(db, "ornaments", currentOrnamentId), { hasMemo: true }, { merge: true });

  memoInput.value = "";
};


/* ============================================
   오너먼트 삭제
============================================ */
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
  }
};
