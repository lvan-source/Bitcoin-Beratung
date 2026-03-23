export default function BeratungPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold mb-3">
          Beratung
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Persönliche Bitcoin-Beratung für einen sicheren Einstieg
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Ich helfe dir dabei, Bitcoin einfach zu verstehen, sicher zu kaufen
          und sauber aufzubewahren. Ohne Trading-Hype, ohne unnötige
          Komplexität, mit Fokus auf Klarheit, Sicherheit und Selbstbestimmung.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="border rounded-2xl p-6 bg-white">
          <h2 className="text-xl font-semibold mb-3">Für Einsteiger</h2>
          <p className="text-gray-600">
            Du willst verstehen, was Bitcoin ist, warum es relevant ist und wie
            du sicher starten kannst.
          </p>
        </div>

        <div className="border rounded-2xl p-6 bg-white">
          <h2 className="text-xl font-semibold mb-3">Für Käufer</h2>
          <p className="text-gray-600">
            Du willst wissen, wie du Bitcoin sinnvoll kaufst, worauf du bei
            Börsen achtest und welche Fehler du vermeiden solltest.
          </p>
        </div>

        <div className="border rounded-2xl p-6 bg-white">
          <h2 className="text-xl font-semibold mb-3">Für Sicherheit</h2>
          <p className="text-gray-600">
            Du willst Wallets, Seed Phrase, Backup und Selbstverwahrung endlich
            verständlich erklärt bekommen.
          </p>
        </div>
      </div>
    </div>
  );
}