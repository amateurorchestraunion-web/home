import {
  db, collection, doc, setDoc, getDoc, deleteDoc, onSnapshot
} from "./firebase.js";

console.log("Tree.js loaded");

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

/* 오너먼트 12개 자동 생성 */
for (let i = 1; i <= 12; i++) {
  const img = document.createElement("img");
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

/* 패널 닫기 */
document.querySelector(".close-panel").onclick = () => {
  document.body.classList.remove("panel-open");
  document.body.classList.add("panel-closed");
};

/* 패널 열기 (플로팅 버튼 클릭) */
floatingBtn.onclick = () => {
  document.body.classList.add("panel-open");
  document.body.classList.remove("panel-closed");
};

/* 트리 드래그&드롭 */
treeArea.addEventListener("dragover", (e) => e.preventDefault());

treeArea.addEventListener("drop", async (e) => {
  e.preventDefault();

  const src = e.dataTransfer.getData("src");

  const rect = treeArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ornamentDoc = doc(collection(db, "ornaments"));
  await setDoc(ornamentDoc, {
    id: ornamentDoc.id,
    src, x, y,
    hasMemo: false
  });

  placeOrnament(ornamentDoc.id, src, x, y);
});

/* 배치 함수 */
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

/* Firestore 실시간 반영 */
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

/* 팝업 열기 */
async function openPopup(ornamentId) {
  currentOrnamentId = ornamentId;

  popupOverlay.style.display = "flex";

  // 패널 닫기
  document.body.classList.remove("panel-open");
  document.body.classList.add("panel-closed");

  loadMemoList();
}

/* 팝업 닫기 */
closePopupBtn.onclick = () => {
  popupOverlay.style.display = "none";
};

/* 메모 로드 */
function loadMemoList() {
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

        box.innerHTML = `
          <div class="memo-timestamp">${new Date(d.timestamp).toLocaleString("ko-KR")}</div>
          <div>${d.text}</div>
        `;

        const delBtn = document.createElement("span");
        delBtn.textContent = "✕";
        delBtn.style.float = "right";
        delBtn.style.cursor = "pointer";

        delBtn.onclick = async () => {
          await deleteDoc(
            doc(db, "ornaments", currentOrnamentId, "memoList", docu.id)
          );
        };

        box.appendChild(delBtn);
        memoListBox.appendChild(box);
      });
  });
}

/* 메모 입력 */
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

/* 오너먼트 삭제 */
deleteBtn.onclick = async () => {
  const ornamentRef = doc(db, "ornaments", currentOrnamentId);
  const ornamentSnap = await getDoc(ornamentRef);

  if (!ornamentSnap.exists()) return;

  if (ornamentSnap.data().hasMemo) {
    alert("메모가 없을 때만 삭제 가능합니다.");
    return;
  }

  if (confirm("삭제할까요?")) {
    await deleteDoc(ornamentRef);
    popupOverlay.style.display = "none";
  }
};
