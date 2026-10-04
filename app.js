// NS HOME 자사몰 - 핵심 애플리케이션 및 관리자 시스템 스크립트

// 상태 관리
let currentFilter = 'all';
let cart = JSON.parse(localStorage.getItem('ns_cart') || '[]');
let customProducts = JSON.parse(localStorage.getItem('ns_custom_products') || '[]');
let welcomeCouponApplied = false;
let selectedProduct = null;
let currentOption = {
  color: null,
  size: null
};

// 모든 상품 데이터 조회 (커스텀 등록 상품 + 기본 상품)
function getAllProducts() {
  return [...customProducts, ...PRODUCTS];
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
const newProdPresetImage = document.getElementById('newProdPresetImage');
const newProdImagePreview = document.getElementById('newProdImagePreview');
const previewImg = document.getElementById('previewImg');
let uploadedImageBase64 = '';

// 1. 초기화
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderReviews();
  updateCartUI();
  setupEventListeners();
  setupAdminSystem();
});

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
      const sizeObj = selectedProduct.sizes[modalSizeSelect.selectedIndex];
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
      const sizeObj = selectedProduct.sizes[modalSizeSelect.selectedIndex];
      addToCart(selectedProduct, currentOption.color, sizeObj, qty);
      closeModals();
      openCheckout();
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

// 3. 상품 렌더링
function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  const all = getAllProducts();
  const filtered = all.filter(p => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'winter') return p.season === 'winter';
    if (currentFilter === 'summer') return p.season === 'summer';
    if (currentFilter === 'best') return p.isBest;
    return true;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-muted);">
        <p>선택하신 카테고리에 등록된 상품이 없습니다.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    
    // 배지 스타일
    let badgeClass = 'badge-float';
    if (product.coupangUrl) badgeClass += ' badge-coupang';
    else if (product.season === 'summer') badgeClass += ' badge-summer';

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

        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <strong>${(product.rating || 4.9).toFixed(1)}</strong>
          <span class="review-count">(${((product.reviewCount || 120)).toLocaleString()}개 리뷰)</span>
        </div>

        <div class="product-price-row">
          <div class="price-block">
            <span class="discount-rate">${product.discountRate || 30}%</span>
            <div class="final-price">${(product.price || 0).toLocaleString()}<span>원</span></div>
          </div>
          <span class="original-price">${(product.originalPrice || Math.round(product.price * 1.4)).toLocaleString()}원</span>
        </div>

        <div class="card-actions">
          <button class="btn-card-add" onclick="quickAddToCart('${product.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            장바구니 담기
          </button>
          ${product.coupangUrl ? `
            <a href="${product.coupangUrl}" target="_blank" rel="noopener noreferrer" class="btn-card-coupang" title="쿠팡에서 상품 보기">
              쿠팡 바로가기 ↗
            </a>
          ` : ''}
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

  const colors = selectedProduct.colors && selectedProduct.colors.length > 0 
    ? selectedProduct.colors 
    : [{ name: "단일 색상", hex: "#C5A059", extraPrice: 0 }];

  const sizes = selectedProduct.sizes && selectedProduct.sizes.length > 0
    ? selectedProduct.sizes
    : [{ name: "기본 사이즈", extraPrice: 0 }];

  currentOption.color = colors[0];
  currentOption.size = sizes[0];

  modalImg.src = selectedProduct.images && selectedProduct.images[0] ? selectedProduct.images[0] : 'images/blanket_fluffy.jpg';
  modalImg.alt = selectedProduct.name;
  modalBadge.textContent = selectedProduct.badge || 'BEST';
  modalTitle.textContent = selectedProduct.name;
  modalSubtitle.textContent = selectedProduct.subtitle || '';
  modalRating.textContent = `${(selectedProduct.rating || 4.9).toFixed(1)} (${(selectedProduct.reviewCount || 100).toLocaleString()} 리뷰)`;
  modalDesc.textContent = selectedProduct.description || '편안하고 포근한 NS HOME의 엄선 계절 아이템입니다.';
  modalQtyInput.value = 1;

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
  const origPrice = selectedProduct.originalPrice || Math.round(selectedProduct.price * 1.4);
  modalOriginalPrice.textContent = `${(origPrice * qty).toLocaleString()}원`;
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
  if (adminLoginModal) adminLoginModal.classList.remove('active');
  if (adminDashboardModal) adminDashboardModal.classList.remove('active');
  document.body.style.overflow = '';
}

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

      const coupangUrl = document.getElementById('newProdCoupang').value.trim();
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
        coupangUrl: coupangUrl,
        price: price,
        originalPrice: originalPrice,
        discountRate: discountRate,
        rating: 5.0,
        reviewCount: 1,
        images: [finalImg],
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
      uploadedImageBase64 = '';

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
  modalBackdrop.classList.add('active');
  adminLoginModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (adminPasswordInput) adminPasswordInput.focus();
}

function openAdminDashboard() {
  closeModals();
  modalBackdrop.classList.add('active');
  adminDashboardModal.classList.add('active');
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
              <img src="${p.images[0]}" style="width:48px; height:48px; object-fit:cover; border-radius:4px; border:1px solid #E8E0D5;">
            </td>
            <td>
              <strong>${p.name}</strong><br>
              <span style="font-size:0.75rem; color:#8C8077;">${p.subtitle || ''}</span>
            </td>
            <td>${p.season === 'winter' ? '❄️ 겨울' : '☀️ 여름'}</td>
            <td><strong>${p.price.toLocaleString()}원</strong></td>
            <td>${p.isCustom ? '<span style="color:#A45938; font-weight:700;">직접 등록</span>' : '<span style="color:#8C8077;">기본 상품</span>'}</td>
            <td>
              ${p.isCustom ? `
                <button type="button" class="btn-delete-prod" onclick="deleteCustomProduct('${p.id}')">삭제</button>
              ` : `
                <button type="button" class="btn-delete-prod" onclick="deleteCustomProduct('${p.id}')" title="숨기기">삭제</button>
              `}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
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
