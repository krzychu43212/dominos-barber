"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealObserverOptions: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: "0px 0px -40px 0px",
};

let revealObserver: IntersectionObserver | undefined;

function markRevealVisible(el: Element) {
  el.classList.add("is-visible", "is-animating");
  el.addEventListener(
    "transitionend",
    (event) => {
      if (event.target === el && (event as TransitionEvent).propertyName === "opacity") {
        el.classList.remove("is-animating");
      }
    },
    { once: true },
  );
  revealObserver?.unobserve(el);
}

function observeRevealElements(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
      el.classList.add("is-visible");
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

  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    revealObserver?.observe(el);
  });
}

function applyReveal(el: Element | null, delay = 0) {
  if (!el || el.classList.contains("reveal")) return;
  el.classList.add("reveal");
  if (delay > 0) {
    (el as HTMLElement).style.setProperty("--reveal-delay", `${delay}s`);
  }
}

function applyStaggeredReveal(elements: NodeListOf<Element> | Element[], step = 0.1, maxDelay = Infinity) {
  elements.forEach((el, index) => {
    applyReveal(el, Math.min(index * step, maxDelay));
  });
}

function initScrollReveal(prefersReducedMotion: boolean) {
  document.querySelectorAll(".section-header").forEach((header) => {
    applyStaggeredReveal(header.querySelectorAll(":scope > *"), 0.1);
  });

  document.querySelectorAll(".about-photo").forEach((el) => applyReveal(el, 0));

  document.querySelectorAll(".about-content").forEach((content) => {
    content.querySelectorAll(":scope > *").forEach((el, index) => {
      applyReveal(el, 0.15 + Math.min(index * 0.08, 0.48));
    });
  });

  document.querySelectorAll(".gallery-grid").forEach((grid) => {
    applyStaggeredReveal(grid.querySelectorAll(".gallery-item"), 0.1, 0.45);
  });

  document.querySelectorAll(".gallery-more").forEach((el) => applyReveal(el, 0.2));

  document.querySelectorAll(".contact-links").forEach((links) => {
    applyStaggeredReveal(links.querySelectorAll(":scope > *"), 0.12);
  });

  document.querySelectorAll(".faq-list").forEach((list) => {
    applyReveal(list, 0.15);
  });

  document.querySelectorAll(".price-list").forEach((list) => {
    applyStaggeredReveal(list.querySelectorAll(".price-item"), 0.12);
  });

  document.querySelectorAll(".reviews-cta").forEach((cta) => {
    applyStaggeredReveal(cta.querySelectorAll(":scope > *"), 0.1);
  });

  document
    .querySelectorAll("#reviews-grid .review-card, #reviews-grid .reviews-note")
    .forEach((el, index) => {
      applyReveal(el, index * 0.1);
    });

  document.querySelectorAll(".footer-grid").forEach((grid) => {
    applyStaggeredReveal(grid.querySelectorAll(".footer-col"), 0.1);
  });

  observeRevealElements(prefersReducedMotion);
}

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    initScrollReveal(prefersReducedMotion);
  }, [pathname]);

  return null;
}

export function refreshScrollReveal() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  observeRevealElements(prefersReducedMotion);
}
