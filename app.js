// NS HOME 자사몰 - 핵심 애플리케이션 및 관리자 시스템 스크립트

// 상태 관리
let currentFilter = 'all';
let searchKeyword = '';
let cart = JSON.parse(localStorage.getItem('ns_cart') || '[]');
let customProducts = JSON.parse(localStorage.getItem('ns_custom_products') || '[]');
let orders = JSON.parse(localStorage.getItem('ns_orders') || '[]');
let recentViews = JSON.parse(localStorage.getItem('ns_recent_views') || '[]');
let welcomeCouponApplied = false;
let selectedProduct = null;
let currentOption = {
  color: null,
  size: null
};

// 수정된 상품 정보 저장소 (localStorage)
let editedProductsMap = JSON.parse(localStorage.getItem('ns_edited_products') || '{}');

// 모든 상품 데이터 조회 (공식 기본 상품 + 수정사항 병합 + 커스텀 등록 상품)
function getAllProducts() {
  const base = PRODUCTS.map(p => {
    if (editedProductsMap[p.id]) {
      return { ...p, ...editedProductsMap[p.id] };
    }
    return p;
  });

  const customList = customProducts.map(cp => {
    if (editedProductsMap[cp.id]) {
      return { ...cp, ...editedProductsMap[cp.id] };
    }
    return cp;
  });

  const customFiltered = customList.filter(cp => !base.some(p => p.id === cp.id));
  return [...base, ...customFiltered];
}

// DOM Elements 캐시
const productGrid = document.getElementById('productGrid');
const cartDrawer = document.getElementById('cartDrawer');
const modalBackdrop = document.getElementById('modalBackdrop');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountBadges = document.querySelectorAll('.cart-badge');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartDiscountRow = document.getElementById('cartDiscountRow');
const cartDiscountEl = document.getElementById('cartDiscount');
const cartShippingEl = document.getElementById('cartShipping');
const cartTotalEl = document.getElementById('cartTotal');
const shippingProgressText = document.getElementById('shippingProgressText');
const shippingProgressFill = document.getElementById('shippingProgressFill');
const toastEl = document.getElementById('toast');

// 검색 엘리먼트
const headerSearchInput = document.getElementById('headerSearchInput');
const headerSearchClear = document.getElementById('headerSearchClear');
const searchResultNotice = document.getElementById('searchResultNotice');

// 비회원 주문조회 모달
const orderLookupModal = document.getElementById('orderLookupModal');
const openOrderLookupBtn = document.getElementById('openOrderLookupBtn');
const closeOrderLookupBtn = document.getElementById('closeOrderLookupBtn');
const orderLookupForm = document.getElementById('orderLookupForm');
const lookupSearchInput = document.getElementById('lookupSearchInput');
const lookupResultContainer = document.getElementById('lookupResultContainer');

// 플로팅 위젯 엘리먼트
const btnToggleRecentView = document.getElementById('btnToggleRecentView');
const recentViewDropdown = document.getElementById('recentViewDropdown');
const recentItemsList = document.getElementById('recentItemsList');
const recentCountBadge = document.getElementById('recentCountBadge');
const btnClearRecent = document.getElementById('btnClearRecent');
const btnQuickConsult = document.getElementById('btnQuickConsult');
const btnScrollTop = document.getElementById('btnScrollTop');

// 카카오톡 채널 모달 엘리먼트
const kakaoConsultModal = document.getElementById('kakaoConsultModal');
const closeKakaoModalBtn = document.getElementById('closeKakaoModalBtn');
const btnCopyOrderTemplate = document.getElementById('btnCopyOrderTemplate');
const orderTemplateText = document.getElementById('orderTemplateText');

