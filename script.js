// Scroll reveal — staggered fade-up on viewport entry
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserverOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px',
};

let revealObserver;

const markRevealVisible = (el) => {
  el.classList.add('is-visible', 'is-animating');
  el.addEventListener(
    'transitionend',
    (event) => {
      if (event.target === el && event.propertyName === 'opacity') {
        el.classList.remove('is-animating');
      }
    },
    { once: true }
  );
  revealObserver?.unobserve(el);
};

const observeRevealElements = () => {
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markRevealVisible(entry.target);
        }
      });
    }, revealObserverOptions);
  }

  document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    revealObserver.observe(el);
  });
};

const applyReveal = (el, delay = 0) => {
  if (!el || el.classList.contains('reveal')) return;
  el.classList.add('reveal');
  if (delay > 0) {
    el.style.setProperty('--reveal-delay', `${delay}s`);
  }
};

const applyStaggeredReveal = (elements, step = 0.1, maxDelay = Infinity) => {
  elements.forEach((el, index) => {
    applyReveal(el, Math.min(index * step, maxDelay));
  });
};

const initScrollReveal = () => {
  document.querySelectorAll('.section-header').forEach((header) => {
    applyStaggeredReveal(header.querySelectorAll(':scope > *'), 0.1);
  });

  document.querySelectorAll('.about-intro').forEach((intro) => {
    applyStaggeredReveal(intro.querySelectorAll(':scope > *'), 0.1);
  });

  document.querySelectorAll('.about-photo').forEach((el) => applyReveal(el, 0.15));

  document.querySelectorAll('.about-bio').forEach((bio) => {
    bio.querySelectorAll(':scope > *').forEach((el, index) => {
      applyReveal(el, 0.15 + Math.min(index * 0.08, 0.48));
    });
  });

  document.querySelectorAll('.gallery-grid').forEach((grid) => {
    applyStaggeredReveal(grid.querySelectorAll('.gallery-item'), 0.1, 0.45);
  });

  document.querySelectorAll('.gallery-more').forEach((el) => applyReveal(el, 0.2));

  document.querySelectorAll('.page-cta').forEach((el) => {
    applyStaggeredReveal(el.querySelectorAll(':scope > *'), 0.1);
  });

  document.querySelectorAll('.page-cta-links').forEach((links) => {
    applyStaggeredReveal(links.querySelectorAll(':scope > *'), 0.1);
  });

  document.querySelectorAll('.contact-links').forEach((links) => {
    applyStaggeredReveal(links.querySelectorAll(':scope > *'), 0.12);
  });

  document.querySelectorAll('.cal-embed').forEach((el) => applyReveal(el, 0.15));

  document.querySelectorAll('.booking-alt').forEach((section) => {
    applyStaggeredReveal(section.querySelectorAll(':scope > *'), 0.1);
  });

  document.querySelectorAll('.faq-list').forEach((list) => {
    applyReveal(list, 0.15);
  });

  document.querySelectorAll('.price-list').forEach((list) => {
    applyStaggeredReveal(list.querySelectorAll('.price-item'), 0.12);
  });

  document.querySelectorAll('.reviews-cta').forEach((cta) => {
    applyStaggeredReveal(cta.querySelectorAll(':scope > *'), 0.1);
  });

  document.querySelectorAll('#reviews-grid .review-card, #reviews-grid .reviews-note').forEach((el, index) => {
    applyReveal(el, index * 0.1);
  });

  document.querySelectorAll('.footer-grid').forEach((grid) => {
    applyStaggeredReveal(grid.querySelectorAll('.footer-col'), 0.1);
  });

  observeRevealElements();
};

initScrollReveal();

// Active nav state based on current page
const currentPage = document.body.dataset.page;

if (currentPage) {
  document.querySelectorAll(`[data-nav="${currentPage}"]`).forEach((link) => {
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
  });
}

// Sliding nav underline indicator (desktop only)
const nav = document.querySelector('.nav--desktop');
const indicator = nav?.querySelector('.nav-indicator');

if (nav && indicator) {
  const links = nav.querySelectorAll('a[data-nav]');
  const activeLink = nav.querySelector('a.is-active') || links[0];
  let hoveredLink = null;

  const positionIndicator = (link, animate = true) => {
    if (!link) return;

    if (!animate) {
      indicator.style.transition = 'none';
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;

    if (!animate) {
      indicator.offsetHeight;
      indicator.style.transition = '';
    }
  };

  positionIndicator(activeLink, false);
  indicator.style.width = '0';
  requestAnimationFrame(() => {
    positionIndicator(activeLink, true);
  });

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      hoveredLink = link;
      positionIndicator(link, true);
    });
    link.addEventListener('mouseleave', () => {
      hoveredLink = null;
    });
  });

  nav.addEventListener('mouseleave', () => {
    hoveredLink = null;
    positionIndicator(activeLink, true);
  });

  window.addEventListener('resize', () => {
    positionIndicator(hoveredLink || activeLink, false);
  });
}

// Mobile hamburger menu
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.getElementById('mobile-nav');

if (navToggle && mobileNav) {
  const setMenuOpen = (open) => {
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    mobileNav.classList.toggle('is-open', open);
    mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setMenuOpen(false);
  });
}

// FAQ accordion — height-based expand/collapse, only one open at a time
const FAQ_ANIMATION_MS = 400;

function resetFaqWrapperHeight(wrapper) {
  if (wrapper) wrapper.style.height = '';
}

