"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    pathname === href
      ? "px-3 py-2 text-base font-semibold text-black"
      : "px-3 py-2 text-base font-medium text-black/65 transition hover:text-black";

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        {/* Links: Logo + Name */}
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/Flag.png"
            alt="PeakSpark Logo"
            width={15}
            height={15}
            className="h-7 w-7 object-contain"
          />
          <span className="text-2xl font-semibold tracking-tight text-black">
            PeakSpark
          </span>
        </Link>

        {/* Mitte: Navigation */}
        <nav className="hidden items-center gap-22 md:flex">
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

        {/* Rechts: Button */}
        <Link
          href="/kontakt"
          className="rounded-full bg-black px-6 py-3 text-base font-semibold text-white transition hover:bg-black/85"
        >
          Anfrage
        </Link>
      </div>
    </header>
  );
}