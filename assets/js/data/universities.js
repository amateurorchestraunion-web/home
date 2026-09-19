// ============================================================
// AOU 소속 대학 / 오케스트라 데이터
// - active: true  -> 홈페이지에 표시
// - active: false -> 과거/제외 소속으로 보관하되 홈페이지에는 미표시
// - 화면 출력 시 대학명 기준 가나다순으로 자동 정렬
// ============================================================

const universityData = [
  {
    school: "가천대학교 메디컬캠퍼스",
    orchestra: "G-clef(가천 오케스트라)",
    active: true
  },
  {
    school: "가천대학교 의과대학",
    orchestra: "Concordia",
    active: true
  },
  {
    school: "강원대학교",
    orchestra: "백령윈드오케스트라",
    active: false
  },
  {
    school: "강원대학교 (춘천캠퍼스)",
    orchestra: "Kangwon National University Sinfonia",
    active: true
  },
  {
    school: "건국대학교",
    orchestra: "KU Philharmonic",
    active: true
  },
  {
    school: "건국대학교 글로컬캠퍼스",
    orchestra: "한사랑 오케스트라",
    active: true
  },
  {
    school: "경기대학교",
    orchestra: "CHAMBER",
    active: true
  },
  {
    school: "경인교육대학교",
    orchestra: "경인교육대학교 아마추어 오케스트라 동아리 ARTE",
    active: true
  },
  {
    school: "경희대학교 국제캠퍼스",
    orchestra: "Kyunghee University Classic Orchestra(KUCO)",
    active: true
  },
  {
    school: "경희대학교 서울캠퍼스",
    orchestra: "경희대학교 MDOP",
    active: true
  },
  {
    school: "경희대학교 의과대학/의학전문대학원",
    orchestra: "경희의대/의학전문대학원 오케스트라 M.O.(Medical Orchestra)",
    active: true
  },
  {
    school: "경희대학교 한의과대학",
    orchestra: "선음(善音)",
    active: true
  },
  {
    school: "계명대학교 의과대학",
    orchestra: "프렐류드",
    active: false
  },
  {
    school: "고려대학교",
    orchestra: "고려대학교 관현악단",
    active: true
  },
  {
    school: "고려대학교 의과대학",
    orchestra: "고려대학교 의과대학 오케스트라 KUMO",
    active: true
  },
  {
    school: "공주대학교",
    orchestra: "돌체",
    active: true
  },
  {
    school: "광운대학교",
    orchestra: "DaKAPO",
    active: true
  },
  {
    school: "광주과학기술원",
    orchestra: "AKDONG",
    active: true
  },
  {
    school: "국민대학교",
    orchestra: "Kookmin Harmony With Amateurs(KookHWA)",
    active: true
  },
  {
    school: "단국대학교 의과대학",
    orchestra: "DMPO (Dankook Medical Philharmonic Orchestra)",
    active: true
  },
  {
    school: "덕성여자대학교",
    orchestra: "Music Of Duksung(M.O.Ds)",
    active: true
  },
  {
    school: "덕성여자대학교 약학과",
    orchestra: "Concerto Grosso",
    active: true
  },
  {
    school: "동국대학교",
    orchestra: "OPUS",
    active: true
  },
  {
    school: "동국대학교 다르마칼리지",
    orchestra: "DSO (Dongguk Symphony Orchestra)",
    active: true
  },
  {
    school: "동덕여자대학교 약학대학",
    orchestra: "동덕여자대학교 약학대학 오케스트라 디포(DPHO)",
    active: true
  },
  {
    school: "부산대학교",
    orchestra: "부산대학교 아마추어 오케스트라 Con Brio",
    active: false
  },
  {
    school: "서강대학교",
    orchestra: "ACES(Amateur Chamber Ensemble of Sogang, 서강오케스트라)",
    active: true
  },
  {
    school: "서울과학기술대학교",
    orchestra: "서울과학기술대학교 오케스트라 SNUTO",
    active: true
  },
  {
    school: "서울교육대학교",
    orchestra: "서울 에듀 필하모닉 오케스트라",
    active: true
  },
  {
    school: "서울대학교",
    orchestra: "서울대학교 아마추어 오케스트라 SNUPO",
    active: true
  },
  {
    school: "서울대학교 의과대학",
    orchestra: "서울의대 교향악단(SNUMO)",
    active: true
  },
  {
    school: "서울대학교 치의학대학원",
    orchestra: "덴탈 오케스트라",
    active: true
  },
  {
    school: "서울시립대학교",
    orchestra: "Cantabile",
    active: true
  },
  {
    school: "서울여자대학교",
    orchestra: "S.W.A.N (Seoul Women`s university Amateur orchestra N)",
    active: true
  },
  {
    school: "성공회대학교",
    orchestra: "SKHUbile(스쿠빌레)",
    active: true
  },
  {
    school: "성균관대학교",
    orchestra: "성균관대학교 오케스트라",
    active: true
  },
  {
    school: "성신여자대학교",
    orchestra: "Crystal(크리스탈)",
    active: true
  },
  {
    school: "세종대학교",
    orchestra: "지음(ZIUM)",
    active: true
  },
  {
    school: "숙명여자대학교",
    orchestra: "S.O.Phi.A(소피아)",
    active: true
  },
  {
    school: "숙명여자대학교 약학대학",
    orchestra: "SPHO",
    active: true
  },
  {
    school: "순천향대학교 의과대학",
    orchestra: "피아체볼레",
    active: true
  },
  {
    school: "숭실대학교",
    orchestra: "아반도네즈 오케스트라",
    active: true
  },
  {
    school: "아주대학교",
    orchestra: "APO(아주팝스오케스트라)",
    active: true
  },
  {
    school: "아주대학교 의과대학/간호대학",
    orchestra: "Medic Chamber Orchestra",
    active: true
  },
  {
    school: "연세대학교",
    orchestra: "유포니아(EUPHONIA)",
    active: true
  },
  {
    school: "연세대학교 원주의과대학",
    orchestra: "Unison(유니슨)",
    active: true
  },
  {
    school: "연세대학교 의과대학",
    orchestra: "세브란스 오케스트라",
    active: true
  },
  {
    school: "연세대학교 치과대학",
    orchestra: "연세대학교 치과대학 오케스트라(YDPO)",
    active: true
  },
  {
    school: "울산대학교 의과대학",
    orchestra: "SOME",
    active: true
  },
  {
    school: "원광대학교 약학대학",
    orchestra: "팜앙상블 오케스트라",
    active: true
  },
  {
    school: "이화여자대학교",
    orchestra: "ESAOS(Ewha Symphonious Amateur Orchestral Sounds)",
    active: true
  },
  {
    school: "이화여자대학교 약학대학",
    orchestra: "Ewha Pharmacy Orchestra (EPHO)",
    active: true
  },
  {
    school: "이화여자대학교 의학전문대학원 의과대학",
    orchestra: "Ewha Medical Orchestra",
    active: true
  },
  {
    school: "인천대학교",
    orchestra: "INU Orchestra",
    active: true
  },
  {
    school: "인하대학교",
    orchestra: "인하오케스트라",
    active: true
  },
  {
    school: "인하대학교 의과대학",
    orchestra: "Maestro(마에스트로)",
    active: true
  },
  {
    school: "전북대학교",
    orchestra: "Brillante(브릴란테)",
    active: true
  },
  {
    school: "중앙대학교",
    orchestra: "RUBATO(루바토)",
    active: true
  },
  {
    school: "중앙대학교 의과대학/간호대학",
    orchestra: "오르페우스(Orhpeus)",
    active: true
  },
  {
    school: "차의과학대학교",
    orchestra: "차 챔버 오케스트라",
    active: false
  },
  {
    school: "충남대학교",
    orchestra: "충남대학교 관현악단",
    active: true
  },
  {
    school: "충북대학교",
    orchestra: "라인필하모닉 오케스트라(Rhein Philharmonic Orchestra)",
    active: true
  },
  {
    school: "카이스트",
    orchestra: "KAIST Orchestra",
    active: true
  },
  {
    school: "포항공과대학교",
    orchestra: "포스텍 오케스트라(POSTECH ORCHESTRA)",
    active: true
  },
  {
    school: "포항공과대학교",
    orchestra: "한울림 오케스트라",
    active: true
  },
  {
    school: "한국외국어대학교",
    orchestra: "HUFSPhil",
    active: true
  },
  {
    school: "한국외국어대학교 글로벌캠퍼스",
    orchestra: "Masterpiece",
    active: true
  },
  {
    school: "한국조지메이슨대학교",
    orchestra: "IGCO (Incheon Global Campus Orchestra)",
    active: true
  },
  {
    school: "한국항공대학교",
    orchestra: "Korea Aerospace University Amateur Orchestra",
    active: true
  },
  {
    school: "한동대학교",
    orchestra: "한동 오케스트라 HGPO (Handong God’s Philharmonic Orchestra)",
    active: true
  },
  {
    school: "한성대학교",
    orchestra: "한성대학교 오케스트라 Brillante",
    active: true
  },
  {
    school: "한양대학교 ERICA 캠퍼스",
    orchestra: "ANGELUS",
    active: true
  },
  {
    school: "한양대학교 서울캠퍼스",
    orchestra: "하나클랑",
    active: true
  },
  {
    school: "한양대학교 의과대학",
    orchestra: "키론(Chiron)",
    active: true
  },
  {
    school: "홍익대학교",
    orchestra: "홍익대학교 오케스트라 HIAMO",
    active: true
  }
];