// 상품 상세 모달 엘리먼트
const detailModal = document.getElementById('detailModal');
const modalImg = document.getElementById('modalImg');
const modalBadge = document.getElementById('modalBadge');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalRating = document.getElementById('modalRating');
const modalPrice = document.getElementById('modalPrice');
const modalOriginalPrice = document.getElementById('modalOriginalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalSwatches = document.getElementById('modalSwatches');
const modalColorName = document.getElementById('modalColorName');
const modalSizeSelect = document.getElementById('modalSizeSelect');
const modalSpecList = document.getElementById('modalSpecList');
const modalQtyInput = document.getElementById('modalQty');
const btnShareProduct = document.getElementById('btnShareProduct');
const modalGalleryThumbs = document.getElementById('modalGalleryThumbs');

// 결제 모달 엘리먼트
const checkoutModal = document.getElementById('checkoutModal');
const checkoutItemsList = document.getElementById('checkoutItemsList');
const checkoutTotalEl = document.getElementById('checkoutTotal');
const checkoutForm = document.getElementById('checkoutForm');
const successModal = document.getElementById('successModal');
const receiptDetailsEl = document.getElementById('receiptDetails');

// 관리자 모달 엘리먼트
const adminLoginModal = document.getElementById('adminLoginModal');
const adminDashboardModal = document.getElementById('adminDashboardModal');
const openAdminLoginBtn = document.getElementById('openAdminLoginBtn');
const closeAdminLoginBtn = document.getElementById('closeAdminLoginBtn');
const closeAdminDashboardBtn = document.getElementById('closeAdminDashboardBtn');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');

// 관리자 탭 & 패널
const tabAddProduct = document.getElementById('tabAddProduct');
const tabManageProducts = document.getElementById('tabManageProducts');
const tabAiSync = document.getElementById('tabAiSync');
const adminPanelAdd = document.getElementById('adminPanelAdd');
const adminPanelList = document.getElementById('adminPanelList');
const adminPanelAi = document.getElementById('adminPanelAi');
const adminProductCount = document.getElementById('adminProductCount');
const adminAddProductForm = document.getElementById('adminAddProductForm');
const adminProductTable = document.getElementById('adminProductTable');
const btnCopyDataForAi = document.getElementById('btnCopyDataForAi');

// 관리자 이미지 업로드 프리뷰
const newProdFile = document.getElementById('newProdFile');
const newProdDetailFiles = document.getElementById('newProdDetailFiles');
const newProdPresetImage = document.getElementById('newProdPresetImage');
const newProdImagePreview = document.getElementById('newProdImagePreview');
const newProdDetailImagesPreview = document.getElementById('newProdDetailImagesPreview');
const previewImg = document.getElementById('previewImg');
let uploadedImageBase64 = '';
let uploadedDetailImagesBase64 = [];

// 1. 초기화
document.addEventListener('DOMContentLoaded', () => {
  initMockOrdersIfNeeded();
  renderProducts();
  renderReviews();
  updateCartUI();
  setupEventListeners();
  setupSearch();
  setupModalTabs();
  startDispatchCountdown();
  setupOrderLookup();
  setupFloatingWidgets();
  renderRecentViews();
  setupAdminSystem();
});

// 테스트용 모의 주문 내역 초기화 (최초 1회)
function initMockOrdersIfNeeded() {
  if (orders.length === 0) {
    orders = [
      {
        orderId: 'NS-20241005-01',
        name: '홍길동',
        phone: '010-1234-5678',
        address: '서울특별시 강남구 테헤란로 152 101동 1204호',
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        productSummary: 'NS 프리미엄 웜 플리스 극세사 담요 (테라코타 카멜, 싱글)',
        totalPrice: 38900,
        status: '배송준비중',
        trackingNumber: '우체국택배 6892-4112-9901'
      }
    ];
    localStorage.setItem('ns_orders', JSON.stringify(orders));
  }
}

// 2. 이벤트 리스너 등록
function setupEventListeners() {
  // 필터 탭
  const tabs = document.querySelectorAll('.season-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderProducts();
    });
  });

  // 장바구니 열기 / 닫기
  const openCartBtn = document.getElementById('openCartBtn');
  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  
  const closeCartBtn = document.getElementById('closeCartBtn');
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeModals);
  
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModals);

  // 모달 닫기
  const closeDetailBtn = document.getElementById('closeDetailBtn');
  if (closeDetailBtn) closeDetailBtn.addEventListener('click', closeModals);
  
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeModals);
  
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModals);

  // 수량 조절 버튼 in Modal
  const modalQtyMinus = document.getElementById('modalQtyMinus');
  if (modalQtyMinus) {
    modalQtyMinus.addEventListener('click', () => {
      let q = parseInt(modalQtyInput.value, 10);
      if (q > 1) {
        modalQtyInput.value = q - 1;
        updateModalPrice();
      }
    });
  }
  const modalQtyPlus = document.getElementById('modalQtyPlus');
  if (modalQtyPlus) {
    modalQtyPlus.addEventListener('click', () => {
      let q = parseInt(modalQtyInput.value, 10);
      modalQtyInput.value = q + 1;
      updateModalPrice();
    });
  }

  // 사이즈 선택 변경
  if (modalSizeSelect) modalSizeSelect.addEventListener('change', updateModalPrice);

  // 모달 내 장바구니 / 바로구매
  const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', () => {
      if (!selectedProduct) return;
      const qty = parseInt(modalQtyInput.value, 10) || 1;
      const sizeObj = (selectedProduct.sizes && selectedProduct.sizes[modalSizeSelect.selectedIndex]) || { name: '기본', extraPrice: 0 };
      addToCart(selectedProduct, currentOption.color, sizeObj, qty);
      closeModals();
      openCart();
      showToast(`"${selectedProduct.name}" 이(가) 장바구니에 담겼습니다.`);
    });
  }

  const modalBuyNowBtn = document.getElementById('modalBuyNowBtn');
  if (modalBuyNowBtn) {
    modalBuyNowBtn.addEventListener('click', () => {
      if (!selectedProduct) return;
      const qty = parseInt(modalQtyInput.value, 10) || 1;
      const sizeObj = (selectedProduct.sizes && selectedProduct.sizes[modalSizeSelect.selectedIndex]) || { name: '기본', extraPrice: 0 };
      addToCart(selectedProduct, currentOption.color, sizeObj, qty);
      closeModals();
      openCheckout();
    });
  }

  // 상품 링크 복사 (공유하기)
  if (btnShareProduct) {
    btnShareProduct.addEventListener('click', () => {
      if (!selectedProduct) return;
      const url = `${window.location.origin}${window.location.pathname}?product=${encodeURIComponent(selectedProduct.id)}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('🔗 상품 공유 링크가 클립보드에 복사되었습니다.');
        }).catch(() => {
          showToast('🔗 링크가 생성되었습니다: ' + url);
        });
      } else {
        showToast('🔗 링크가 생성되었습니다: ' + url);
      }
    });
  }

  // 쿠폰 적용 토글
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      welcomeCouponApplied = !welcomeCouponApplied;
      if (welcomeCouponApplied) {
        applyCouponBtn.textContent = '적용 해제';
        applyCouponBtn.style.background = '#F0D4C5';
        showToast('3,000원 웰컴 할인 쿠폰이 적용되었습니다!');
      } else {
        applyCouponBtn.textContent = '쿠폰 적용';
        applyCouponBtn.style.background = 'var(--warm-terracotta-light)';
        showToast('쿠폰 적용이 해제되었습니다.');
      }
      updateCartUI();
    });
  }

  // 체크아웃 진행 버튼
  const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
  if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('장바구니가 비어 있습니다.');
        return;
      }
      closeModals();
      openCheckout();
    });
  }

  // 결제 수단 탭 선택
  const payCards = document.querySelectorAll('.pay-method-card');
  payCards.forEach(card => {
    card.addEventListener('click', () => {
      payCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // 결제 폼 제출
  if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutSubmit);

  // 단축키 (Cmd/Ctrl + Shift + A 또는 Alt + A)로 관리자 로그인 열기
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      openAdminLogin();
    }
  });
}

// 2-1. 검색 시스템 설정
function setupSearch() {
  if (!headerSearchInput) return;

  headerSearchInput.addEventListener('input', (e) => {
    searchKeyword = e.target.value.trim().toLowerCase();
    if (headerSearchClear) {
      headerSearchClear.style.display = searchKeyword ? 'block' : 'none';
    }
    renderProducts();
  });

  if (headerSearchClear) {
    headerSearchClear.addEventListener('click', () => {
      headerSearchInput.value = '';
      searchKeyword = '';
      headerSearchClear.style.display = 'none';
      renderProducts();
      headerSearchInput.focus();
    });
  }
}

// 키워드로 상품 필터링 (인기 검색어 태그 클릭)
window.filterByKeyword = function(keyword) {
  if (headerSearchInput) {
    headerSearchInput.value = keyword;
    if (headerSearchClear) headerSearchClear.style.display = 'block';
  }
  searchKeyword = keyword.toLowerCase();
  
  // 전체 탭으로 변경
  const tabs = document.querySelectorAll('.season-tab');
  tabs.forEach(t => t.classList.remove('active'));
  const allTab = document.querySelector('.season-tab[data-filter="all"]');
  if (allTab) allTab.classList.add('active');
  currentFilter = 'all';

  renderProducts();

  // 상품 섹션으로 스크롤 이동
  const prodSec = document.getElementById('products');
  if (prodSec) {
    prodSec.scrollIntoView({ behavior: 'smooth' });
  }
};

// 2-2. 상세 모달 탭 설정
function setupModalTabs() {
  const tabBtns = document.querySelectorAll('.modal-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.tab;
      document.querySelectorAll('.modal-tab-panel').forEach(panel => {
        panel.style.display = panel.id === targetTab ? 'block' : 'none';
      });
    });
  });
}

// 2-3. 당일 발송 카운트다운 타이머
function startDispatchCountdown() {
  const countdownEl = document.getElementById('topDispatchCountdown');
  if (!countdownEl) return;

  function updateTimer() {
    const now = new Date();
    // 매일 낮 12:00:00 기준 당일 발송 마감
    const target = new Date();
    target.setHours(12, 0, 0, 0);

    if (now > target) {
      // 12시가 지났으면 다음 날 12시로 설정
      target.setDate(target.getDate() + 1);
    }

    const diff = target - now;
    const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

    countdownEl.innerHTML = `⚡ 오늘 출발 마감까지 <strong>${hours}:${minutes}:${seconds}</strong>`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// 2-4. 비회원 주문조회 모달 설정
function setupOrderLookup() {
  if (openOrderLookupBtn) {
    openOrderLookupBtn.addEventListener('click', () => {
      closeModals();
      modalBackdrop.classList.add('active');
      orderLookupModal.style.display = 'block';
      orderLookupModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (lookupSearchInput) lookupSearchInput.focus();
    });
  }

  if (closeOrderLookupBtn) {
    closeOrderLookupBtn.addEventListener('click', closeModals);
  }

  if (orderLookupForm) {
    orderLookupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = lookupSearchInput.value.trim().replace(/[-\s]/g, '');
      if (!query) return;

      const matched = orders.filter(o => {
        const cleanPhone = (o.phone || '').replace(/[-\s]/g, '');
        const cleanName = (o.name || '').trim();
        const cleanOrderId = (o.orderId || '').replace(/[-\s]/g, '');
        return cleanPhone.includes(query) || cleanName.includes(query) || cleanOrderId.includes(query);
      });

      if (!lookupResultContainer) return;

      if (matched.length === 0) {
        lookupResultContainer.innerHTML = `
          <div style="text-align:center; padding:24px 12px; background:#FAF7F2; border-radius:8px;">
            <p style="color:var(--color-muted); font-size:0.9rem; margin-bottom:8px;">입력하신 정보로 조회된 주문 내역이 없습니다.</p>
            <p style="font-size:0.8rem; color:#8C8077;">* 주문 시 작성하신 성함 또는 연락처를 다시 확인해 주세요.<br>(예시 테스트: 홍길동 또는 01012345678)</p>
          </div>
        `;
      } else {
        lookupResultContainer.innerHTML = `
          <div style="font-size:0.88rem; font-weight:700; color:var(--color-espresso); margin-bottom:12px;">
            조회된 주문 내역 총 ${matched.length}건
          </div>
          ${matched.map(item => `
            <div class="order-lookup-card">
              <div class="order-lookup-head">
                <div>
                  <strong style="color:var(--color-espresso); font-size:0.92rem;">주문번호: ${item.orderId}</strong>
                  <div style="font-size:0.78rem; color:var(--color-muted); margin-top:2px;">주문일자: ${item.date || '최근'}</div>
                </div>
                <span class="order-status-badge">🚚 ${item.status || '배송준비중'}</span>
              </div>
              <div style="font-size:0.86rem; line-height:1.6; color:var(--color-mocha);">
                <div><strong>주문상품:</strong> ${item.productSummary || item.name}</div>
                <div><strong>받는분:</strong> ${item.name} (${item.phone})</div>
                <div><strong>배송지:</strong> ${item.address}</div>
                <div><strong>결제금액:</strong> <strong style="color:var(--warm-terracotta);">${(item.totalPrice || 0).toLocaleString()}원</strong></div>
                ${item.trackingNumber ? `<div style="margin-top:6px; font-size:0.8rem; color:#2F7A4D;">운송장: ${item.trackingNumber}</div>` : ''}
              </div>
            </div>
          `).join('')}
        `;
      }
    });
  }
}

// 2-5. 플로팅 퀵 액션 위젯 (최근본상품, TOP스크롤, 1:1문의)
function setupFloatingWidgets() {
  // 맨 위로 스크롤
  window.addEventListener('scroll', () => {
    if (btnScrollTop) {
      if (window.scrollY > 300) {
        btnScrollTop.style.display = 'flex';
      } else {
        btnScrollTop.style.display = 'none';
      }
    }
  });

  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 최근 본 상품 토글
  if (btnToggleRecentView && recentViewDropdown) {
    btnToggleRecentView.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = recentViewDropdown.style.display === 'block';
      recentViewDropdown.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
      if (!recentViewDropdown.contains(e.target) && e.target !== btnToggleRecentView) {
        recentViewDropdown.style.display = 'none';
      }
    });
  }

  // 최근 본 상품 전체 삭제
  if (btnClearRecent) {
    btnClearRecent.addEventListener('click', () => {
      recentViews = [];
      localStorage.setItem('ns_recent_views', JSON.stringify(recentViews));
      renderRecentViews();
      showToast('최근 본 상품 목록이 비워졌습니다.');
    });
  }

  // 1:1 카톡 상담 및 간편 주문 모달 오픈
  if (btnQuickConsult) {
    btnQuickConsult.addEventListener('click', openKakaoModal);
  }

  // 카카오 모달 닫기
  if (closeKakaoModalBtn) {
    closeKakaoModalBtn.addEventListener('click', closeModals);
  }

  // 카톡 간편 주문 양식 원클릭 복사
  if (btnCopyOrderTemplate && orderTemplateText) {
    btnCopyOrderTemplate.addEventListener('click', () => {
      const template = orderTemplateText.textContent.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(template).then(() => {
          showToast('📋 주문 양식이 복사되었습니다! 카카오톡 채팅방에 붙여넣어 주세요.');
        }).catch(() => {
          showToast('📋 주문 양식이 복사되었습니다.');
        });
      } else {
        showToast('📋 주문 양식이 복사되었습니다.');
      }
    });
  }
}

// 카카오톡 채널 모달 오픈
window.openKakaoModal = function() {
  closeModals();
  if (modalBackdrop) modalBackdrop.classList.add('active');
  if (kakaoConsultModal) {
    kakaoConsultModal.style.display = 'block';
    kakaoConsultModal.classList.add('active');
  }
  document.body.style.overflow = 'hidden';
};

// 최근 본 상품 목록 추가 및 렌더링
function addRecentView(product) {
  if (!product) return;
  // 중복 제거 후 최상단 추가
  recentViews = recentViews.filter(p => p.id !== product.id);
  recentViews.unshift({
    id: product.id,
    name: product.name,
    price: product.price,
    image: (product.images && product.images[0]) ? product.images[0] : 'images/blanket_fluffy.jpg'
  });
  // 최대 6개 유지
  if (recentViews.length > 6) recentViews.pop();
  localStorage.setItem('ns_recent_views', JSON.stringify(recentViews));
  renderRecentViews();
}

function renderRecentViews() {
  if (!recentItemsList) return;
  
  if (recentCountBadge) {
    recentCountBadge.textContent = recentViews.length;
    recentCountBadge.style.display = recentViews.length > 0 ? 'flex' : 'none';
  }

  if (recentViews.length === 0) {
    recentItemsList.innerHTML = `<div class="recent-empty">최근 본 상품이 없습니다.</div>`;
    return;
  }

  recentItemsList.innerHTML = recentViews.map(item => `
    <div class="recent-item" onclick="openProductDetail('${item.id}')">
      <img src="${item.image}" alt="${item.name}" class="recent-thumb">
      <div style="flex:1; overflow:hidden;">
        <div class="recent-title">${item.name}</div>
        <div class="recent-price">${(item.price || 0).toLocaleString()}원</div>
      </div>
    </div>
  `).join('');
}

// 3. 상품 렌더링
function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  const all = getAllProducts();
  const filtered = all.filter(p => {
    // 1) 계절/베스트 필터
    if (currentFilter === 'winter' && p.season !== 'winter') return false;
    if (currentFilter === 'summer' && p.season !== 'summer') return false;
    if (currentFilter === 'best' && !p.isBest) return false;

    // 2) 검색어 필터
    if (searchKeyword) {
      const matchName = (p.name || '').toLowerCase().includes(searchKeyword);
      const matchSub = (p.subtitle || '').toLowerCase().includes(searchKeyword);
      const matchDesc = (p.description || '').toLowerCase().includes(searchKeyword);
      const matchTags = (p.tags || []).some(t => t.toLowerCase().includes(searchKeyword));
      if (!matchName && !matchSub && !matchDesc && !matchTags) return false;
    }

    return true;
  });

  // 검색 결과 알림 바 표시
  if (searchResultNotice) {
    if (searchKeyword) {
      searchResultNotice.style.display = 'flex';
      searchResultNotice.innerHTML = `
        <span>검색어 <strong>"${searchKeyword}"</strong> 검색 결과 (${filtered.length}건)</span>
        <button type="button" onclick="filterByKeyword('')">검색 초기화</button>
      `;
    } else {
      searchResultNotice.style.display = 'none';
    }
  }

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-muted);">
        <p style="font-size:1.05rem; margin-bottom:12px;">선택하신 조건에 맞는 상품이 없습니다.</p>
        <button type="button" class="btn-primary" onclick="filterByKeyword('')" style="display:inline-block; padding:8px 20px;">
          전체 상품 보기
        </button>
      </div>
    `;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    
    // 배지 스타일
    let badgeClass = 'badge-float';
    if (product.season === 'summer') badgeClass += ' badge-summer';

    const firstImg = (product.images && product.images.length > 0) ? product.images[0] : 'images/blanket_fluffy.jpg';

    card.innerHTML = `
      <div class="product-thumb-wrap" onclick="openProductDetail('${product.id}')">
        <span class="${badgeClass}">${product.badge || 'HIT'}</span>
        <img src="${firstImg}" alt="${product.name}" class="product-thumb" loading="lazy">
        <button class="btn-quick-view" type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          상세 옵션 보기
        </button>
      </div>

      <div class="product-info">
        <div class="product-tags">
          ${(product.tags || []).slice(0, 3).map(t => `<span class="tag-chip">#${t}</span>`).join('')}
        </div>

        <h3 class="product-name" onclick="openProductDetail('${product.id}')">${product.name}</h3>
        <p class="product-sub">${product.subtitle || ''}</p>

        <div class="product-price-row">
          <div class="price-block">
            <div class="final-price">${(product.price || 0).toLocaleString()}<span>원</span></div>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn-card-add" onclick="quickAddToCart('${product.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            장바구니 담기
          </button>
          <button class="btn-card-detail" onclick="openProductDetail('${product.id}')">
            상세보기
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// 4. 상품 상세 모달 오픈
function openProductDetail(productId) {
  const all = getAllProducts();
  selectedProduct = all.find(p => p.id === productId);
  if (!selectedProduct) return;

  // 최근 본 상품에 기록
  addRecentView(selectedProduct);

  const colors = selectedProduct.colors && selectedProduct.colors.length > 0 
    ? selectedProduct.colors 
    : [{ name: "단일 색상", hex: "#C5A059", extraPrice: 0 }];

  const sizes = selectedProduct.sizes && selectedProduct.sizes.length > 0
    ? selectedProduct.sizes
    : [{ name: "기본 사이즈", extraPrice: 0 }];

  currentOption.color = colors[0];
  currentOption.size = sizes[0];

  const mainImgUrl = selectedProduct.images && selectedProduct.images[0] ? selectedProduct.images[0] : 'images/blanket_fluffy.jpg';
  if (modalImg) {
    modalImg.src = mainImgUrl;
    modalImg.alt = selectedProduct.name;
  }

  // 갤러리 서브 썸네일 렌더링 (필요 시)
  if (modalGalleryThumbs) {
    const allImages = [...(selectedProduct.images || [])];
    if (allImages.length > 1) {
      modalGalleryThumbs.innerHTML = allImages.map((imgSrc, idx) => `
        <img src="${imgSrc}" alt="썸네일 ${idx + 1}" class="modal-thumb-mini ${idx === 0 ? 'active' : ''}" onclick="changeModalImage(this, '${imgSrc}')">
      `).join('');
      modalGalleryThumbs.style.display = 'flex';
    } else {
      modalGalleryThumbs.innerHTML = '';
      modalGalleryThumbs.style.display = 'none';
    }
  }

  if (modalBadge) modalBadge.textContent = selectedProduct.badge || 'BEST';
  if (modalTitle) modalTitle.textContent = selectedProduct.name;
  if (modalSubtitle) modalSubtitle.textContent = selectedProduct.subtitle || '';
  if (modalRating) modalRating.textContent = '';
  if (modalDesc) modalDesc.textContent = selectedProduct.description || '편안하고 포근한 NS HOME의 엄선 계절 아이템입니다.';
  if (modalQtyInput) modalQtyInput.value = 1;

  // 탭을 기본 '상품소개'로 리셋
  const tabBtns = document.querySelectorAll('.modal-tab-btn');
  tabBtns.forEach(b => b.classList.remove('active'));
  const firstTabBtn = document.querySelector('.modal-tab-btn[data-tab="tabDesc"]');
  if (firstTabBtn) firstTabBtn.classList.add('active');
  document.querySelectorAll('.modal-tab-panel').forEach(p => {
    p.style.display = p.id === 'tabDesc' ? 'block' : 'none';
  });

  // 860px 상세페이지 이미지 무왜곡 순차 세로 배치
  const modalDetailImages = document.getElementById('modalDetailImages');
  if (modalDetailImages) {
    if (selectedProduct.detailImages && selectedProduct.detailImages.length > 0) {
      modalDetailImages.innerHTML = selectedProduct.detailImages.map((img, idx) => `
        <img src="${img}" alt="${selectedProduct.name} 상세페이지 ${idx + 1}" loading="lazy" style="width:100%; max-width:860px; height:auto; display:block; margin:0 auto;">
      `).join('');
      modalDetailImages.style.display = 'flex';
    } else {
      modalDetailImages.innerHTML = '';
      modalDetailImages.style.display = 'none';
    }
  }

  // 컬러 스와치 생성
  modalSwatches.innerHTML = '';
  colors.forEach((col, idx) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = `swatch-btn ${idx === 0 ? 'selected' : ''}`;
    swatch.style.backgroundColor = col.hex || '#E8DFD5';
    swatch.title = col.name;
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('selected'));
      swatch.classList.add('selected');
      currentOption.color = col;
      modalColorName.textContent = col.name;
    });
    modalSwatches.appendChild(swatch);
  });
  modalColorName.textContent = colors[0].name;

  // 사이즈 셀렉트 박스 생성
  modalSizeSelect.innerHTML = '';
  sizes.forEach(size => {
    const opt = document.createElement('option');
    opt.value = size.name;
    opt.textContent = size.extraPrice > 0 
      ? `${size.name} (+${size.extraPrice.toLocaleString()}원)`
      : size.name;
    modalSizeSelect.appendChild(opt);
  });

  // 상세 스펙 테이블
  const details = selectedProduct.details || [
    { label: "소재", value: "프리미엄 원단" },
    { label: "원산지", value: "대한민국 디자인 / 엄선 제조" },
    { label: "품질", value: "정밀 검수 및 안심 가공 완료" }
  ];
  modalSpecList.innerHTML = details.map(d => `
    <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #F0ECE4; font-size:0.83rem;">
      <span style="color:var(--color-muted);">${d.label}</span>
      <span style="color:var(--color-charcoal); font-weight:500;">${d.value}</span>
    </div>
  `).join('');

  updateModalPrice();

  modalBackdrop.classList.add('active');
  detailModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateModalPrice() {
  if (!selectedProduct) return;
  const qty = parseInt(modalQtyInput.value, 10) || 1;
  const sizes = selectedProduct.sizes && selectedProduct.sizes.length > 0 ? selectedProduct.sizes : [{ name: "기본", extraPrice: 0 }];
  const sizeObj = sizes[modalSizeSelect.selectedIndex] || sizes[0];
  const unitPrice = selectedProduct.price + (sizeObj.extraPrice || 0);
  const totalPrice = unitPrice * qty;

  modalPrice.textContent = `${totalPrice.toLocaleString()}원`;
  if (modalOriginalPrice) modalOriginalPrice.style.display = 'none';
}

// 5. 장바구니 로직
function quickAddToCart(productId) {
  const all = getAllProducts();
  const p = all.find(x => x.id === productId);
  if (!p) return;
  const col = (p.colors && p.colors[0]) ? p.colors[0] : { name: "기본", extraPrice: 0 };
  const sz = (p.sizes && p.sizes[0]) ? p.sizes[0] : { name: "기본", extraPrice: 0 };
  addToCart(p, col, sz, 1);
  showToast(`"${p.name}" 이(가) 장바구니에 담겼습니다.`);
  openCart();
}

function addToCart(product, color, size, qty = 1) {
  const cartKey = `${product.id}_${color.name}_${size.name}`;
  const existing = cart.find(item => item.key === cartKey);
  const unitPrice = product.price + (size.extraPrice || 0);
  const img = product.images && product.images[0] ? product.images[0] : 'images/blanket_fluffy.jpg';

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key: cartKey,
      id: product.id,
      name: product.name,
      image: img,
      color: color.name,
      size: size.name,
      unitPrice: unitPrice,
      qty: qty
    });
  }

  saveCart();
  updateCartUI();
}

function updateCartItemQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.key !== key);
  }
  saveCart();
  updateCartUI();
}

function removeCartItem(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  updateCartUI();
  showToast('상품이 장바구니에서 삭제되었습니다.');
}

function saveCart() {
  localStorage.setItem('ns_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  cartCountBadges.forEach(b => {
    b.textContent = totalItems;
    b.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  });

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>장바구니가 비어 있습니다.<br>올겨울을 따뜻하게 녹여줄 담요를 담아보세요.</p>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = '0원';
    if (cartShippingEl) cartShippingEl.textContent = '0원';
    if (cartTotalEl) cartTotalEl.textContent = '0원';
    if (shippingProgressText) shippingProgressText.innerHTML = '<strong>30,000원</strong> 이상 구매 시 무료배송!';
    if (shippingProgressFill) shippingProgressFill.style.width = '0%';
    return;
  }

  // 장바구니 아이템 리스트
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-option">${item.color} / ${item.size}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartItemQty('${item.key}', -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartItemQty('${item.key}', 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">
        <div class="price">${(item.unitPrice * item.qty).toLocaleString()}원</div>
        <button class="btn-remove-item" onclick="removeCartItem('${item.key}')">삭제</button>
      </div>
    </div>
  `).join('');

  // 금액 계산
  const subtotal = cart.reduce((acc, i) => acc + (i.unitPrice * i.qty), 0);
  const FREE_SHIPPING_THRESHOLD = 30000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : 3000;

  const discount = welcomeCouponApplied ? 3000 : 0;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  // 무료배송 게이지
  if (shippingProgressText && shippingProgressFill) {
    if (isFreeShipping) {
      shippingProgressText.innerHTML = '🎉 <strong>무료배송 혜택</strong>이 적용되었습니다!';
      shippingProgressFill.style.width = '100%';
    } else {
      const remain = FREE_SHIPPING_THRESHOLD - subtotal;
      const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      shippingProgressText.innerHTML = `<strong>${remain.toLocaleString()}원</strong> 더 담으면 무료배송!`;
      shippingProgressFill.style.width = `${pct}%`;
    }
  }

  if (cartSubtotalEl) cartSubtotalEl.textContent = `${subtotal.toLocaleString()}원`;
  
  if (cartDiscountRow && cartDiscountEl) {
    if (welcomeCouponApplied) {
      cartDiscountRow.style.display = 'flex';
      cartDiscountEl.textContent = `-3,000원`;
    } else {
      cartDiscountRow.style.display = 'none';
    }
  }

  if (cartShippingEl) cartShippingEl.textContent = isFreeShipping ? '무료' : `${shippingFee.toLocaleString()}원`;
  if (cartTotalEl) cartTotalEl.textContent = `${finalTotal.toLocaleString()}원`;
}

// 6. 모달 제어
function openCart() {
  updateCartUI();
  modalBackdrop.classList.add('active');
  cartDrawer.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openCheckout() {
  if (cart.length === 0) return;

  const subtotal = cart.reduce((acc, i) => acc + (i.unitPrice * i.qty), 0);
  const shippingFee = subtotal >= 30000 ? 0 : 3000;
  const discount = welcomeCouponApplied ? 3000 : 0;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  checkoutItemsList.innerHTML = cart.map(i => `
    <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.86rem;">
      <span>${i.name} (${i.color}, ${i.size}) × ${i.qty}</span>
      <span style="font-weight:600;">${(i.unitPrice * i.qty).toLocaleString()}원</span>
    </div>
  `).join('');

  checkoutTotalEl.textContent = `${finalTotal.toLocaleString()}원`;

  modalBackdrop.classList.add('active');
  checkoutModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModals() {
  if (modalBackdrop) modalBackdrop.classList.remove('active');
  if (cartDrawer) cartDrawer.classList.remove('active');
  if (detailModal) detailModal.classList.remove('active');
  if (checkoutModal) checkoutModal.classList.remove('active');
  if (successModal) successModal.classList.remove('active');
  if (orderLookupModal) {
    orderLookupModal.classList.remove('active');
    orderLookupModal.style.display = 'none';
  }
  if (kakaoConsultModal) {
    kakaoConsultModal.classList.remove('active');
    kakaoConsultModal.style.display = 'none';
  }
  if (adminLoginModal) {
    adminLoginModal.classList.remove('active');
    adminLoginModal.style.display = 'none';
  }
  if (adminDashboardModal) {
    adminDashboardModal.classList.remove('active');
    adminDashboardModal.style.display = 'none';
  }
  const adminEditModal = document.getElementById('adminEditModal');
  if (adminEditModal) {
    adminEditModal.classList.remove('active');
    adminEditModal.style.display = 'none';
  }
  document.body.style.overflow = '';
}

// 갤러리 메인 사진 교체
window.changeModalImage = function(elem, newSrc) {
  if (modalImg) modalImg.src = newSrc;
  document.querySelectorAll('.modal-thumb-mini').forEach(el => el.classList.remove('active'));
  if (elem) elem.classList.add('active');
};

// 7. 결제 처리 핸들러 (실제 결제 시뮬레이션)
function handleCheckoutSubmit(e) {
  e.preventDefault();

  const buyerName = document.getElementById('buyerName').value.trim();
  const buyerPhone = document.getElementById('buyerPhone').value.trim();
  const buyerAddress = document.getElementById('buyerAddress').value.trim();
  const buyerAddressDetail = document.getElementById('buyerAddressDetail').value.trim();
  const buyerMemo = document.getElementById('buyerMemo').value;
  const selectedMethod = document.querySelector('.pay-method-card.selected span').textContent;

  if (!buyerName || !buyerPhone || !buyerAddress) {
    showToast('받는 분 이름, 연락처, 주소를 모두 입력해주세요.');
    return;
  }

  const subtotal = cart.reduce((acc, i) => acc + (i.unitPrice * i.qty), 0);
  const shippingFee = subtotal >= 30000 ? 0 : 3000;
  const discount = welcomeCouponApplied ? 3000 : 0;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const orderId = 'NS-' + Date.now().toString().slice(-8);

  const submitBtn = document.getElementById('btnDoPayment');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" style="animation:spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
    안전하게 결제 처리 중...
  `;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '결제하기';

    receiptDetailsEl.innerHTML = `
      <div class="receipt-line"><span>주문번호</span><strong>${orderId}</strong></div>
      <div class="receipt-line"><span>주문자</span><span>${buyerName} 님</span></div>
      <div class="receipt-line"><span>연락처</span><span>${buyerPhone}</span></div>
      <div class="receipt-line"><span>배송지</span><span>${buyerAddress} ${buyerAddressDetail}</span></div>
      <div class="receipt-line"><span>배송 메모</span><span>${buyerMemo}</span></div>
      <div class="receipt-line"><span>결제 수단</span><span>${selectedMethod}</span></div>
      <div class="receipt-line"><span>주문 상품</span><span>${cart[0].name} 외 ${cart.length - 1 > 0 ? (cart.length - 1) + '건' : '1개'}</span></div>
      <div class="receipt-line strong"><span>최종 결제 금액</span><span style="color:var(--warm-terracotta); font-size:1.15rem;">${finalTotal.toLocaleString()}원</span></div>
    `;

    // 주문 내역 영구 보관 (비회원 주문조회 연동)
    const newOrderRecord = {
      orderId: orderId,
      name: buyerName,
      phone: buyerPhone,
      address: `${buyerAddress} ${buyerAddressDetail}`,
      memo: buyerMemo,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      productSummary: `${cart[0].name} (${cart[0].color}, ${cart[0].size}) 외 ${cart.length - 1 > 0 ? (cart.length - 1) + '건' : '1개'}`,
      totalPrice: finalTotal,
      status: '배송준비중',
      trackingNumber: '우체국택배 배송 접수 준비중'
    };
    orders.unshift(newOrderRecord);
    localStorage.setItem('ns_orders', JSON.stringify(orders));

    cart = [];
    saveCart();
    updateCartUI();

    checkoutModal.classList.remove('active');
    successModal.classList.add('active');

    showToast('주문 및 결제가 성공적으로 완료되었습니다!');
  }, 1200);
}

