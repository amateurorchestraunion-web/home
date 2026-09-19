// ============================================================
// AOU 역대 공연 / 포스터 데이터
// ============================================================

const concertData = [
  {
    date: "2015.01",
    eventDate: "2015.01.03",
    title: "The Miracle",
    conductor: "이은구",
    image: "assets/img/aou/poster/2015_01.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVTsV7dL6jF1Qxg8_5_YKx9y&si=mTXABBFvgfaxQdem"
  },
  {
    date: "2015.07",
    eventDate: "2015.07.04",
    title: "한재만",
    conductor: "이은구",
    image: "assets/img/aou/poster/2015_07.jpg",
    youtube: null
  },
  {
    date: "2016.01",
    eventDate: "2016.01.08",
    title: "人間",
    conductor: "이은구",
    image: "assets/img/aou/poster/2016_01.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVT5E8rffZQH533VlVg20eb9&si=sU-vR0n6rIgzh2hQ"
  },
  {
    date: "2016.07",
    eventDate: "2016.07.10",
    title: "Opera Gala Concert",
    conductor: "이은구",
    image: "assets/img/aou/poster/2016_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVQA_aAe8KfX5jtAT5XH-Ybc&si=dGhonih6VwTQH4Kd"
  },
  {
    date: "2017.01",
    eventDate: "2017.01.06",
    title: "Romance",
    conductor: "이은구",
    image: "assets/img/aou/poster/2017_01.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVTjdxcDcqTEU-Yz_FzaxdSL&si=6_3qFEX5CWaFGBAo"
  },
  {
    date: "2017.07",
    eventDate: "2017.07.01",
    title: "千一夜話",
    conductor: "이은구",
    image: "assets/img/aou/poster/2017_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVSY8Nqo0Z4IQELOkK6yY7a4&si=mtIR9NcgjlreNKbU"
  },
  {
    date: "2018.01",
    eventDate: "2018.01.06",
    title: "Triumph",
    conductor: "이은구",
    image: "assets/img/aou/poster/2018_01.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVSf6H3SAe2KR9I8rSztVDDZ&si=N584beoP9r9qi_on"
  },
  {
    date: "2018.07",
    eventDate: "2018.07.07",
    title: "HIDDEN TREASURE",
    conductor: "이은구",
    image: "assets/img/aou/poster/2018_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVT-FWp4eAAU5aALnlbvRfkU&si=YBFkrh1XCzoLJb6b"
  },
  {
    date: "2019.01",
    eventDate: "2019.01.12",
    title: "All For You",
    conductor: "이은구",
    image: "assets/img/aou/poster/2019_01.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVQAPZxD2vqXHWpE_RC6XDVn&si=r1mpI3oAaZtJ2FMO"
  },
  {
    date: "2019.07",
    eventDate: "2019.07.06",
    title: "Masterpiece",
    conductor: "박대명",
    image: "assets/img/aou/poster/2019_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVQy5XMqN3UvFj7O_r0kdgC0&si=XzEi96fUlm4upmr1"
  },

  {
    date: "2020.01",
    eventDate: "2020.01.04",
    title: "Shall we dance?",
    conductor: "박대명",
    image: "assets/img/aou/poster/2020_01.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVS8dAjkc0ri-sVf8dQOWw_B&si=PvAlFuOLEPcFrndV"
  },
  {
    date: "2020.07",
    eventDate: "2020.07.11",
    title: "La Lumière",
    conductor: "박대명",
    image: "assets/img/aou/poster/2020_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVRb4qadTahv6Zrj7Ya02EQY&si=V1v0cA0Isjwj1oaz"
  },
  {
    date: "2021.01",
    eventDate: "2021.01.09",
    title: "with",
    conductor: "박대명",
    image: "assets/img/aou/poster/2021_01.jpg",
    youtube: null,
    cancelled: true
  },
  {
    date: "2021.07",
    eventDate: "2021.07",
    title: "Origin",
    conductor: "박대명",
    image: "assets/img/aou/poster/2021_07.jpg",
    youtube: null,
    cancelled: true
  },
  {
    date: "2022.01",
    eventDate: "2022.01.08",
    title: "THE MUSE",
    conductor: "박대명",
    image: "assets/img/aou/poster/2022_01.png",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVRRyaaOrqRfOya0-4lZzZnS&si=DTjgszHJbdl1OgNB"
  },
  {
    date: "2022.07",
    eventDate: "2022.07.16",
    title: "MONOMYTH",
    conductor: "박대명",
    image: "assets/img/aou/poster/2022_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVRTb2zm9nlp_zdLfnkgEFD6&si=LhfM6p3JxKD5idHN"
  },
  {
    date: "2023.01",
    eventDate: "2023.01.15",
    title: "Phantasia",
    conductor: "박대명",
    image: "assets/img/aou/poster/2023_01.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVTlqFw3H5yZJe94pbHamqXi&si=guwAL3C7mgv5VmsX"
  },
  {
    date: "2023.07",
    eventDate: "2023.07.08",
    title: "PASSIONNER",
    conductor: "박대명",
    image: "assets/img/aou/poster/2023_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVQzfmmIRvEd9jCOfZIIQveK&si=iSsOWop7diopHCxV"
  },
  {
    date: "2024.01",
    eventDate: "2024.01.13",
    title: "Finale",
    conductor: "박대명",
    image: "assets/img/aou/poster/2024_01.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVS_MUoq3qhcdOo2gppRzjwR&si=eEieNg5RkL31O2zb"
  },
  {
    date: "2024.07",
    eventDate: "2024.07.13",
    title: "TOWARD",
    conductor: "박대명",
    image: "assets/img/aou/poster/2024_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVTQ6oRdMNTDBkfsa5fGzwtU&si=mDd0UDQFTnaTN8my"
  },

  {
    date: "2025.01",
    eventDate: "2025.01.04",
    title: "MIRACLE",
    conductor: "박대명",
    image: "assets/img/aou/poster/2025_01.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVQPZwC3JatyRVSv-iZLfW7C&si=7gQ-kOneMu5FSOnV"
  },
  {
    date: "2025.07",
    eventDate: "2025.07.05",
    title: "無我",
    conductor: "박대명",
    image: "assets/img/aou/poster/2025_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVTnXwiRAk94rbjgz18XBkH5&si=0Ye3ZVOCqJFnTwvc"
  },
  {
    date: "2026.01",
    eventDate: "2026.01.10",
    title: "L'amour",
    conductor: "박대명",
    image: "assets/img/aou/poster/2026_01.jpg",
    youtube: "https://youtu.be/MjTZ2MnpCGo?si=WX9Fy-4iAuLLa4KB"
  },
  {
    date: "2026.07",
    eventDate: "2026.07.26",
    title: "Horizon",
    conductor: "박대명",
    image: "assets/img/aou/poster/2026_07.jpg",
    youtube: "https://youtube.com/playlist?list=PLr_otynMkFVTnXwiRAk94rbjgz18XBkH5&si=0Ye3ZVOCqJFnTwvc"
  }
];


