// =============================================
//   YESJOB 공통 JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRevealAnimations();
  initHamburger();
  setActiveNav();
  initCounters();
});

// ========== NAVBAR SCROLL ==========
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ========== HAMBURGER MENU ==========
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;
  
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
  
  // 메뉴 링크 클릭 시 닫기
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
  
  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });
}

// ========== ACTIVE NAV ==========
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ========== REVEAL ANIMATIONS ==========
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (!el.dataset.delay) {
      el.dataset.delay = (i % 4) * 100;
    }
    observer.observe(el);
  });
}

// ========== COUNTER ANIMATION ==========
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const update = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString() + suffix;
    if (current < target) requestAnimationFrame(update);
  };
  
  requestAnimationFrame(update);
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navH = 72;
      window.scrollTo({
        top: target.offsetTop - navH,
        behavior: 'smooth'
      });
    }
  });
});

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    background: type === 'success' ? '#10b981' : '#ef4444',
    color: 'white',
    padding: '14px 24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    zIndex: '10000',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    animation: 'slideInRight 0.4s ease',
    fontFamily: "'Noto Sans KR', sans-serif"
  });
  
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// 슬라이드 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
