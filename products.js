// NS HOME 계절 상품 데이터베이스
const PRODUCTS = [
  {
    id: "ns-blanket-fluffy",
    name: "NS 프리미엄 웜 플리스 극세사 담요",
    subtitle: "NS 시그니처 베스트셀러 • 닿는 순간 차오르는 극상의 포근함",
    season: "winter",
    isBest: true,
    isNew: true,
    price: 38900,
    originalPrice: 59000,
    discountRate: 34,
    rating: 4.9,
    reviewCount: 1420,
    images: [
      "images/blanket_fluffy.jpg",
      "images/hero.jpg"
    ],
    badge: "시그니처 1위",
    tags: ["양면 극세사", "정전기 방지", "초경량 보온", "간편 기계세탁"],
    description: "NS HOME의 시그니처 웜 플리스 담요는 고밀도 마이크로화이버 극세사 원단으로 제작되어 털 빠짐 없이 부드럽고 가볍게 체온을 유지해 줍니다. 찬 공기는 차단하고 체온을 가두는 에어셀 구조로 올겨울 당신의 휴식을 따스하게 안아드립니다.",
    colors: [
      { name: "테라코타 카멜", hex: "#B85D34", extraPrice: 0 },
      { name: "오트밀 크림", hex: "#EAE3D2", extraPrice: 0 },
      { name: "모카 브라운", hex: "#6F4E37", extraPrice: 0 }
    ],
    sizes: [
      { name: "싱글 (100 x 150cm) - 무릎/소파용", extraPrice: 0 },
      { name: "슈퍼싱글 (150 x 200cm) - 침대/거실용", extraPrice: 9000 },
      { name: "퀸 (180 x 200cm) - 패밀리/침대용", extraPrice: 16000 }
    ],
    details: [
      { label: "소재", value: "프리미엄 고밀도 마이크로화이버 플리스 100%" },
      { label: "원산지", value: "대한민국 디자인 / 엄선 파트너 제조" },
      { label: "세탁방법", value: "세탁망 사용 울코스 찬물 세탁, 자연 건조 권장" },
      { label: "품질", value: "정밀 검수 및 유해물질 불검출 안심 가공" }
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
    originalPrice: 98000,
    discountRate: 35,
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
      { label: "세탁방법", value: "드라이클리닝 권장 (또는 중성세제 미온수 단독 손세탁)" },
      { label: "인증", value: "울마크 컴퍼니 인증 원사 사용" }
    ]
  },
  {
    id: "ns-blanket-check",
    name: "NS 노르딕 플래드 체크 울 담요",
    subtitle: "아늑한 윈터 무드를 더해주는 감성 홈&캠핑 체크 블랭킷",
    season: "winter",
    isBest: false,
    isNew: true,
    price: 45000,
    originalPrice: 68000,
    discountRate: 33,
    rating: 4.88,
    reviewCount: 312,
    images: [
      "images/blanket_check.jpg"
    ],
    badge: "NEW 시즌",
    tags: ["노르딕 체크", "캠핑&차박 겸용", "도톰한 보온감"],
    description: "빈티지하고 따뜻한 색감의 체크 패턴으로 감성 캠핑과 겨울철 홈스타일링 모두에 최적화된 담요입니다. 도톰한 두께감으로 야외 바람을 든든하게 막아주며 피부에 자극 없는 부드러운 감촉을 제공합니다.",
    colors: [
      { name: "코코아 체크", hex: "#7E6351", extraPrice: 0 },
      { name: "포레스트 그린 체크", hex: "#3B4A3F", extraPrice: 0 }
    ],
    sizes: [
      { name: "미디엄 (120 x 160cm)", extraPrice: 0 },
      { name: "라지 (150 x 200cm)", extraPrice: 12000 }
    ],
    details: [
      { label: "소재", value: "울 블렌드 아크릴 웜 패브릭 100%" },
      { label: "용도", value: "거실 소파, 침실, 캠핑/차박, 사무실 무릎담요" },
      { label: "세탁방법", value: "세탁기 울코스 또는 손세탁 권장" }
    ]
  },
  {
    id: "ns-summer-parasol",
    name: "NS 올데이 암막 초경량 린넨 양우산",
    subtitle: "지난 여름 완판 신화 • 자외선 차단율 99.9% 초경량 카본",
    season: "summer",
    isBest: true,
    isNew: false,
    price: 32000,
    originalPrice: 48000,
    discountRate: 33,
    rating: 4.92,
    reviewCount: 2150,
    images: [
      "images/parasol.jpg"
    ],
    badge: "여름 베스트 1위",
    tags: ["UPF 50+ 암막", "180g 초경량", "우천 겸용 방수", "천연 우드 핸들"],
    description: "뜨거운 여름 태양빛과 자외선을 99.9% 차단하는 고성능 4중 암막 코팅 양우산입니다. 우아한 린넨 텍스처와 천연 원목 손잡이로 어떤 스타일링에도 어울리며, 단 180g의 가벼운 무게로 핸드백에 매일 휴대할 수 있습니다.",
    colors: [
      { name: "오트밀 베이지", hex: "#D6C7B2", extraPrice: 0 },
      { name: "매트 블랙", hex: "#222222", extraPrice: 0 },
      { name: "세이지 그린", hex: "#8FA38B", extraPrice: 0 }
    ],
    sizes: [
      { name: "3단 컴팩트 폴딩 (접었을 때 24cm)", extraPrice: 0 }
    ],
    details: [
      { label: "차단율", value: "자외선 차단 UPF 50+ (UV-A / UV-B 99.9% 차단)" },
      { label: "살대", value: "내풍성 항공 알루미늄 & 카본 파이버" },
      { label: "무게", value: "약 185g (초경량 설계)" },
      { label: "핸들", value: "천연 너도밤나무 원목 U자 핸들" }
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
    originalPrice: 79000,
    discountRate: 38,
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
      { label: "소음", value: "28dB 도서관 수준 저소음 BLDC 모터" },
      { label: "안전", value: "스마트 과열 방지 보호 회로 센서 내장" }
    ]
  }
];

// 고객 실제 리뷰 데이터
const REVIEWS = [
  {
    author: "김*진 님 (공식몰 실구매자)",
    product: "NS 프리미엄 웜 플리스 극세사 담요",
    rating: 5,
    date: "2024.11.02",
    title: "보들보들함이 차원이 달라요! 털 빠짐 전혀 없음",
    content: "추위를 많이 타서 추천 후기 보고 샀는데 진짜 살결 닿는 순간 온기가 확 올라와요. 세탁기 돌려도 털 뭉침이나 빠짐 1도 없고 테라코타 색감 너무 감성적입니다. 거실 소파에 두니 카페 같아요.",
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
    content: "한여름 땡볕에 이거 쓰고 안 쓰고 체감 온도 차이가 어마어마해요. 린넨 소재라 양산 특유의 촌스러움이 전혀 없고 진짜 가볍습니다. 겨울 담요도 믿고 바로 주문했어요!",
    verified: true
  },
  {
    author: "최*서 님 (자사몰 구매자)",
    product: "NS 하이브리드 에어로 아이스 넥쿨러",
    rating: 5,
    date: "2024.07.24",
    title: "출퇴근길 살려준 인생템",
    content: "목 뒤 닿는 쿨링 플레이트가 에어컨 뺨치게 시원합니다. 디자인도 로즈골드 포인트 들어가서 헤드폰처럼 예뻐요.",
    verified: true
  }
];