// ============================================================
// 소속 대학 HTML 자동 생성
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  const collegeList = document.getElementById("college-list");

  // college-list가 없는 페이지에서는 실행하지 않음
  if (!collegeList) {
    return;
  }

  const collator = new Intl.Collator("ko", {
    sensitivity: "base",
    numeric: true
  });

  const visibleUniversities = universityData
    .filter(function (item) {
      return item.active;
    })
    .slice()
    .sort(function (a, b) {
      const schoolOrder = collator.compare(a.school, b.school);

      // 같은 대학에 오케스트라가 여러 개 있으면 오케스트라명으로 2차 정렬
      if (schoolOrder !== 0) {
        return schoolOrder;
      }

      return collator.compare(a.orchestra, b.orchestra);
    });

  visibleUniversities.forEach(function (university) {
    const item = document.createElement("div");
    item.className = "univ-item";

    const school = document.createElement("span");
    school.className = "school";
    school.textContent = university.school;

    const separator = document.createElement("span");
    separator.className = "separator";
    separator.textContent = "|";

    const orchestra = document.createElement("span");
    orchestra.className = "orchestra";
    orchestra.textContent = university.orchestra;

    item.appendChild(school);
    item.appendChild(separator);
    item.appendChild(orchestra);

    collegeList.appendChild(item);
  });
});