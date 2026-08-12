"use client";

import { useEffect, useRef } from "react";
import { faqItems } from "@/lib/site-data";

const FAQ_ANIMATION_MS = 400;

function resetFaqWrapperHeight(wrapper: HTMLElement | null) {
  if (wrapper) wrapper.style.height = "";
}

function openFaqItem(item: HTMLDetailsElement, prefersReducedMotion: boolean) {
  if (item.open) return;

  const wrapper = item.querySelector<HTMLElement>(".faq-answer-wrapper");

  if (prefersReducedMotion || !wrapper) {
    item.open = true;
    resetFaqWrapperHeight(wrapper);
    return;
  }

  item.open = true;
  wrapper.style.height = "0px";
  wrapper.offsetHeight;
  wrapper.style.height = `${wrapper.scrollHeight}px`;

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (item.open) wrapper.style.height = "auto";
  };

  wrapper.addEventListener(
    "transitionend",
    (event) => {
      if (event.target === wrapper && event.propertyName === "height") finish();
    },
    { once: true },
  );

  setTimeout(finish, FAQ_ANIMATION_MS + 50);
}

function closeFaqItem(item: HTMLDetailsElement, prefersReducedMotion: boolean): Promise<void> {
  if (!item.open) return Promise.resolve();

  const wrapper = item.querySelector<HTMLElement>(".faq-answer-wrapper");

  if (prefersReducedMotion || !wrapper) {
    item.open = false;
    resetFaqWrapperHeight(wrapper);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startHeight =
      wrapper.style.height === "auto" ? wrapper.scrollHeight : wrapper.offsetHeight;
    wrapper.style.height = `${startHeight}px`;
    wrapper.offsetHeight;
    wrapper.style.height = "0px";

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      item.open = false;
      resetFaqWrapperHeight(wrapper);
      resolve();
    };

    wrapper.addEventListener(
      "transitionend",
      (event) => {
        if (event.target === wrapper && event.propertyName === "height") finish();
      },
      { once: true },
    );

    setTimeout(finish, FAQ_ANIMATION_MS + 50);
  });
}

export default function FaqAccordion() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleClick = (event: Event) => {
      event.preventDefault();
      const summary = event.currentTarget as HTMLElement;
      const item = summary.closest<HTMLDetailsElement>(".faq-item");
      if (!item) return;

      if (item.open) {
        closeFaqItem(item, prefersReducedMotion);
        return;
      }

      list.querySelectorAll<HTMLDetailsElement>(".faq-item").forEach((other) => {
        if (other !== item && other.open) closeFaqItem(other, prefersReducedMotion);
      });

      openFaqItem(item, prefersReducedMotion);
    };

    list.querySelectorAll<HTMLElement>(".faq-question").forEach((summary) => {
      summary.addEventListener("click", handleClick);
    });

    return () => {
      list.querySelectorAll<HTMLElement>(".faq-question").forEach((summary) => {
        summary.removeEventListener("click", handleClick);
      });
    };
  }, []);

  return (
    <div className="faq-list" ref={listRef}>
      {faqItems.map((item) => (
        <details key={item.question} className="faq-item">
          <summary className="faq-question">{item.question}</summary>
          <div className="faq-answer-wrapper">
            <p className="faq-answer">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