function openFaqItem(item) {
  if (item.open) return;

  const wrapper = item.querySelector('.faq-answer-wrapper');

  if (prefersReducedMotion || !wrapper) {
    item.open = true;
    resetFaqWrapperHeight(wrapper);
    return;
  }

  item.open = true;
  wrapper.style.height = '0px';
  wrapper.offsetHeight;
  wrapper.style.height = `${wrapper.scrollHeight}px`;

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (item.open) wrapper.style.height = 'auto';
  };

  wrapper.addEventListener('transitionend', (event) => {
    if (event.target === wrapper && event.propertyName === 'height') finish();
  }, { once: true });

  setTimeout(finish, FAQ_ANIMATION_MS + 50);
}

function closeFaqItem(item) {
  if (!item.open) return Promise.resolve();

  const wrapper = item.querySelector('.faq-answer-wrapper');

  if (prefersReducedMotion || !wrapper) {
    item.open = false;
    resetFaqWrapperHeight(wrapper);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startHeight = wrapper.style.height === 'auto' ? wrapper.scrollHeight : wrapper.offsetHeight;
    wrapper.style.height = `${startHeight}px`;
    wrapper.offsetHeight;
    wrapper.style.height = '0px';

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      item.open = false;
      resetFaqWrapperHeight(wrapper);
      resolve();
    };

    wrapper.addEventListener('transitionend', (event) => {
      if (event.target === wrapper && event.propertyName === 'height') finish();
    }, { once: true });

    setTimeout(finish, FAQ_ANIMATION_MS + 50);
  });
}

document.querySelectorAll('.faq-list').forEach((list) => {
  list.querySelectorAll('.faq-item').forEach((item) => {
    const summary = item.querySelector('.faq-question');

    summary.addEventListener('click', (event) => {
      event.preventDefault();

      if (item.open) {
        closeFaqItem(item);
        return;
      }

      list.querySelectorAll('.faq-item').forEach((other) => {
        if (other !== item && other.open) closeFaqItem(other);
      });

      openFaqItem(item);
    });
  });
});

// Reviews page — placeholder until reviews are added to the site
const reviewsGrid = document.getElementById('reviews-grid');

if (reviewsGrid) {
  reviewsGrid.innerHTML = '';
}

// Cal.com consent — load embed only after user accepts (rezerwacja page)
const CAL_CONSENT_KEY = 'calConsent';
const CAL_EMBED_URL = 'https://app.cal.com/embed/embed.js';

const initCalConsent = () => {
  if (document.body.dataset.page !== 'rezerwacja') return;

  const consentBlock = document.getElementById('cal-consent');
  const rejectedBlock = document.getElementById('cal-consent-rejected');
  const calWidget = document.getElementById('cal-widget');
  const acceptBtn = document.getElementById('cal-consent-accept');
  const rejectBtn = document.getElementById('cal-consent-reject');
  const resetBtn = document.getElementById('cal-reset-consent');

  if (!consentBlock || !calWidget) return;

  let calLoaded = false;

  const showConsent = () => {
    consentBlock.classList.remove('is-hidden');
    rejectedBlock?.classList.add('is-hidden');
    calWidget.classList.add('is-hidden');
  };

  const showRejected = () => {
    consentBlock.classList.add('is-hidden');
    rejectedBlock?.classList.remove('is-hidden');
    calWidget.classList.add('is-hidden');
  };

  const showCalendar = () => {
    consentBlock.classList.add('is-hidden');
    rejectedBlock?.classList.add('is-hidden');
    calWidget.classList.remove('is-hidden');
    loadCalWidget();
  };

  const loadCalWidget = () => {
    if (calLoaded) return;
    calLoaded = true;

    (function (C, A, L) {
      const p = function (a, ar) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ['initNamespace', namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, CAL_EMBED_URL, 'init');

    Cal('init', '45min', { origin: 'https://app.cal.com' });
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;

    Cal.ns['45min']('inline', {
      elementOrSelector: '#my-cal-inline-45min',
      config: {
        layout: 'month_view',
        useSlotsViewOnSmallScreen: 'true',
        theme: 'light',
        cssVarsPerTheme: { light: { 'cal-brand': '#c41e3a' } },
      },
      calLink: 'dominik-matoga-zkeojq/45min',
    });

    Cal.ns['45min']('ui', {
      theme: 'light',
      hideEventTypeDetails: false,
      layout: 'month_view',
      cssVarsPerTheme: { light: { 'cal-brand': '#c41e3a' } },
    });
  };

  const unloadCalWidget = () => {
    calLoaded = false;
    document.querySelectorAll(`script[src="${CAL_EMBED_URL}"]`).forEach((script) => script.remove());
    const calContainer = document.getElementById('my-cal-inline-45min');
    if (calContainer) calContainer.innerHTML = '';
    if (window.Cal) delete window.Cal;
  };

  const resetConsent = () => {
    localStorage.removeItem(CAL_CONSENT_KEY);
    unloadCalWidget();
    showConsent();
  };

  acceptBtn?.addEventListener('click', () => {
    localStorage.setItem(CAL_CONSENT_KEY, 'accepted');
    showCalendar();
  });

  rejectBtn?.addEventListener('click', () => {
    localStorage.setItem(CAL_CONSENT_KEY, 'rejected');
    showRejected();
  });

  resetBtn?.addEventListener('click', resetConsent);

  const savedConsent = localStorage.getItem(CAL_CONSENT_KEY);
  if (savedConsent === 'accepted') {
    showCalendar();
  } else if (savedConsent === 'rejected') {
    showRejected();
  } else {
    showConsent();
  }
};

initCalConsent();
