"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavbarBrandTicker from "@/components/layout/NavbarBrandTicker";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#live-blockchain", label: "Live-Blockchain" },
  { href: "/beratung", label: "Beratung" },
  { href: "/wissen", label: "Wissen" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    const [targetPath, targetHash] = href.split("#");
    const normalizedPath = targetPath || "/";

    if (targetHash) {
      return false;
    }

    return pathname === normalizedPath;
  };

  const linkClass = (href: string) =>
    isActive(href)
      ? "px-3 py-2 text-base font-semibold text-black"
      : "px-3 py-2 text-base font-medium text-black/65 transition hover:text-black";

  const mobileLinkClass = (href: string) =>
    isActive(href)
      ? "block rounded-xl bg-black/[0.04] px-4 py-3 text-base font-semibold text-black"
      : "block rounded-xl px-4 py-3 text-base font-medium text-black/70 transition hover:bg-black/[0.03] hover:text-black";

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-8 md:py-5">
        <Link href="/" className="flex min-w-0 items-center">
          <NavbarBrandTicker />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/kontakt"
            className="rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/85 sm:px-5"
          >
            Anfrage
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition lg:hidden ${
              mobileOpen
                ? "border-orange-300 bg-orange-50 text-black"
                : "border-black/10 text-black hover:bg-black/[0.03]"
            }`}
          >
            <span className="relative block h-5 w-5">
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 rounded-full bg-black transition-all duration-300 ${
                  mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-2"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 rounded-full bg-black transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 rounded-full bg-black transition-all duration-300 ${
                  mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-2"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/5 bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={mobileLinkClass(item.href)}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
