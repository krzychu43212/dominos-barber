export type NavPage = "home" | "galeria" | "cennik" | "opinie" | "faq" | "kontakt";

export const navLinks: { href: string; label: string; page: NavPage }[] = [
  { href: "/", label: "O mnie", page: "home" },
  { href: "/galeria", label: "Galeria", page: "galeria" },
  { href: "/cennik", label: "Cennik", page: "cennik" },
  { href: "/opinie", label: "Opinie", page: "opinie" },
  { href: "/faq", label: "FAQ", page: "faq" },
  { href: "/kontakt", label: "Kontakt", page: "kontakt" },
];

export function getActivePage(pathname: string): NavPage {
  if (pathname === "/") return "home";
  const match = navLinks.find((link) => link.href !== "/" && pathname.startsWith(link.href));
  return match?.page ?? "home";
}
