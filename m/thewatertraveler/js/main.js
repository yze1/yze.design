/* ═══════════════════════════════════════════════
   THE WATER TRAVELER — main.js
   Shared across all pages
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Hamburger toggle ── */
  const hamBtn  = document.getElementById('hamBtn');
  const mobMenu = document.getElementById('mobMenu');

  if (hamBtn && mobMenu) {
    hamBtn.addEventListener('click', () => {
      hamBtn.classList.toggle('open');
      mobMenu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (mobMenu.classList.contains('open') &&
          !mobMenu.contains(e.target) &&
          !hamBtn.contains(e.target)) {
        hamBtn.classList.remove('open');
        mobMenu.classList.remove('open');
      }
    });

    mobMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamBtn.classList.remove('open');
        mobMenu.classList.remove('open');
      });
    });
  }

  /* ── Mark active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href === './' + currentPage)) {
      link.classList.add('active');
    }
  });

  /* ── Contact form submit ── */
  const submitBtn = document.getElementById('contactSubmit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      submitBtn.textContent = 'Thanks for submitting! ✓';
      submitBtn.style.background = '#2a8a93';
      submitBtn.disabled = true;
    });
  }

  document.querySelectorAll('video').forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.removeAttribute('controls');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('preload', 'auto');
    video.play().catch(() => {});
    video.addEventListener('loadeddata', () => video.play().catch(() => {}), { once: true });
  });

  document.querySelectorAll('.reviews-carousel').forEach(carousel => {
    const track = carousel.querySelector('.reviews-track');
    const prev = carousel.querySelector('.reviews-prev');
    const next = carousel.querySelector('.reviews-next');
    if (!track) return;

    if (carousel.classList.contains('reviews-rotator')) {
      const cards = Array.from(track.querySelectorAll('.review-card'));
      if (cards.length === 0) return;
      let currentReview = Math.max(0, cards.findIndex(card => card.classList.contains('active')));

      function showReview(index) {
        cards[currentReview].classList.remove('active');
        currentReview = (index + cards.length) % cards.length;
        cards[currentReview].classList.add('active');
      }

      if (prev) prev.addEventListener('click', () => showReview(currentReview - 1));
      if (next) next.addEventListener('click', () => showReview(currentReview + 1));
      setInterval(() => showReview(currentReview + 1), 6500);
      return;
    }

    const getStep = () => {
      const card = track.querySelector('.review-card');
      return card ? card.getBoundingClientRect().width + 16 : track.clientWidth;
    };
    const scrollByStep = direction => {
      track.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
    };

    if (prev) prev.addEventListener('click', () => scrollByStep(-1));
    if (next) next.addEventListener('click', () => scrollByStep(1));

    setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth - 4;
      if (track.scrollLeft >= maxScroll) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByStep(1);
      }
    }, 5000);
  });

  /* ── Hero Carousel ─────────────────────────────
     Auto-advances every 3 s with a 1 s crossfade.
     Dots and arrows provide manual control.
     Pauses on hover; resumes on mouse-leave.
  ── */
  const slides = document.querySelectorAll('.carousel-slide');
  const dots   = document.querySelectorAll('.carousel-dot');
  const hero   = document.querySelector('.hero');

  if (slides.length === 0) return; // not on home page

  let current  = 0;
  let timer    = null;
  const DELAY  = 3000;  // ms between advances
  const TOTAL  = slides.length;

  function goTo(index) {
    // Wrap around
    index = (index + TOTAL) % TOTAL;

    // Swap active class on slides
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = index;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), DELAY);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.index));
      startTimer(); // reset timer so next advance is a full 3 s away
    });
  });

  // Arrow clicks
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startTimer(); });

  // Pause on hover, resume on leave
  if (hero) {
    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);

    // Touch swipe support
    let touchStartX = 0;
    hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? goTo(current + 1) : goTo(current - 1);
        startTimer();
      }
    }, { passive: true });
  }

  // Kick off
  startTimer();

});