// 8. 리뷰 렌더링
function renderReviews() {
  const reviewContainer = document.getElementById('reviewCards');
  if (!reviewContainer) return;

  reviewContainer.innerHTML = REVIEWS.map(r => `
    <article class="review-card">
      <div>
        <div class="review-header">
          <span class="stars">★★★★★</span>
          <span class="review-badge">${r.verified ? '✓ 실구매 인증' : ''}</span>
        </div>
        <h4 class="review-title">${r.title}</h4>
        <p class="review-body">"${r.content}"</p>
      </div>
      <div class="review-footer">
        <span>${r.author}</span>
        <span>${r.date}</span>
      </div>
    </article>
  `).join('');
}

// 9. 관리자 시스템 (Admin Dashboard)
function setupAdminSystem() {
  if (openAdminLoginBtn) openAdminLoginBtn.addEventListener('click', openAdminLogin);
  if (closeAdminLoginBtn) closeAdminLoginBtn.addEventListener('click', closeModals);
  if (closeAdminDashboardBtn) closeAdminDashboardBtn.addEventListener('click', closeModals);

  // 로그인 인증 (기본 비밀번호: 1234)
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pw = adminPasswordInput.value.trim();
      if (pw === '1234' || pw === 'admin') {
        adminPasswordInput.value = '';
        closeModals();
        openAdminDashboard();
        showToast('관리자 인증에 성공했습니다.');
      } else {
        alert('비밀번호가 올바르지 않습니다. (초기 비밀번호: 1234)');
      }
    });
  }

  // 로그아웃
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      closeModals();
      showToast('관리자 로그아웃 되었습니다.');
    });
  }

  // 탭 전환
  if (tabAddProduct && tabManageProducts && tabAiSync) {
    tabAddProduct.addEventListener('click', () => switchAdminTab('add'));
    tabManageProducts.addEventListener('click', () => switchAdminTab('manage'));
    tabAiSync.addEventListener('click', () => switchAdminTab('ai'));
  }

  // 이미지 파일 로컬 프리뷰
  if (newProdFile) {
    newProdFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedImageBase64 = event.target.result;
          previewImg.src = uploadedImageBase64;
          newProdImagePreview.style.display = 'block';
          if (newProdPresetImage) newProdPresetImage.value = '';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 프리셋 이미지 선택
  if (newProdPresetImage) {
    newProdPresetImage.addEventListener('change', (e) => {
      if (e.target.value) {
        uploadedImageBase64 = e.target.value;
        previewImg.src = uploadedImageBase64;
        newProdImagePreview.style.display = 'block';
        if (newProdFile) newProdFile.value = '';
      }
    });
  }

  // 상세페이지 다중 이미지 업로드 처리
  if (newProdDetailFiles) {
    newProdDetailFiles.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      uploadedDetailImagesBase64 = [];
      if (newProdDetailImagesPreview) newProdDetailImagesPreview.innerHTML = '';

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedDetailImagesBase64.push(event.target.result);
          if (newProdDetailImagesPreview) {
            const thumb = document.createElement('img');
            thumb.src = event.target.result;
            thumb.style.cssText = 'width:60px; height:60px; object-fit:cover; border-radius:4px; border:1px solid #D8CBB5;';
            newProdDetailImagesPreview.appendChild(thumb);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // 새 상품 등록 제출
  if (adminAddProductForm) {
    adminAddProductForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('newProdName').value.trim();
      const subtitle = document.getElementById('newProdSubtitle').value.trim();
      const season = document.getElementById('newProdSeason').value;
      const badge = document.getElementById('newProdBadge').value.trim() || 'NEW';
      const price = parseInt(document.getElementById('newProdPrice').value, 10);
      const originalPrice = parseInt(document.getElementById('newProdOriginalPrice').value, 10) || Math.round(price * 1.4);
      const discountRate = Math.round(((originalPrice - price) / originalPrice) * 100);

      const desc = document.getElementById('newProdDesc').value.trim() || 'NS HOME 프리미엄 감성 라이프스타일 상품입니다.';

      const colorsRaw = document.getElementById('newProdColors').value.split(',');
      const colors = colorsRaw.map(c => ({ name: c.trim(), hex: "#D4A373", extraPrice: 0 })).filter(c => c.name);

      const sizesRaw = document.getElementById('newProdSizes').value.split(',');
      const sizes = sizesRaw.map(s => ({ name: s.trim(), extraPrice: 0 })).filter(s => s.name);

      let finalImg = uploadedImageBase64 || 'images/blanket_fluffy.jpg';

      const newProd = {
        id: 'ns-custom-' + Date.now(),
        name: name,
        subtitle: subtitle,
        season: season,
        isBest: false,
        isNew: true,
        price: price,
        originalPrice: originalPrice,
        discountRate: discountRate,
        rating: 5.0,
        reviewCount: 1,
        images: [finalImg],
        detailImages: [...uploadedDetailImagesBase64],
        badge: badge,
        tags: ["신상품", season === 'winter' ? "겨울필수" : "여름추천", "포근함"],
        description: desc,
        colors: colors.length > 0 ? colors : [{ name: "기본", hex: "#D4A373", extraPrice: 0 }],
        sizes: sizes.length > 0 ? sizes : [{ name: "원사이즈", extraPrice: 0 }],
        details: [
          { label: "소재", value: "프리미엄 엄선 원단" },
          { label: "원산지", value: "대한민국 디자인 / 엄선 제조" },
          { label: "품질", value: "정밀 검수 및 안심 가공" }
        ],
        isCustom: true
      };

      customProducts.unshift(newProd);
      localStorage.setItem('ns_custom_products', JSON.stringify(customProducts));

      renderProducts();
      renderAdminProductTable();
      adminAddProductForm.reset();
      newProdImagePreview.style.display = 'none';
      if (newProdDetailImagesPreview) newProdDetailImagesPreview.innerHTML = '';
      uploadedImageBase64 = '';
      uploadedDetailImagesBase64 = [];

      showToast(`신규 상품 "${name}" 이(가) 사이트에 즉시 진열되었습니다!`);
      switchAdminTab('manage');
    });
  }

  // AI 복사 버튼
  if (btnCopyDataForAi) {
    btnCopyDataForAi.addEventListener('click', () => {
      const all = getAllProducts();
      const exportJson = JSON.stringify(all, null, 2);
      navigator.clipboard.writeText(exportJson).then(() => {
        alert("현재 등록된 모든 상품 데이터가 클립보드에 복사되었습니다!\n채팅창에 붙여넣기(Cmd+V)해 주시면 제가 GitHub에 영구 배포해 드립니다.");
      }).catch(() => {
        prompt("아래 코드를 복사해서 AI 채팅창에 보내주세요:", exportJson);
      });
    });
  }
}

