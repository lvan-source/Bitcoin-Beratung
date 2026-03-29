"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (href: string) =>
    pathname === href
      ? "px-3 py-2 text-base font-semibold text-black"
      : "px-3 py-2 text-base font-medium text-black/65 transition hover:text-black";

  const mobileLinkClass = (href: string) =>
    pathname === href
      ? "block rounded-xl bg-black/[0.04] px-4 py-3 text-base font-semibold text-black"
      : "block rounded-xl px-4 py-3 text-base font-medium text-black/70 transition hover:bg-black/[0.03] hover:text-black";

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-8 md:py-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/Flag.png"
            alt="PeakSpark Logo"
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 object-contain"
          />
          <span className="truncate text-xl font-semibold tracking-tight text-black sm:text-2xl">
            PeakSpark
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/beratung" className={linkClass("/beratung")}>
            Beratung
          </Link>
          <Link href="/wissen" className={linkClass("/wissen")}>
            Wissen
          </Link>
          <Link href="/faq" className={linkClass("/faq")}>
            FAQ
          </Link>
          <Link href="/kontakt" className={linkClass("/kontakt")}>
            Kontakt
          </Link>
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
            <Link
              href="/"
              className={mobileLinkClass("/")}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/beratung"
              className={mobileLinkClass("/beratung")}
              onClick={() => setMobileOpen(false)}
            >
              Beratung
            </Link>
            <Link
              href="/wissen"
              className={mobileLinkClass("/wissen")}
              onClick={() => setMobileOpen(false)}
            >
              Wissen
            </Link>
            <Link
              href="/faq"
              className={mobileLinkClass("/faq")}
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/kontakt"
              className={mobileLinkClass("/kontakt")}
              onClick={() => setMobileOpen(false)}
            >
              Kontakt
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}