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

  document.querySelectorAll('.about-photo').forEach((el) => applyReveal(el, 0));

  document.querySelectorAll('.about-content').forEach((content) => {
    content.querySelectorAll(':scope > *').forEach((el, index) => {
      applyReveal(el, 0.15 + Math.min(index * 0.08, 0.48));
    });
  });

  document.querySelectorAll('.gallery-grid').forEach((grid) => {
    applyStaggeredReveal(grid.querySelectorAll('.gallery-item'), 0.1, 0.45);
  });

  document.querySelectorAll('.gallery-more').forEach((el) => applyReveal(el, 0.2));

  document.querySelectorAll('.contact-links').forEach((links) => {
    applyStaggeredReveal(links.querySelectorAll(':scope > *'), 0.12);
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

// Sliding nav underline indicator
const nav = document.querySelector('.nav');
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

// Google reviews — static fallback when fetch unavailable
const reviewsGrid = document.getElementById('reviews-grid');

if (reviewsGrid) {
  const googleReviewsUrl =
    'https://www.google.com/search?num=10&sa=X&sca_esv=b21e0fc4ad4b3263&nfpr=1&sxsrf=APpeQnuOPUdsFyIuFp3oA__OFmk7j2sJUw:1786476402312&q=detailingdm&si=APenkKmVGdgpMPDQZoEWS8RIAhsqXAKlNLP0B8DNkkiU9KPI0TGqg-SocO2VFG9cnqTFfhUjvbeOY_5KUA_TpgdWQ3CR92FZRHhJr3LURif7X8gTIxJCOLc%3D&ved=2ahUKEwimzO-ap5mWAxVkRPEDHSyZD2EQ_coHegQIMRAB&biw=1920&bih=945&dpr=1';

  reviewsGrid.innerHTML = `
    <div class="review-card">
      <div class="review-card-stars" aria-label="Ocena 5 na 5">★★★★★</div>
      <p class="review-card-author">5,0 · 2 opinie na Google</p>
      <p class="review-card-text">Opinie klientów są dostępne na profilu Google. Kliknij poniżej, żeby je przeczytać.</p>
    </div>
    <p class="reviews-note">
      <a href="${googleReviewsUrl}" target="_blank" rel="noopener noreferrer">Przejdź do opinii na Google →</a>
    </p>
  `;

  reviewsGrid.querySelectorAll('.review-card, .reviews-note').forEach((el, index) => {
    applyReveal(el, index * 0.1);
  });
  observeRevealElements();
}