// ============================================================
// 연도에 따른 필터 자동 지정
// ============================================================

function getConcertFilter(date) {
  const year = Number(date.substring(0, 4));

  if (year >= 2015 && year <= 2019) {
    return "filter-2015";
  }

  if (year >= 2020 && year <= 2024) {
    return "filter-2020";
  }

  if (year >= 2025 && year <= 2029) {
    return "filter-2025";
  }

  return "";
}


// ============================================================
// GLightbox 갤러리 그룹 자동 지정
// 기존 HTML 구조 그대로 유지
// ============================================================

function getConcertGallery(date) {
  const year = Number(date.substring(0, 4));

  if (year <= 2019) {
    return "portfolio-gallery-app";
  }

  return "portfolio-gallery-product";
}


// ============================================================
// 공연 포스터 HTML 자동 생성
// ============================================================

const concertList = document.getElementById("concert-list");

if (concertList) {

  // 날짜순 자동 정렬
  // 앞으로 데이터를 아무 위치에 추가해도 화면에서는 연도순으로 정렬됨
  concertData.sort(function (a, b) {
    return a.date.localeCompare(b.date);
  });


  concertData.forEach(function (concert) {

    // --------------------------------------------------------
    // 공연 하나를 감싸는 div
    // --------------------------------------------------------

    const item = document.createElement("div");

    item.className =
      "col-6 col-md-4 portfolio-item isotope-item " +
      getConcertFilter(concert.date);

    item.dataset.date = concert.date.replace(".", "-");


    // --------------------------------------------------------
    // portfolio-content
    // --------------------------------------------------------

    const portfolioContent = document.createElement("div");
    portfolioContent.className = "portfolio-content h-100";


    // --------------------------------------------------------
    // 포스터 이미지
    // --------------------------------------------------------

    const image = document.createElement("img");

    image.src = concert.image;
    image.className = "img-fluid";
    image.alt = `AOU ${concert.date} ${concert.title} 포스터`;

    portfolioContent.appendChild(image);


    // --------------------------------------------------------
    // 포스터 위에 나타나는 상세 정보
    // --------------------------------------------------------

    const info = document.createElement("div");
    info.className = "portfolio-info";


    // 연월
    const dateTitle = document.createElement("h4");
    dateTitle.textContent = concert.date;

    info.appendChild(dateTitle);


    // 공연명 / 공연일 / 지휘자
    const description = document.createElement("p");

    const titleText =
      `<${concert.title}>` +
      (concert.cancelled ? " - 취소" : "");

    description.appendChild(
      document.createTextNode(titleText)
    );

    description.appendChild(
      document.createElement("br")
    );

    description.appendChild(
      document.createTextNode(concert.eventDate)
    );

    description.appendChild(
      document.createElement("br")
    );

    description.appendChild(
      document.createTextNode(`지휘: ${concert.conductor}`)
    );

    info.appendChild(description);


    // --------------------------------------------------------
    // 포스터 확대 버튼
    // --------------------------------------------------------

    const previewLink = document.createElement("a");

    previewLink.href = concert.image;
    previewLink.dataset.gallery = getConcertGallery(concert.date);
    previewLink.className = "glightbox preview-link";

    const previewIcon = document.createElement("i");
    previewIcon.className = "bi bi-zoom-in";

    previewLink.appendChild(previewIcon);
    info.appendChild(previewLink);


    // --------------------------------------------------------
    // 유튜브 링크
    // youtube가 null이면 버튼 자체를 만들지 않음
    // --------------------------------------------------------

    if (concert.youtube) {

      const youtubeLink = document.createElement("a");

      youtubeLink.href = concert.youtube;
      youtubeLink.className = "details-link";
      youtubeLink.target = "_blank";
      youtubeLink.rel = "noopener noreferrer";

      const youtubeIcon = document.createElement("i");
      youtubeIcon.className = "bi bi-link-45deg";

      youtubeLink.appendChild(youtubeIcon);
      info.appendChild(youtubeLink);
    }


    // --------------------------------------------------------
    // 완성된 공연 항목을 concert-list에 삽입
    // --------------------------------------------------------

    portfolioContent.appendChild(info);
    item.appendChild(portfolioContent);

    concertList.appendChild(item);
  });
}