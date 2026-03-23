import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
              Bitcoin verständlich. Sicher. Ohne Hype.
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-black md:text-7xl">
              PeakSpark für deinen klaren Einstieg in Bitcoin.
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-8 text-black/65">
              Unabhängige Beratung rund um Bitcoin, Selbstverwahrung und
              Sicherheit. Kein Trading-Lärm, keine leeren Versprechen — nur
              Klarheit, Struktur und ein sicherer Start.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/beratung"
                className="rounded-xl bg-orange-500 px-6 py-3 text-center font-medium text-white transition hover:bg-orange-600"
              >
                Beratung starten
              </Link>

              <Link
                href="/wissen"
                className="rounded-xl border border-black/10 px-6 py-3 text-center font-medium text-black transition hover:bg-black/5"
              >
                Wissen aufbauen
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:p-12">
              <Image
                src="/logo.png"
                alt="PeakSpark Logo"
                width={420}
                height={420}
                priority
                className="h-auto w-[240px] object-contain md:w-[360px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 md:py-16">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Warum PeakSpark
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">
            Klarheit statt Krypto-Chaos
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
            <div className="mb-4 text-sm font-semibold text-orange-500">01</div>
            <h3 className="mb-3 text-xl font-semibold text-black">
              Keine Hype-Versprechen
            </h3>
            <p className="leading-7 text-black/65">
              Kein Fokus auf schnelle Gewinne, sondern auf solides Verständnis,
              saubere Entscheidungen und langfristige Sicherheit.
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
            <div className="mb-4 text-sm font-semibold text-orange-500">02</div>
            <h3 className="mb-3 text-xl font-semibold text-black">
              Selbstverwahrung verstehen
            </h3>
            <p className="leading-7 text-black/65">
              Du lernst, wie Wallets, Seed Phrase und Backups funktionieren —
              verständlich erklärt und praktisch gedacht.
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
            <div className="mb-4 text-sm font-semibold text-orange-500">03</div>
            <h3 className="mb-3 text-xl font-semibold text-black">
              Persönlich und klar
            </h3>
            <p className="leading-7 text-black/65">
              Komplexe Themen werden in einfache Schritte übersetzt, damit du
              sicher handeln kannst statt nur zu raten.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="rounded-[2rem] bg-black px-8 py-12 text-center text-white md:px-16 md:py-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Nächster Schritt
          </p>

          <h2 className="mx-auto mb-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Starte deinen Bitcoin-Einstieg mit Klarheit und Struktur
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            Wenn du Bitcoin wirklich verstehen und sicher angehen willst, ist
            jetzt der richtige Moment für einen sauberen Start.
          </p>

          <Link
            href="/kontakt"
            className="inline-block rounded-xl bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600"
          >
            Beratung anfragen
          </Link>
        </div>
      </section>
    </>
  );
}