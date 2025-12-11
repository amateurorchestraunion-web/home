/* Firebase 초기화 */
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ====== 드래그 ====== */
let selected = null;
let offsetX = 0;
let offsetY = 0;

const ornaments = document.querySelectorAll('.ornament');
const tree = document.getElementById('tree');
const polygon = document.getElementById('tree-area');

/* polygon 좌표 파싱 */
const polygonPoints = Array.from(polygon.points).map(p => [p.x, p.y]);

ornaments.forEach(o => {
  o.addEventListener('mousedown', e => {
    selected = o.cloneNode(true);
    selected.classList.add('placed');
    document.body.appendChild(selected);
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  });
});

document.addEventListener('mousemove', e => {
  if (!selected) return;
  selected.style.left = (e.pageX - offsetX) + "px";
  selected.style.top = (e.pageY - offsetY) + "px";
});

document.addEventListener('mouseup', e => {
  if (!selected) return;

  const rect = tree.getBoundingClientRect();

  const scaleX = rect.width / 1920;
  const scaleY = rect.height / 1080;

  const centerX = e.pageX;
  const centerY = e.pageY;

  const scaledPoly = polygonPoints.map(p => {
    return {
      x: rect.left + p[0] * scaleX,
      y: rect.top + p[1] * scaleY
    };
  });

  if (pointInPolygon(centerX, centerY, scaledPoly)) {
    selected.dataset.x = centerX;
    selected.dataset.y = centerY;
    selected.addEventListener('click', openMemo);
  } else {
    selected.remove();
  }

  selected = null;
});

/* ====== polygon 내부 검사 ====== */
function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }
  return inside;
}

/* ====== 메모 모달 ====== */
let activeOrnament = null;

function openMemo(e) {
  activeOrnament = e.target;
  document.getElementById('memoModal').style.display = "block";
}

document.getElementById('closeMemo').onclick = function () {
  document.getElementById('memoModal').style.display = "none";
};

document.getElementById('saveMemo').onclick = function () {
  const memo = document.getElementById('memoText').value;
  if (!activeOrnament) return;

  const id = activeOrnament.dataset.id + "_" + Date.now();

  db.collection("ornaments").doc(id).set({
    memo: memo,
    x: activeOrnament.dataset.x,
    y: activeOrnament.dataset.y
  });

  document.getElementById('memoModal').style.display = "none";
};
