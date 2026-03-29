import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.08),transparent_35%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:gap-12 md:py-24 lg:gap-16 lg:px-6 lg:py-28">
          <div className="relative z-10">
            <div className="mb-5 inline-flex max-w-full rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 shadow-sm">
              Bitcoin verständlich. Sicher. Ohne Hype.
            </div>

            <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl lg:text-7xl">
              PeakSpark für deinen klaren Einstieg in Bitcoin.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-black/65 sm:text-lg sm:leading-8 md:text-xl">
              Unabhängige Beratung rund um Bitcoin, Selbstverwahrung und Sicherheit.
              Kein Trading-Lärm, keine leeren Versprechen — nur Klarheit, Struktur und
              ein sicherer Start.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/beratung"
                className="rounded-2xl bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                Beratung starten
              </Link>

              <Link
                href="/wissen"
                className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-black/[0.03]"
              >
                Wissen aufbauen
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 shadow-sm">
                <p className="text-sm font-semibold text-black">Verständlich</p>
                <p className="mt-1 text-sm text-black/55">
                  Komplexe Themen klar erklärt
                </p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 shadow-sm">
                <p className="text-sm font-semibold text-black">Sicher</p>
                <p className="mt-1 text-sm text-black/55">
                  Fokus auf Wallets und Struktur
                </p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white px-4 py-4 shadow-sm">
                <p className="text-sm font-semibold text-black">Ruhig</p>
                <p className="mt-1 text-sm text-black/55">
                  Kein Trading-Lärm, keine Show
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center md:justify-end">
            <div className="absolute h-56 w-56 rounded-full bg-orange-200/30 blur-3xl sm:h-72 sm:w-72 md:h-80 md:w-80" />
            <div className="relative rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.10)] sm:p-6 md:rounded-[2.5rem] md:p-10 lg:p-12">
              <Image
                src="/logo.png"
                alt="PeakSpark"
                width={520}
                height={520}
                priority
                className="h-auto w-[180px] object-contain sm:w-[220px] md:w-[280px] lg:w-[360px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:py-16">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
            Warum PeakSpark
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-black md:text-5xl">
            Klarheit statt Krypto-Chaos. Das ist PeakSpark.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-black/60">
            Verständlich, strukturiert und ohne unnötigen Lärm.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
            <div className="mb-4 text-sm font-semibold text-orange-500">01</div>
            <h3 className="mb-3 text-2xl font-semibold tracking-tight text-black">
              Kein Hype
            </h3>
            <p className="leading-8 text-black/60">
              Kein Fokus auf schnelle Gewinne, sondern auf sauberes Denken,
              klares Verstehen und langfristige Sicherheit.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
            <div className="mb-4 text-sm font-semibold text-orange-500">02</div>
            <h3 className="mb-3 text-2xl font-semibold tracking-tight text-black">
              Selbstverwahrung
            </h3>
            <p className="leading-8 text-black/60">
              Wallets, Seed Phrase, Backups und Eigenverantwortung werden ruhig
              und nachvollziehbar erklärt.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
            <div className="mb-4 text-sm font-semibold text-orange-500">03</div>
            <h3 className="mb-3 text-2xl font-semibold tracking-tight text-black">
              Struktur
            </h3>
            <p className="leading-8 text-black/60">
              Menschen brauchen nicht mehr Lärm, sondern bessere Ordnung,
              saubere Schritte und echte Klarheit.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="rounded-[2.5rem] bg-black px-8 py-12 text-center text-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] md:px-16 md:py-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
            Nächster Schritt
          </p>

          <h2 className="mx-auto max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">
            Bitcoin verstehen. Ruhig und klar.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            Eine gute erste Entscheidung ist nicht Aktionismus, sondern
            Orientierung. Genau dabei hilft PeakSpark.
          </p>

          <div className="mt-8">
            <Link
              href="/kontakt"
              className="inline-block rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Beratung anfragen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}