function openAdminLogin() {
  closeModals();
  if (adminLoginModal) {
    adminLoginModal.style.display = 'block';
    adminLoginModal.classList.add('active');
  }
  if (modalBackdrop) modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (adminPasswordInput) adminPasswordInput.focus();
}

function openAdminDashboard() {
  closeModals();
  if (adminDashboardModal) {
    adminDashboardModal.style.display = 'block';
    adminDashboardModal.classList.add('active');
  }
  if (modalBackdrop) modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  switchAdminTab('add');
  renderAdminProductTable();
}

function switchAdminTab(tabName) {
  tabAddProduct.classList.remove('active');
  tabManageProducts.classList.remove('active');
  tabAiSync.classList.remove('active');
  adminPanelAdd.style.display = 'none';
  adminPanelList.style.display = 'none';
  adminPanelAi.style.display = 'none';

  if (tabName === 'add') {
    tabAddProduct.classList.add('active');
    adminPanelAdd.style.display = 'block';
  } else if (tabName === 'manage') {
    tabManageProducts.classList.add('active');
    adminPanelList.style.display = 'block';
    renderAdminProductTable();
  } else if (tabName === 'ai') {
    tabAiSync.classList.add('active');
    adminPanelAi.style.display = 'block';
  }
}

function renderAdminProductTable() {
  const all = getAllProducts();
  if (adminProductCount) adminProductCount.textContent = all.length;
  if (!adminProductTable) return;

  if (all.length === 0) {
    adminProductTable.innerHTML = '<p style="color:#A3968E; text-align:center; padding:30px;">등록된 상품이 없습니다.</p>';
    return;
  }

  adminProductTable.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>사진</th>
          <th>상품명</th>
          <th>시즌</th>
          <th>판매가</th>
          <th>분류</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        ${all.map(p => `
          <tr>
            <td>
              <img src="${(p.images && p.images[0]) ? p.images[0] : 'images/blanket_fluffy.jpg'}" style="width:48px; height:48px; object-fit:cover; border-radius:4px; border:1px solid #E8E0D5;">
            </td>
            <td>
              <strong>${p.name}</strong><br>
              <span style="font-size:0.75rem; color:#8C8077;">${p.subtitle || ''}</span>
            </td>
            <td>${p.season === 'winter' ? '❄️ 겨울' : '☀️ 여름'}</td>
            <td><strong>${p.price.toLocaleString()}원</strong></td>
            <td>${p.isCustom ? '<span style="color:#A45938; font-weight:700;">직접 등록</span>' : (editedProductsMap[p.id] ? '<span style="color:#1E6091; font-weight:700;">수정됨</span>' : '<span style="color:#8C8077;">기본 상품</span>')}</td>
            <td style="white-space:nowrap;">
              <button type="button" class="btn-edit-prod" onclick="openEditProductModal('${p.id}')">수정</button>
              <button type="button" class="btn-delete-prod" onclick="deleteCustomProduct('${p.id}')">삭제</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// 상품 수정 시 상세 이미지 관리 임시 배열
let currentEditingDetailImages = [];

// 상세 이미지 목록 미리보기 렌더링
function renderEditDetailImagesList() {
  const container = document.getElementById('editDetailImagesList');
  const countEl = document.getElementById('editDetailCount');
  if (!container) return;

  if (countEl) countEl.textContent = currentEditingDetailImages.length;

  if (currentEditingDetailImages.length === 0) {
    container.innerHTML = '<p style="color:#A3968E; font-size:0.8rem; width:100%; text-align:center; padding:16px 0;">등록된 상세 안내 이미지가 없습니다. 아래 [➕ 추가] 버튼을 눌러 사진을 등록하세요.</p>';
    return;
  }

  container.innerHTML = currentEditingDetailImages.map((imgSrc, idx) => `
    <div style="position:relative; width:80px; height:105px; border-radius:6px; overflow:hidden; border:1px solid #D5CECE; background:#FAF7F2; flex-shrink:0;">
      <img src="${imgSrc}" alt="상세컷 ${idx + 1}" style="width:100%; height:100%; object-fit:cover;">
      <span style="position:absolute; bottom:3px; left:4px; font-size:10px; font-weight:700; background:rgba(0,0,0,0.65); color:#FFF; padding:1px 5px; border-radius:3px;">#${idx + 1}</span>
      <button type="button" onclick="removeEditDetailImage(${idx})" title="이 이미지 삭제" style="position:absolute; top:3px; right:3px; width:20px; height:20px; border-radius:50%; background:#E63946; color:#FFF; border:none; cursor:pointer; font-size:11px; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,0.3);">✕</button>
    </div>
  `).join('');
}

// 특정 상세 이미지 1장 삭제
window.removeEditDetailImage = function(index) {
  currentEditingDetailImages.splice(index, 1);
  renderEditDetailImagesList();
};

// 상품 수정 모달 열기
window.openEditProductModal = function(id) {
  const all = getAllProducts();
  const prod = all.find(p => p.id === id);
  if (!prod) return;

  const modal = document.getElementById('adminEditModal');
  if (!modal) return;

  document.getElementById('editProdId').value = prod.id;
  document.getElementById('editProdName').value = prod.name || '';
  document.getElementById('editProdSubtitle').value = prod.subtitle || '';
  document.getElementById('editProdPrice').value = prod.price || 0;
  document.getElementById('editProdBadge').value = prod.badge || '';
  document.getElementById('editProdSeason').value = prod.season || 'winter';

  const thumbImg = (prod.images && prod.images[0]) || '';
  document.getElementById('editProdImage').value = thumbImg;
  const thumbPreview = document.getElementById('editProdThumbPreview');
  if (thumbPreview) {
    thumbPreview.src = thumbImg || 'images/blanket_fluffy.jpg';
  }

  // 상세 이미지 배열 복사 및 렌더링
  currentEditingDetailImages = [...(prod.detailImages || [])];
  renderEditDetailImagesList();

  document.getElementById('editProdColors').value = (prod.colors || []).map(c => c.name).join(', ');
  document.getElementById('editProdSizes').value = (prod.sizes || []).map(s => s.name).join(', ');
  document.getElementById('editProdDesc').value = prod.description || '';

  modal.style.display = 'block';
  modal.classList.add('active');
};

// 썸네일 직접 파일 업로드 핸들러
const editProdThumbFile = document.getElementById('editProdThumbFile');
if (editProdThumbFile) {
  editProdThumbFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (re) => {
      const dataUrl = re.target.result;
      const preview = document.getElementById('editProdThumbPreview');
      if (preview) preview.src = dataUrl;
      const imgInput = document.getElementById('editProdImage');
      if (imgInput) imgInput.value = dataUrl;
      const fileNameEl = document.getElementById('editThumbFileName');
      if (fileNameEl) fileNameEl.textContent = file.name;
    };
    reader.readAsDataURL(file);
  });
}

// 썸네일 이미지 삭제 버튼
const btnRemoveEditThumb = document.getElementById('btnRemoveEditThumb');
if (btnRemoveEditThumb) {
  btnRemoveEditThumb.addEventListener('click', () => {
    const preview = document.getElementById('editProdThumbPreview');
    if (preview) preview.src = '';
    const imgInput = document.getElementById('editProdImage');
    if (imgInput) imgInput.value = '';
    const fileInput = document.getElementById('editProdThumbFile');
    if (fileInput) fileInput.value = '';
    const fileNameEl = document.getElementById('editThumbFileName');
    if (fileNameEl) fileNameEl.textContent = '썸네일 삭제됨';
  });
}

// 썸네일 경로 input 수동 입력 시 미리보기 반영
const editProdImageInput = document.getElementById('editProdImage');
if (editProdImageInput) {
  editProdImageInput.addEventListener('input', (e) => {
    const preview = document.getElementById('editProdThumbPreview');
    if (preview) preview.src = e.target.value;
  });
}

// 새 상세페이지 파일 다중 추가 업로드 핸들러
const editDetailFilesInput = document.getElementById('editDetailFilesInput');
if (editDetailFilesInput) {
  editDetailFilesInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    let loadedCount = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (re) => {
        currentEditingDetailImages.push(re.target.result);
        loadedCount++;
        if (loadedCount === files.length) {
          renderEditDetailImagesList();
          editDetailFilesInput.value = '';
          showToast(`${files.length}장의 상세 이미지가 추가되었습니다.`);
        }
      };
      reader.readAsDataURL(file);
    });
  });
}

// 상세 이미지 전체 삭제 버튼
const btnClearAllDetailImages = document.getElementById('btnClearAllDetailImages');
if (btnClearAllDetailImages) {
  btnClearAllDetailImages.addEventListener('click', () => {
    if (currentEditingDetailImages.length === 0) return;
    if (confirm('등록된 상세 이미지를 모두 삭제하시겠습니까?')) {
      currentEditingDetailImages = [];
      renderEditDetailImagesList();
      showToast('상세 이미지가 모두 삭제되었습니다.');
    }
  });
}

// 상품 수정 모달 닫기
function closeAdminEditModal() {
  const modal = document.getElementById('adminEditModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

// 상품 수정 폼 서브밋 이벤트
const adminEditProductForm = document.getElementById('adminEditProductForm');
if (adminEditProductForm) {
  adminEditProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('editProdId').value;
    const all = getAllProducts();
    const targetProd = all.find(p => p.id === id);
    if (!targetProd) return;

    const name = document.getElementById('editProdName').value.trim();
    const subtitle = document.getElementById('editProdSubtitle').value.trim();
    const price = parseInt(document.getElementById('editProdPrice').value, 10) || 0;
    const badge = document.getElementById('editProdBadge').value.trim();
    const season = document.getElementById('editProdSeason').value;
    const mainImg = document.getElementById('editProdImage').value.trim();
    const colorsRaw = document.getElementById('editProdColors').value.trim();
    const sizesRaw = document.getElementById('editProdSizes').value.trim();
    const desc = document.getElementById('editProdDesc').value.trim();

    // 색상 옵션 파싱
    const colors = colorsRaw
      ? colorsRaw.split(',').map(s => s.trim()).filter(Boolean).map(s => ({ name: s, hex: '#C7C9CC', extraPrice: 0 }))
      : (targetProd.colors || [{ name: '단일 색상', hex: '#C7C9CC', extraPrice: 0 }]);

    // 사이즈 옵션 파싱
    const sizes = sizesRaw
      ? sizesRaw.split(',').map(s => s.trim()).filter(Boolean).map(s => ({ name: s, extraPrice: 0 }))
      : (targetProd.sizes || [{ name: '기본 사이즈', extraPrice: 0 }]);

    const updatedData = {
      name,
      subtitle,
      price,
      badge,
      season,
      description: desc,
      colors,
      sizes,
      detailImages: [...currentEditingDetailImages]
    };

    if (mainImg) {
      updatedData.images = [mainImg, ...(targetProd.images ? targetProd.images.slice(1) : [])];
    } else {
      updatedData.images = [];
    }

    // localStorage에 수정사항 영구 저장
    editedProductsMap[id] = { ...(editedProductsMap[id] || {}), ...updatedData };
    localStorage.setItem('ns_edited_products', JSON.stringify(editedProductsMap));

    // 커스텀 상품인 경우 커스텀 목록도 갱신
    const customIdx = customProducts.findIndex(p => p.id === id);
    if (customIdx !== -1) {
      customProducts[customIdx] = { ...customProducts[customIdx], ...updatedData };
      localStorage.setItem('ns_custom_products', JSON.stringify(customProducts));
    }

    closeAdminEditModal();
    renderProducts();
    renderAdminProductTable();
    showToast(`'${name}' 상품 정보(썸네일/상세이미지)가 성공적으로 저장되었습니다.`);
  });
}

// 수정 모달 닫기 버튼 이벤트
const closeAdminEditBtn = document.getElementById('closeAdminEditBtn');
if (closeAdminEditBtn) {
  closeAdminEditBtn.addEventListener('click', closeAdminEditModal);
}
const btnCancelEdit = document.getElementById('btnCancelEdit');
if (btnCancelEdit) {
  btnCancelEdit.addEventListener('click', closeAdminEditModal);
}

// 상품 삭제
window.deleteCustomProduct = function(id) {
  if (!confirm('정말 이 상품을 목록에서 삭제하시겠습니까?')) return;

  if (customProducts.some(p => p.id === id)) {
    customProducts = customProducts.filter(p => p.id !== id);
    localStorage.setItem('ns_custom_products', JSON.stringify(customProducts));
  } else {
    // 기본 상품 삭제 시 커스텀에서 제외 필터링 플래그 등록
    const idx = PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      PRODUCTS.splice(idx, 1);
    }
  }

  // 수정 내역에서도 제거
  if (editedProductsMap[id]) {
    delete editedProductsMap[id];
    localStorage.setItem('ns_edited_products', JSON.stringify(editedProductsMap));
  }

  renderProducts();
  renderAdminProductTable();
  showToast('상품이 삭제되었습니다.');
};

// 10. 토스트 알림창
let toastTimer = null;
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('active');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('active');
  }, 3000);
}
