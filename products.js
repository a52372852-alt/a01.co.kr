// NS HOME 계절 상품 데이터베이스 (총 6개 라인업)
const PRODUCTS = [
  {
    id: "ns-knee-blanket-gray",
    name: "NS 코지 극세사 무릎담요 (코지 그레이)",
    subtitle: "모던하고 차분한 북유럽 무드 • 100x150cm 감성 포근 무릎담요",
    season: "winter",
    isBest: true,
    isNew: true,
    price: 26000,
    rating: 4.98,
    reviewCount: 426,
    images: [
      "images/blanket_knee_thumb.jpg"
    ],
    detailImages: [
      "images/detail/knee_detail_01.png",
      "images/detail/knee_detail_02.png",
      "images/detail/knee_detail_03.png",
      "images/detail/knee_detail_04.png",
      "images/detail/knee_detail_05.png",
      "images/detail/knee_detail_06.png",
      "images/detail/knee_detail_07.png",
      "images/detail/knee_detail_08.png",
      "images/detail/knee_detail_09.png",
      "images/detail/knee_detail_10.png",
      "images/detail/knee_detail_11.png",
      "images/detail/knee_detail_12.png",
      "images/detail/knee_detail_13.png",
      "images/detail/knee_detail_14.png",
      "images/detail/knee_detail_15.png"
    ],
    badge: "베스트 1위",
    tags: ["무릎담요", "극세사섬유", "코지그레이", "차량/캠핑용", "사무실/소파용"],
    description: "어떤 인테리어에도 세련되게 어울리는 코지 그레이 컬러입니다. 털 빠짐 없이 부드럽고 가벼우며, 랩탑 작업이나 독서, 차박 및 캠핑 시 간편하게 둘러주기 가장 알맞은 볼륨감으로 제작되었습니다.",
    colors: [
      { name: "코지 그레이", hex: "#C7C9CC", extraPrice: 0 },
      { name: "코지 베이지", hex: "#EAE0D0", extraPrice: 0 },
      { name: "코지 블루", hex: "#8DA4C4", extraPrice: 0 }
    ],
    sizes: [
      { name: "무릎담요 (100 x 150cm)", extraPrice: 0 }
    ],
    details: [
      { label: "상품명", value: "NS 코지 극세사 무릎담요" },
      { label: "규격/사이즈", value: "무릎담요 (100 x 150cm)" },
      { label: "소재", value: "프리미엄 A-CLASS 고밀도 극세사 플리스 100%" },
      { label: "마감", value: "헤링본 엣지 파이핑 세련된 밴딩 마감" },
      { label: "세탁방법", value: "세탁망 사용 울코스 찬물 세탁, 자연 건조 권장" }
    ]
  },
  {
    id: "ns-knee-blanket-beige",
    name: "NS 코지 극세사 무릎담요 (코지 베이지)",
    subtitle: "닿는 순간 차오르는 따스함 • 100x150cm 감성 포근 무릎담요",
    season: "winter",
    isBest: true,
    isNew: true,
    price: 26000,
    rating: 4.95,
    reviewCount: 382,
    images: [
      "images/blanket_knee_thumb.jpg"
    ],
    detailImages: [
      "images/detail/knee_detail_01.png",
      "images/detail/knee_detail_02.png",
      "images/detail/knee_detail_03.png",
      "images/detail/knee_detail_04.png",
      "images/detail/knee_detail_05.png",
      "images/detail/knee_detail_06.png",
      "images/detail/knee_detail_07.png",
      "images/detail/knee_detail_08.png",
      "images/detail/knee_detail_09.png",
      "images/detail/knee_detail_10.png",
      "images/detail/knee_detail_11.png",
      "images/detail/knee_detail_12.png",
      "images/detail/knee_detail_13.png",
      "images/detail/knee_detail_14.png",
      "images/detail/knee_detail_15.png"
    ],
    badge: "인기 추천",
    tags: ["무릎담요", "극세사섬유", "코지베이지", "기계세탁", "사무실/소파용"],
    description: "NS HOME 3 COLORS LAP BLANKET 컬렉션의 대표 컬러 코지 베이지입니다. 촘촘하고 부드러운 극세사 섬유 사이에 미세한 공기층이 형성되어 몸 주변의 온기를 붙잡아 따뜻하게 감싸줍니다. 거실 소파, 사무실, 학교 등 머무는 곳 어디서나 가볍고 포근하게 체온을 지켜줍니다.",
    colors: [
      { name: "코지 베이지", hex: "#EAE0D0", extraPrice: 0 },
      { name: "코지 그레이", hex: "#C7C9CC", extraPrice: 0 },
      { name: "코지 블루", hex: "#8DA4C4", extraPrice: 0 }
    ],
    sizes: [
      { name: "무릎담요 (100 x 150cm)", extraPrice: 0 }
    ],
    details: [
      { label: "상품명", value: "NS 코지 극세사 무릎담요" },
      { label: "규격/사이즈", value: "무릎담요 (100 x 150cm)" },
      { label: "소재", value: "프리미엄 A-CLASS 고밀도 극세사 플리스 100%" },
      { label: "마감", value: "헤링본 엣지 파이핑 세련된 밴딩 마감" },
      { label: "세탁방법", value: "세탁망 사용 울코스 찬물 세탁, 자연 건조 권장" }
    ]
  },
  {
    id: "ns-knee-blanket-blue",
    name: "NS 코지 극세사 무릎담요 (코지 블루)",
    subtitle: "화사하고 포근한 파스텔 톤 • 100x150cm 감성 포근 무릎담요",
    season: "winter",
    isBest: false,
    isNew: true,
    price: 26000,
    rating: 4.9,
    reviewCount: 185,
    images: [
      "images/blanket_knee_thumb.jpg"
    ],
    detailImages: [
      "images/detail/knee_detail_01.png",
      "images/detail/knee_detail_02.png",
      "images/detail/knee_detail_03.png",
      "images/detail/knee_detail_04.png",
      "images/detail/knee_detail_05.png",
      "images/detail/knee_detail_06.png",
      "images/detail/knee_detail_07.png",
      "images/detail/knee_detail_08.png",
      "images/detail/knee_detail_09.png",
      "images/detail/knee_detail_10.png",
      "images/detail/knee_detail_11.png",
      "images/detail/knee_detail_12.png",
      "images/detail/knee_detail_13.png",
      "images/detail/knee_detail_14.png",
      "images/detail/knee_detail_15.png"
    ],
    badge: "시즌 신상",
    tags: ["무릎담요", "극세사섬유", "코지블루", "감성홈카페", "학생/사무실"],
    description: "은은하고 고급스러운 톤다운 파스텔 블루 컬러로 공간에 화사한 생기를 불어넣어 줍니다. 도톰한 볼륨감과 가벼운 무게감으로 오랜 시간 무릎 위에 얹어두어도 편안합니다.",
    colors: [
      { name: "코지 블루", hex: "#8DA4C4", extraPrice: 0 },
      { name: "코지 베이지", hex: "#EAE0D0", extraPrice: 0 },
      { name: "코지 그레이", hex: "#C7C9CC", extraPrice: 0 }
    ],
    sizes: [
      { name: "무릎담요 (100 x 150cm)", extraPrice: 0 }
    ],
    details: [
      { label: "상품명", value: "NS 코지 극세사 무릎담요" },
      { label: "규격/사이즈", value: "무릎담요 (100 x 150cm)" },
      { label: "소재", value: "프리미엄 A-CLASS 고밀도 극세사 플리스 100%" },
      { label: "마감", value: "헤링본 엣지 파이핑 세련된 밴딩 마감" },
      { label: "세탁방법", value: "세탁망 사용 울코스 찬물 세탁, 자연 건조 권장" }
    ]
  },
  {
    id: "ns-blanket-cashmere",
    name: "NS 시그니처 캐시미어 울 블랭킷",
    subtitle: "공간을 완성하는 북유럽 감성 헤링본 캐시미어 블렌드",
    season: "winter",
    isBest: true,
    isNew: false,
    price: 64000,
    rating: 4.95,
    reviewCount: 528,
    images: [
      "images/blanket_cashmere.jpg",
      "images/hero.jpg"
    ],
    badge: "프리미엄 라인",
    tags: ["캐시미어 블렌드", "핸드크래프트 수술", "고급 인테리어"],
    description: "최상급 몽골리안 캐시미어와 파인 메리노 울을 블렌딩하여 실크처럼 부드럽고 가벼우면서도 탁월한 보온성을 자랑합니다. 소파나 침대 위 어디에나 자연스럽게 녹아드는 내추럴 뉴트럴 톤의 감성 블랭킷입니다.",
    colors: [
      { name: "소프트 오트밀", hex: "#D8CBB5", extraPrice: 0 },
      { name: "웜 샌드 아이보리", hex: "#F3EDE2", extraPrice: 0 },
      { name: "클래식 차콜", hex: "#4A4744", extraPrice: 0 }
    ],
    sizes: [
      { name: "레귤러 (130 x 170cm)", extraPrice: 0 },
      { name: "라지 (150 x 200cm)", extraPrice: 18000 }
    ],
    details: [
      { label: "소재", value: "파인 울 70% + 퓨어 캐시미어 30%" },
      { label: "가공", value: "헤링본 위빙 & 브러시드 피니시" },
      { label: "세탁방법", value: "드라이클리닝 권장 (또는 중성세제 미온수 단독 손세탁)" }
    ]
  },
  {
    id: "ns-summer-parasol",
    name: "NS 올데이 암막 초경량 린넨 양우산",
    subtitle: "자외선 99.9% 완벽 차단 • 비와 햇빛을 모두 막아주는 사계절 양우산",
    season: "summer",
    isBest: true,
    isNew: false,
    price: 32000,
    rating: 4.91,
    reviewCount: 840,
    images: [
      "images/parasol.jpg"
    ],
    badge: "여름 완판템",
    tags: ["UPF50+ 차단", "초경량 198g", "티타늄 암막 코팅", "양우산 겸용"],
    description: "초고밀도 린넨 텍스처 패브릭 안쪽에 4중 블랙 티타늄 암막 코팅을 적용하여 뜨거운 태양열과 자외선을 99.9% 반사 차단합니다. 카본 파이버 8K 살대를 적용하여 198g의 초경량 무게와 든든한 내풍성을 동시에 제공합니다.",
    colors: [
      { name: "내추럴 린넨 베이지", hex: "#E6DFD3", extraPrice: 0 },
      { name: "세이지 올리브 그린", hex: "#8A9A86", extraPrice: 0 },
      { name: "매트 딥 네이비", hex: "#2B3A4A", extraPrice: 0 }
    ],
    sizes: [
      { name: "3단 컴팩트 수동 폴딩 (접었을 때 24cm)", extraPrice: 0 }
    ],
    details: [
      { label: "원단", value: "300T 고밀도 린넨 텍스처 + 4중 티타늄 암막 코팅" },
      { label: "살대", value: "고강도 항공 알루미늄 + 카본 파이버 8K" },
      { label: "무게", value: "약 198g (초경량 설계)" }
    ]
  },
  {
    id: "ns-summer-neck-cooler",
    name: "NS 하이브리드 에어로 아이스 넥쿨러",
    subtitle: "체감 온도 -12℃ 즉각 쿨링 • 반도체 펠티어 소자 탑재",
    season: "summer",
    isBest: true,
    isNew: false,
    price: 49000,
    rating: 4.86,
    reviewCount: 1890,
    images: [
      "images/neck_cooler.jpg"
    ],
    badge: "여름 혁신템",
    tags: ["펠티어 냉각판", "360도 3단 입체 바람", "저소음 BLDC", "최대 16시간"],
    description: "목 뒤 경추 부위를 3초 만에 얼음처럼 차갑게 식혀주는 반도체 냉각 펠티어 플레이트와 360도 서라운드 듀얼 팬이 결합된 하이엔드 웨어러블 넥쿨러입니다. 인체공학적 C타입 디자인으로 목에 무리 없는 착용감을 선사합니다.",
    colors: [
      { name: "오프 화이트 로즈골드", hex: "#F5F3EF", extraPrice: 0 },
      { name: "매트 미드나잇 그레이", hex: "#3A3D40", extraPrice: 0 }
    ],
    sizes: [
      { name: "원사이즈 프리 (실리콘 플렉서블 밴드 조절)", extraPrice: 0 }
    ],
    details: [
      { label: "배터리", value: "4,000mAh 대용량 배터리 (최장 16시간 연속 가동)" },
      { label: "충전", value: "USB Type-C 고속 충전 (완충 약 2.5시간)" },
      { label: "소음", value: "28dB 도서관 수준 저소음 BLDC 모터" }
    ]
  }
];

