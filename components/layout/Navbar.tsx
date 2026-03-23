import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="PeakSpark Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-semibold tracking-tight text-black">
            PeakSpark
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-black/70 md:flex">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>
          <Link href="/beratung" className="transition hover:text-black">
            Beratung
          </Link>
          <Link href="/wissen" className="transition hover:text-black">
            Wissen
          </Link>
          <Link href="/faq" className="transition hover:text-black">
            FAQ
          </Link>
          <Link href="/kontakt" className="transition hover:text-black">
            Kontakt
          </Link>
        </div>
      </div>
    </nav>
  );
}