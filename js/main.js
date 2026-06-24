/* HOTEL SETOUCHI BLUE — Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCurrentNav();
  initMobileNav();
  initFixedBookingCta();
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

  hamburger.setAttribute('aria-controls', mobileNav.id);
  hamburger.setAttribute('aria-expanded', 'false');

  const closeNav = () => {
    hamburger.classList.remove('is-active');
    mobileNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  };

  const openNav = () => {
    hamburger.classList.add('is-active');
    mobileNav.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'メニューを閉じる');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('is-active');
    if (isOpen) closeNav();
    else openNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeNav();
      hamburger.focus();
    }
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });
}

/* ---- Mobile fixed booking CTA ---- */
function initFixedBookingCta() {
  const file = (window.location.pathname.split('/').pop() || 'index.html').split('#')[0];
  if (file === 'booking.html') return;

  const cta = document.createElement('a');
  cta.href = 'booking.html';
  cta.className = 'fixed-booking-cta';
  cta.setAttribute('aria-label', '予約ページへ移動');
  cta.innerHTML = '予約する <span>空室確認へ</span>';
  document.body.appendChild(cta);
  document.body.classList.add('has-fixed-booking-cta');
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

  items.forEach((item, index) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    if (!answer.id) answer.id = `faq-answer-${index + 1}`;
    btn.setAttribute('aria-controls', answer.id);
    btn.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');

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
  if (answer) answer.setAttribute('aria-hidden', 'false');
}

function closeFaqItem(item) {
  const answer = item.querySelector('.faq-answer');
  const btn = item.querySelector('.faq-question');
  item.classList.remove('is-open');
  answer.style.maxHeight = '0';
  if (btn) btn.setAttribute('aria-expanded', 'false');
  if (answer) answer.setAttribute('aria-hidden', 'true');
}

function parseDateInput(value) {
  if (!value) return null;
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function formatDateInput(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

function dispatchFieldChange(field) {
  if (!field) return;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
}

/* ---- Booking page ---- */
function initBooking() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  form.noValidate = true;

  const rooms = {
    'blue-standard': { label: 'BLUE STANDARD — 朝凪', price: 24000, minGuests: 1, maxGuests: 2 },
    'horizon-twin': { label: 'HORIZON TWIN — 水面', price: 36000, minGuests: 2, maxGuests: 2 },
    'terrace-room': { label: 'TERRACE ROOM — 島風', price: 54000, minGuests: 2, maxGuests: 4 },
    'setouchi-suite': { label: 'SETOUCHI SUITE — 夕凪', price: 88000, minGuests: 2, maxGuests: 2 }
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
  const capacityHelp = document.getElementById('room-capacity-help');
  const bookingError = document.getElementById('booking-error');
  const submitButton = form.querySelector('button[type="submit"]');

  const requestedRoom = new URLSearchParams(window.location.search).get('room');
  if (requestedRoom && rooms[requestedRoom] && roomType) {
    roomType.value = requestedRoom;
  }

  if (capacityHelp) {
    guests?.setAttribute('aria-describedby', capacityHelp.id);
    roomType?.setAttribute('aria-describedby', capacityHelp.id);
  }

  function getSelectedRoom() {
    return rooms[roomType?.value] || rooms['blue-standard'];
  }

  function syncGuestOptions() {
    if (!guests) return;
    const room = getSelectedRoom();
    const current = parseInt(guests.value, 10) || room.minGuests;

    Array.from(guests.options).forEach(option => {
      const value = parseInt(option.value, 10);
      option.disabled = value < room.minGuests || value > room.maxGuests;
    });

    if (current < room.minGuests) guests.value = String(room.minGuests);
    if (current > room.maxGuests) guests.value = String(room.maxGuests);

    if (capacityHelp) {
      const capacity = room.minGuests === room.maxGuests
        ? `${room.maxGuests}名`
        : `${room.minGuests}〜${room.maxGuests}名`;
      capacityHelp.textContent = `${room.label}の定員は${capacity}です。`;
    }
  }

  function syncDateConstraints() {
    if (!checkin || !checkout) return;
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayValue = formatDateInput(todayDate);

    checkin.min = todayValue;
    if (checkin.value && checkin.value < todayValue) {
      checkin.value = todayValue;
    }

    const checkinDate = parseDateInput(checkin.value);
    const minCheckout = checkinDate ? addDays(checkinDate, 1) : addDays(todayDate, 1);
    checkout.min = formatDateInput(minCheckout);
  }

  function validateStay(showMessage = false) {
    if (!checkin || !checkout) return true;
    const start = parseDateInput(checkin.value);
    const end = parseDateInput(checkout.value);
    let message = '';

    if (start && end && end <= start) {
      message = 'チェックアウトはチェックイン翌日以降を選択してください。';
    }

    checkout.setCustomValidity(message);
    if (bookingError) bookingError.textContent = showMessage ? message : '';
    return !message;
  }

  function calcNights() {
    const start = parseDateInput(checkin?.value);
    const end = parseDateInput(checkout?.value);
    if (!start || !end || end <= start) return 0;
    return (end - start) / (1000 * 60 * 60 * 24);
  }

  function updatePrice() {
    syncGuestOptions();
    validateStay(false);

    const nights = calcNights();
    const room = getSelectedRoom();
    const hasBreakfast = Boolean(breakfast?.checked);
    const numGuests = parseInt(guests?.value, 10) || room.minGuests;

    let total = room.price * nights;
    if (hasBreakfast) total += breakfastPrice * numGuests * nights;

    if (nights > 0) {
      priceAmount.textContent = '¥' + total.toLocaleString() + '〜';
      let breakdown = `${room.label} / ${nights}泊 × ¥${room.price.toLocaleString()}`;
      if (hasBreakfast) breakdown += ` + 朝食 ¥${(breakfastPrice * numGuests * nights).toLocaleString()}`;
      priceBreakdown.textContent = breakdown;
    } else {
      priceAmount.textContent = '¥—';
      priceBreakdown.textContent = '日程と客室を選択してください';
    }
  }

  checkin?.addEventListener('change', () => {
    syncDateConstraints();
    updatePrice();
  });
  checkout?.addEventListener('change', updatePrice);
  roomType?.addEventListener('change', updatePrice);
  guests?.addEventListener('change', updatePrice);
  breakfast?.addEventListener('change', updatePrice);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    syncDateConstraints();
    const stayValid = validateStay(true);

    if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
      return;
    }
    if (!stayValid) {
      checkout?.focus();
      return;
    }

    if (successMsg) {
      successMsg.classList.add('is-show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (submitButton) submitButton.disabled = true;
  });

  syncDateConstraints();
  syncGuestOptions();
  initCalendar();
  updatePrice();
}

/* ---- Calendar UI ---- */
function initCalendar() {
  const grid = document.getElementById('calendar-grid');
  const monthLabel = document.getElementById('calendar-month');
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  if (!grid || !monthLabel) return;

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let currentDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  let selectedStart = parseDateInput(checkin?.value);
  let selectedEnd = parseDateInput(checkout?.value);

  function getAvailability(dateObj) {
    if (dateObj < todayDate) return { status: 'past', label: '選択できません', disabled: true };
    const seed = dateObj.getFullYear() + dateObj.getMonth() + dateObj.getDate();
    if (seed % 9 === 0) return { status: 'unavailable', label: '満室', disabled: true };
    if (seed % 5 === 0) return { status: 'limited', label: '残りわずか', disabled: false };
    return { status: 'available', label: '空室あり', disabled: false };
  }

  function syncFromInputs() {
    selectedStart = parseDateInput(checkin?.value);
    selectedEnd = parseDateInput(checkout?.value);
    render();
  }

  function render() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthLabel.textContent = `${year}.${String(month + 1).padStart(2, '0')}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstVisibleMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);

    if (prevBtn) {
      prevBtn.disabled = currentDate <= firstVisibleMonth;
      prevBtn.setAttribute('aria-disabled', String(prevBtn.disabled));
    }

    grid.innerHTML = '';

    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    dayNames.forEach(dayName => {
      const el = document.createElement('div');
      el.className = 'calendar__day-name';
      el.textContent = dayName;
      grid.appendChild(el);
    });

    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'calendar__day is-empty';
      el.setAttribute('aria-hidden', 'true');
      grid.appendChild(el);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const iso = formatDateInput(dateObj);
      const availability = getAvailability(dateObj);
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'calendar__day';
      el.textContent = day;
      el.setAttribute('aria-label', `${year}年${month + 1}月${day}日 ${availability.label}`);

      if (availability.status === 'limited') {
        el.classList.add('is-limited');
      }
      if (availability.disabled) {
        el.classList.add('is-disabled');
        el.disabled = true;
        el.title = availability.label;
      }

      const isStart = selectedStart && iso === formatDateInput(selectedStart);
      const isEnd = selectedEnd && iso === formatDateInput(selectedEnd);
      if (isStart || isEnd) {
        el.classList.add('is-selected');
        el.setAttribute('aria-pressed', 'true');
      } else {
        el.setAttribute('aria-pressed', 'false');
      }

      if (selectedStart && selectedEnd && dateObj > selectedStart && dateObj < selectedEnd) {
        el.classList.add('is-range');
      }

      if (!availability.disabled) {
        el.addEventListener('click', () => selectDate(dateObj));
      }

      grid.appendChild(el);
    }
  }

  function selectDate(date) {
    if (!selectedStart || selectedEnd) {
      selectedStart = date;
      selectedEnd = null;
      if (checkin) checkin.value = formatDateInput(date);
      if (checkout) checkout.value = '';
    } else if (date <= selectedStart) {
      selectedStart = date;
      selectedEnd = null;
      if (checkin) checkin.value = formatDateInput(date);
      if (checkout) checkout.value = '';
    } else {
      selectedEnd = date;
      if (checkout) checkout.value = formatDateInput(date);
    }

    render();
    dispatchFieldChange(checkin);
    dispatchFieldChange(checkout);
  }

  checkin?.addEventListener('change', syncFromInputs);
  checkout?.addEventListener('change', syncFromInputs);

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