// 고객 실제 리뷰 데이터
const REVIEWS = [
  {
    author: "김*진 님 (공식몰 실구매자)",
    product: "NS 코지 극세사 무릎담요 (코지 베이지)",
    rating: 5,
    date: "2024.11.02",
    title: "보들보들함이 차원이 달라요! 털 빠짐 전혀 없음",
    content: "사무실에서 쓰려고 코지 베이지 샀는데 살결 닿는 순간 온기가 확 올라와요. 세탁기 울코스로 돌려도 털 뭉침이나 빠짐 1도 없고 테두리 파이핑 마감도 너무 깔끔합니다. 소파용으로 그레이도 하나 더 주문했어요!",
    verified: true
  },
  {
    author: "정*희 님 (공식몰 구매자)",
    product: "NS 코지 극세사 무릎담요 (코지 그레이)",
    rating: 5,
    date: "2024.11.10",
    title: "강아지가 이 담요만 보면 올라와서 자요 ㅎㅎ",
    content: "너무 두껍지 않고 딱 가볍게 포근해서 컴퓨터 할 때 무릎에 덮기 딱 좋아요. 색상도 튀지 않고 모던해서 거실 인테리어 해치지 않아서 대만족입니다.",
    verified: true
  },
  {
    author: "박*연 님 (공식몰 구매자)",
    product: "NS 시그니처 캐시미어 울 블랭킷",
    rating: 5,
    date: "2024.11.18",
    title: "결혼 선물로 샀는데 고급스러움 그 자체",
    content: "부티크 호텔에서 쓸 법한 재질이에요. 헤링본 짜임새가 너무 단단하고 가벼운데 덮으면 온몸이 훈훈해집니다. 포장 패키징도 리본 묶여서 너무 정성스러웠어요.",
    verified: true
  },
  {
    author: "이*호 님 (공식몰 실구매자)",
    product: "NS 올데이 암막 초경량 린넨 양우산",
    rating: 5,
    date: "2024.08.10",
    title: "여름 내내 제 필수템이었습니다",
    content: "한여름 땡볕에 이거 쓰고 안 쓰고 체감 온도 차이가 어마어마해요. 린넨 소재라 양산 특유의 촌스러움이 전혀 없고 진짜 가볍습니다.",
    verified: true
  }
];
