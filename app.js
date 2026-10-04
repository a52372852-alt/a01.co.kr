// NS HOME 자사몰 - 핵심 애플리케이션 스크립트

// 상태 관리
let currentFilter = 'all';
let cart = JSON.parse(localStorage.getItem('ns_cart') || '[]');
let welcomeCouponApplied = false;
let selectedProduct = null;
let currentOption = {
  color: null,
  size: null
};

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

// 1. 초기화
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderReviews();
  updateCartUI();
  setupEventListeners();
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
  document.getElementById('openCartBtn').addEventListener('click', openCart);
  document.getElementById('closeCartBtn').addEventListener('click', closeModals);
  modalBackdrop.addEventListener('click', closeModals);

  // 모달 닫기
  document.getElementById('closeDetailBtn').addEventListener('click', closeModals);
  document.getElementById('closeCheckoutBtn').addEventListener('click', closeModals);
  document.getElementById('closeSuccessBtn').addEventListener('click', closeModals);

  // 수량 조절 버튼 in Modal
  document.getElementById('modalQtyMinus').addEventListener('click', () => {
    let q = parseInt(modalQtyInput.value, 10);
    if (q > 1) {
      modalQtyInput.value = q - 1;
      updateModalPrice();
    }
  });
  document.getElementById('modalQtyPlus').addEventListener('click', () => {
    let q = parseInt(modalQtyInput.value, 10);
    modalQtyInput.value = q + 1;
    updateModalPrice();
  });

  // 사이즈 선택 변경
  modalSizeSelect.addEventListener('change', updateModalPrice);

  // 모달 내 장바구니 / 바로구매
  document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
    if (!selectedProduct) return;
    const qty = parseInt(modalQtyInput.value, 10) || 1;
    const sizeObj = selectedProduct.sizes[modalSizeSelect.selectedIndex];
    addToCart(selectedProduct, currentOption.color, sizeObj, qty);
    closeModals();
    openCart();
    showToast(`"${selectedProduct.name}" 이(가) 장바구니에 담겼습니다.`);
  });

  document.getElementById('modalBuyNowBtn').addEventListener('click', () => {
    if (!selectedProduct) return;
    const qty = parseInt(modalQtyInput.value, 10) || 1;
    const sizeObj = selectedProduct.sizes[modalSizeSelect.selectedIndex];
    addToCart(selectedProduct, currentOption.color, sizeObj, qty);
    closeModals();
    openCheckout();
  });

  // 쿠폰 적용 토글
  document.getElementById('applyCouponBtn').addEventListener('click', () => {
    welcomeCouponApplied = !welcomeCouponApplied;
    const btn = document.getElementById('applyCouponBtn');
    if (welcomeCouponApplied) {
      btn.textContent = '적용 해제';
      btn.style.background = '#F0D4C5';
      showToast('3,000원 웰컴 할인 쿠폰이 적용되었습니다!');
    } else {
      btn.textContent = '쿠폰 적용';
      btn.style.background = 'var(--warm-terracotta-light)';
      showToast('쿠폰 적용이 해제되었습니다.');
    }
    updateCartUI();
  });

  // 체크아웃 진행 버튼
  document.getElementById('proceedCheckoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('장바구니가 비어 있습니다.');
      return;
    }
    closeModals();
    openCheckout();
  });

  // 결제 수단 탭 선택
  const payCards = document.querySelectorAll('.pay-method-card');
  payCards.forEach(card => {
    card.addEventListener('click', () => {
      payCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // 결제 폼 제출 (주문 및 결제)
  checkoutForm.addEventListener('submit', handleCheckoutSubmit);
}

// 3. 상품 렌더링
function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  const filtered = PRODUCTS.filter(p => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'winter') return p.season === 'winter';
    if (currentFilter === 'summer') return p.season === 'summer';
    if (currentFilter === 'best') return p.isBest;
    return true;
  });

  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    
    // 배지 스타일
    let badgeClass = 'badge-float';
    if (product.coupangUrl) badgeClass += ' badge-coupang';
    else if (product.season === 'summer') badgeClass += ' badge-summer';

    card.innerHTML = `
      <div class="product-thumb-wrap" onclick="openProductDetail('${product.id}')">
        <span class="${badgeClass}">${product.badge}</span>
        <img src="${product.images[0]}" alt="${product.name}" class="product-thumb" loading="lazy">
        <button class="btn-quick-view" type="button">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          상세 옵션 보기
        </button>
      </div>

      <div class="product-info">
        <div class="product-tags">
          ${product.tags.slice(0, 3).map(t => `<span class="tag-chip">#${t}</span>`).join('')}
        </div>

        <h3 class="product-name" onclick="openProductDetail('${product.id}')">${product.name}</h3>
        <p class="product-sub">${product.subtitle}</p>

        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <strong>${product.rating.toFixed(1)}</strong>
          <span class="review-count">(${product.reviewCount.toLocaleString()}개 리뷰)</span>
        </div>

        <div class="product-price-row">
          <div class="price-block">
            <span class="discount-rate">${product.discountRate}%</span>
            <div class="final-price">${product.price.toLocaleString()}<span>원</span></div>
          </div>
          <span class="original-price">${product.originalPrice.toLocaleString()}원</span>
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
  selectedProduct = PRODUCTS.find(p => p.id === productId);
  if (!selectedProduct) return;

  currentOption.color = selectedProduct.colors[0];
  currentOption.size = selectedProduct.sizes[0];

  modalImg.src = selectedProduct.images[0];
  modalImg.alt = selectedProduct.name;
  modalBadge.textContent = selectedProduct.badge;
  modalTitle.textContent = selectedProduct.name;
  modalSubtitle.textContent = selectedProduct.subtitle;
  modalRating.textContent = `${selectedProduct.rating} (${selectedProduct.reviewCount.toLocaleString()} 리뷰)`;
  modalDesc.textContent = selectedProduct.description;
  modalQtyInput.value = 1;

  // 컬러 스와치 생성
  modalSwatches.innerHTML = '';
  selectedProduct.colors.forEach((col, idx) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = `swatch-btn ${idx === 0 ? 'selected' : ''}`;
    swatch.style.backgroundColor = col.hex;
    swatch.title = col.name;
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('selected'));
      swatch.classList.add('selected');
      currentOption.color = col;
      modalColorName.textContent = col.name;
    });
    modalSwatches.appendChild(swatch);
  });
  modalColorName.textContent = selectedProduct.colors[0].name;

  // 사이즈 셀렉트 박스 생성
  modalSizeSelect.innerHTML = '';
  selectedProduct.sizes.forEach(size => {
    const opt = document.createElement('option');
    opt.value = size.name;
    opt.textContent = size.extraPrice > 0 
      ? `${size.name} (+${size.extraPrice.toLocaleString()}원)`
      : size.name;
    modalSizeSelect.appendChild(opt);
  });

  // 상세 스펙 테이블
  modalSpecList.innerHTML = selectedProduct.details.map(d => `
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
  const sizeObj = selectedProduct.sizes[modalSizeSelect.selectedIndex] || selectedProduct.sizes[0];
  const unitPrice = selectedProduct.price + sizeObj.extraPrice;
  const totalPrice = unitPrice * qty;

  modalPrice.textContent = `${totalPrice.toLocaleString()}원`;
  modalOriginalPrice.textContent = `${(selectedProduct.originalPrice * qty).toLocaleString()}원`;
}

// 5. 장바구니 로직
function quickAddToCart(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  addToCart(p, p.colors[0], p.sizes[0], 1);
  showToast(`"${p.name}" 이(가) 장바구니에 담겼습니다.`);
  openCart();
}

function addToCart(product, color, size, qty = 1) {
  const cartKey = `${product.id}_${color.name}_${size.name}`;
  const existing = cart.find(item => item.key === cartKey);

  const unitPrice = product.price + size.extraPrice;

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key: cartKey,
      id: product.id,
      name: product.name,
      image: product.images[0],
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
  // 뱃지 업데이트
  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  cartCountBadges.forEach(b => {
    b.textContent = totalItems;
    b.style.display = totalItems > 0 ? 'flex' : 'none';
  });

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <p>장바구니가 비어 있습니다.<br>올겨울을 따뜻하게 녹여줄 담요를 담아보세요.</p>
      </div>
    `;
    cartSubtotalEl.textContent = '0원';
    cartShippingEl.textContent = '0원';
    cartTotalEl.textContent = '0원';
    shippingProgressText.innerHTML = '<strong>30,000원</strong> 이상 구매 시 무료배송!';
    shippingProgressFill.style.width = '0%';
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
  if (isFreeShipping) {
    shippingProgressText.innerHTML = '🎉 <strong>무료배송 혜택</strong>이 적용되었습니다!';
    shippingProgressFill.style.width = '100%';
  } else {
    const remain = FREE_SHIPPING_THRESHOLD - subtotal;
    const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
    shippingProgressText.innerHTML = `<strong>${remain.toLocaleString()}원</strong> 더 담으면 무료배송!`;
    shippingProgressFill.style.width = `${pct}%`;
  }

  cartSubtotalEl.textContent = `${subtotal.toLocaleString()}원`;
  
  if (welcomeCouponApplied) {
    cartDiscountRow.style.display = 'flex';
    cartDiscountEl.textContent = `-3,000원`;
  } else {
    cartDiscountRow.style.display = 'none';
  }

  cartShippingEl.textContent = isFreeShipping ? '무료' : `${shippingFee.toLocaleString()}원`;
  cartTotalEl.textContent = `${finalTotal.toLocaleString()}원`;
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

  // 주문 내역 요약 렌더링
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
  modalBackdrop.classList.remove('active');
  cartDrawer.classList.remove('active');
  detailModal.classList.remove('active');
  checkoutModal.classList.remove('active');
  successModal.classList.remove('active');
  document.body.style.overflow = '';
}

// 7. 결제 처리 핸들러 (실제 결제 시뮬레이션 및 Toss SDK 준비)
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

  // 결제 승인 시뮬레이션 (1.2초 후 완료 화면)
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '결제하기';

    // 영수증 데이터 주입
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

    // 장바구니 비우기
    cart = [];
    saveCart();
    updateCartUI();

    // 창 전환
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

// 9. 토스트 알림창
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

// 스피너 키프레임 주입
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
