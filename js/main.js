/* HOTEL SETOUCHI BLUE — Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCurrentNav();
  initMobileNav();
  initFadeIn();
  initFaq();
  initBooking();
  initParallax();
});

/* ---- Subtle parallax ---- */
function initParallax() {
  const targets = document.querySelectorAll('.page-hero__image img, .cta-section__bg img, .villa-cta__bg img');
  if (!targets.length) return;

  const updateParallax = () => {
    const scroll = Math.max(0, window.scrollY);

    targets.forEach(img => {
      const parent = img.closest('.page-hero, .cta-section, .villa-cta');
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      // ページ最上部では画像を動かさない（上に隙間が出るのを防ぐ）
      if (scroll <= 0) {
        img.style.transform = 'scale(1.05) translateY(0)';
        return;
      }

      const offset = Math.min(scroll * 0.06, 48);
      img.style.transform = `scale(1.08) translateY(${offset}px)`;
    });
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
}

/* ---- Header scroll ---- */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const isTransparentHero = document.body.classList.contains('page-home');

  if (isTransparentHero) {
    header.classList.add('is-transparent');
  } else {
    header.classList.add('is-scrolled');
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled');
      header.classList.remove('is-transparent');
    } else if (isTransparentHero) {
      header.classList.remove('is-scrolled');
      header.classList.add('is-transparent');
    }
  }, { passive: true });
}

/* ---- Current page nav ---- */
function initCurrentNav() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  const current = file === '' ? 'index.html' : file;

  document.querySelectorAll('.main-nav a, .mobile-nav ul a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop().split('#')[0];
    if (linkFile === current) {
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (current === 'booking.html') {
    document.querySelectorAll('.btn-booking-header, .btn-booking-mobile').forEach(btn => {
      btn.classList.add('is-current');
      btn.setAttribute('aria-current', 'page');
    });
  }
}

/* ---- Mobile navigation ---- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-active');
    mobileNav.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-active');
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Fade in on scroll ---- */
function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---- FAQ accordion ---- */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach(i => {
        if (i !== item) closeFaqItem(i);
      });

      if (!isOpen) openFaqItem(item);
      else closeFaqItem(item);
    });
  });
}

function openFaqItem(item) {
  const answer = item.querySelector('.faq-answer');
  const btn = item.querySelector('.faq-question');
  item.classList.add('is-open');
  answer.style.maxHeight = `${answer.scrollHeight}px`;
  if (btn) btn.setAttribute('aria-expanded', 'true');
}

function closeFaqItem(item) {
  const answer = item.querySelector('.faq-answer');
  const btn = item.querySelector('.faq-question');
  item.classList.remove('is-open');
  answer.style.maxHeight = '0';
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

/* ---- Booking page ---- */
function initBooking() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const roomPrices = {
    'blue-standard': 24000,
    'horizon-twin': 36000,
    'terrace-room': 54000,
    'setouchi-suite': 88000
  };

  const breakfastPrice = 2000;
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const roomType = document.getElementById('room-type');
  const guests = document.getElementById('guests');
  const breakfast = document.getElementById('breakfast');
  const priceAmount = document.getElementById('price-amount');
  const priceBreakdown = document.getElementById('price-breakdown');
  const successMsg = document.getElementById('booking-success');

  function calcNights() {
    if (!checkin.value || !checkout.value) return 0;
    const start = new Date(checkin.value);
    const end = new Date(checkout.value);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }

  function updatePrice() {
    const nights = calcNights();
    const room = roomType.value;
    const basePrice = roomPrices[room] || 0;
    const hasBreakfast = breakfast.checked;
    const numGuests = parseInt(guests.value) || 1;

    let total = basePrice * nights;
    if (hasBreakfast) total += breakfastPrice * numGuests * nights;

    if (nights > 0 && basePrice > 0) {
      priceAmount.textContent = '¥' + total.toLocaleString() + '〜';
      let breakdown = `${nights}泊 × ¥${basePrice.toLocaleString()}`;
      if (hasBreakfast) breakdown += ` + 朝食 ¥${(breakfastPrice * numGuests * nights).toLocaleString()}`;
      priceBreakdown.textContent = breakdown;
    } else {
      priceAmount.textContent = '¥—';
      priceBreakdown.textContent = '日程と客室を選択してください';
    }
  }

  [checkin, checkout, roomType, guests, breakfast].forEach(el => {
    if (el) el.addEventListener('change', updatePrice);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (successMsg) {
      successMsg.classList.add('is-show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.querySelector('button[type="submit"]').disabled = true;
  });

  initCalendar();
  updatePrice();
}

/* ---- Calendar UI ---- */
function initCalendar() {
  const grid = document.getElementById('calendar-grid');
  const monthLabel = document.getElementById('calendar-month');
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  if (!grid || !monthLabel) return;

  let currentDate = new Date();
  let selectedStart = null;
  let selectedEnd = null;

  const unavailable = new Set();
  // ランダムに数室を不可に（見た目用）
  const seed = currentDate.getMonth();
  for (let d = 1; d <= 28; d++) {
    if ((d + seed) % 5 === 0) unavailable.add(d);
  }

  function render() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthLabel.textContent = `${year}.${String(month + 1).padStart(2, '0')}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    grid.innerHTML = '';

    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    dayNames.forEach(d => {
      const el = document.createElement('div');
      el.className = 'calendar__day-name';
      el.textContent = d;
      grid.appendChild(el);
    });

    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'calendar__day is-empty';
      grid.appendChild(el);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      el.className = 'calendar__day';
      el.textContent = d;

      const dateObj = new Date(year, month, d);
      if (dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        el.classList.add('is-disabled');
      } else if (unavailable.has(d)) {
        el.classList.add('is-disabled');
        el.title = '満室';
      }

      if (selectedStart && d === selectedStart.getDate() && month === selectedStart.getMonth()) {
        el.classList.add('is-selected');
      }
      if (selectedEnd && d === selectedEnd.getDate() && month === selectedEnd.getMonth()) {
        el.classList.add('is-selected');
      }
      if (selectedStart && selectedEnd) {
        const cur = new Date(year, month, d);
        if (cur > selectedStart && cur < selectedEnd) el.classList.add('is-range');
      }

      if (!el.classList.contains('is-disabled')) {
        el.addEventListener('click', () => selectDate(year, month, d));
      }

      grid.appendChild(el);
    }
  }

  function selectDate(year, month, day) {
    const date = new Date(year, month, day);
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');

    if (!selectedStart || (selectedStart && selectedEnd)) {
      selectedStart = date;
      selectedEnd = null;
      if (checkin) checkin.value = formatDate(date);
      if (checkout) checkout.value = '';
    } else {
      if (date <= selectedStart) {
        selectedStart = date;
        selectedEnd = null;
        if (checkin) checkin.value = formatDate(date);
        if (checkout) checkout.value = '';
      } else {
        selectedEnd = date;
        if (checkout) checkout.value = formatDate(date);
      }
    }
    render();
    const event = new Event('change');
    if (checkin) checkin.dispatchEvent(event);
  }

  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    render();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    render();
  });

  render();
}
