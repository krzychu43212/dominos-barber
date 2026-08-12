"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { getActivePage, navLinks } from "@/lib/nav-links";

export default function Header() {
  const pathname = usePathname();
  const activePage = getActivePage(pathname);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const hoveredLinkRef = useRef<HTMLAnchorElement | null>(null);

  const positionIndicator = useCallback((link: HTMLAnchorElement | null, animate = true) => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator || !link) return;

    if (!animate) {
      indicator.style.transition = "none";
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;

    if (!animate) {
      indicator.offsetHeight;
      indicator.style.transition = "";
    }
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !indicatorRef.current) return;

    const links = nav.querySelectorAll<HTMLAnchorElement>("a[data-nav]");
    const activeLink = nav.querySelector<HTMLAnchorElement>(`a[data-nav="${activePage}"]`) || links[0];

    positionIndicator(activeLink, false);
    if (indicatorRef.current) {
      indicatorRef.current.style.width = "0";
    }

    requestAnimationFrame(() => {
      positionIndicator(activeLink, true);
    });

    const handleMouseEnter = (event: Event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      hoveredLinkRef.current = link;
      positionIndicator(link, true);
    };

    const handleMouseLeave = () => {
      hoveredLinkRef.current = null;
    };

    const handleNavLeave = () => {
      hoveredLinkRef.current = null;
      positionIndicator(activeLink, true);
    };

    const handleResize = () => {
      positionIndicator(hoveredLinkRef.current || activeLink, false);
    };

    links.forEach((link) => {
      link.addEventListener("mouseenter", handleMouseEnter);
      link.addEventListener("mouseleave", handleMouseLeave);
    });
    nav.addEventListener("mouseleave", handleNavLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
      });
      nav.removeEventListener("mouseleave", handleNavLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [activePage, positionIndicator]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <Image
            src="/images/logo.png"
            alt=""
            className="logo-img"
            width={40}
            height={52}
            priority
          />
          <span className="logo-text">Dominos Barber</span>
        </Link>
        <nav className="nav" aria-label="Główne menu" ref={navRef}>
          <span className="nav-indicator" aria-hidden="true" ref={indicatorRef} />
          {navLinks.map((link) => (
            <Link
              key={link.page}
              href={link.href}
              data-nav={link.page}
              className={activePage === link.page ? "is-active" : undefined}
              aria-current={activePage === link.page ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
