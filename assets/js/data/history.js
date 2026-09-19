// ============================================================
// AOU 연혁 데이터
// ============================================================

const historyData = [
  {
    date: "2014. 6.",
    content: [
      "AOU 창단. 17개 오케스트라 연합으로 시작",
      "AOU 공식 페이스북 오픈",
      "제1회 정기회의 개최"
    ]
  },
  {
    date: "2014. 07.",
    content: [
      "아마추어 오케스트라 공동 버스 대절 사업 계획, 공동 인쇄 사업 계획"
    ]
  },
  {
    date: "2014. 09.",
    content: [
      "오페라마 세레나데 뮤직비디오 촬영 지원"
    ]
  },
  {
    date: "2014. 12.",
    content: [
      "각 오케스트라 공연 인터뷰 진행"
    ]
  },
  {
    date: "2015. 01.",
    content: [
      "첫 프로젝트 오케스트라 <Miracle>"
    ]
  },
  {
    date: "2015. 03.",
    content: [
      "“모두를 위한 오케스트라” 세종문화회관 초청공연"
    ]
  },
  {
    date: "2015. 04.",
    content: [
      "서울시향과 함께 하는 <Seoul Street Symphony Project>"
    ]
  },
  {
    date: "2015. 04.",
    content: [
      "서울시립교향악단 10주년 기념 앙코르 참여"
    ]
  },
  {
    date: "2015. 07.",
    content: [
      "<한재만> 챔버 오케스트라"
    ]
  },
  {
    date: "2016. 01.",
    content: [
      "AOU 2016 신년음악회 <人間>"
    ]
  },
  {
    date: "2016. 07.",
    content: [
      "AOU 2016 프로젝트 연주회 <Opera Gala Concert>"
    ]
  },
  {
    date: "2017. 01.",
    content: [
      "AOU 2017 신년음악회 <Romance>"
    ]
  },
  {
    date: "2017. 07.",
    content: [
      "AOU 2017 프로젝트 연주회 <千一夜話>"
    ]
  },
  {
    date: "2018. 01.",
    content: [
      "AOU 2018 신년음악회 <Triumph>"
    ]
  },
  {
    date: "2018. 07.",
    content: [
      "AOU 2018 프로젝트 연주회 <HIDDEN TREASURE>"
    ]
  },
  {
    date: "2019. 01.",
    content: [
      "AOU 2019 신년음악회 <All For You>"
    ]
  },
  {
    date: "2019. 07.",
    content: [
      "AOU 2019 프로젝트 연주회 <Masterpiece>"
    ]
  },
  {
    date: "2019. 09.",
    content: [
      "제 6회 서울생활예술오케스트라축제"
    ]
  },
  {
    date: "2020. 01.",
    content: [
      "AOU 2020 신년음악회 <Shall we dance?>"
    ]
  },
  {
    date: "2020. 07.",
    content: [
      "AOU 2020 프로젝트 연주회 <La Lumière>"
    ]
  },
  {
    date: "2021. 01.",
    content: [
      "AOU 2021 신년음악회 <with>"
    ]
  },
  {
    date: "2022. 01.",
    content: [
      "AOU 2022 신년음악회 <THE MUSE>"
    ]
  },
  {
    date: "2022. 07.",
    content: [
      "AOU 프로젝트 연주회 <MONOMYTH>"
    ]
  },
  {
    date: "2023. 01.",
    content: [
      "AOU 2023 신년음악회 <Phantasia>"
    ]
  },
  {
    date: "2023. 07.",
    content: [
      "AOU 프로젝트 연주회 <PASSIONNER>"
    ]
  },
  {
    date: "2024. 01.",
    content: [
      "AOU 2024 신년음악회 <Finale>"
    ]
  },
  {
    date: "2024. 07.",
    content: [
      "AOU 프로젝트 연주회 <TOWARD>"
    ]
  },
  {
    date: "2024. 10.",
    content: [
      "공식 카페 오픈"
    ]
  },
  {
    date: "2025. 01.",
    content: [
      "AOU 2025 10주년 연주회 <MIRACLE-a new decade>"
    ]
  },
  {
    date: "2025. 07.",
    content: [
      "AOU 프로젝트 연주회 無我 | 무아"
    ]
  },
  {
    date: "2026. 01.",
    content: [
      "AOU 2026 신년연주회 <L'amour>"
    ]
  },
  {
    date: "2026. 07.",
    content: [
      "AOU 프로젝트 연주회 <Horizon>"
    ]
  },
  {
    date: "2027. 01.",
    content: [
      "AOU 2027 신년연주회 <Odyssey>"
    ]
  }
];


// ============================================================
// 연혁 HTML 자동 생성
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  const historyList = document.getElementById("history-list");

  // history-list가 없는 페이지에서는 실행하지 않음
  if (!historyList) {
    return;
  }

  historyData.forEach(function (item) {

    // 연혁 한 항목
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item mb-3";


    // 날짜
    const date = document.createElement("div");
    date.className = "timeline-date text-dark";
    date.textContent = item.date;


    // 내용
    const content = document.createElement("div");
    content.className = "timeline-content";


    // content 배열에 여러 문장이 있을 경우 <br>로 줄바꿈
    item.content.forEach(function (line, index) {

      if (index > 0) {
        content.appendChild(document.createElement("br"));
      }

      content.appendChild(document.createTextNode(line));
    });


    // 날짜 + 내용을 timeline-item에 넣기
    timelineItem.appendChild(date);
    timelineItem.appendChild(content);


    // 완성된 항목을 history-list에 넣기
    historyList.appendChild(timelineItem);
  });

});