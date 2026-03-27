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

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Themen der Beratung</h2>
          <ul className="space-y-3 text-gray-700">
            <li>• Was Bitcoin ist und warum es sich von Krypto-Projekten unterscheidet</li>
            <li>• Bitcoin sicher kaufen</li>
            <li>• Wallets verstehen und richtig auswählen</li>
            <li>• Selbstverwahrung und Backup-Konzept</li>
            <li>• Typische Anfängerfehler vermeiden</li>
            <li>• Langfristiger, ruhiger Einstieg statt Spekulation</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">So läuft es ab</h2>
          <div className="space-y-4 text-gray-700">
            <div className="border rounded-xl p-4 bg-white">
              <p className="font-semibold mb-1">1. Erstgespräch</p>
              <p>
                Wir klären deinen aktuellen Stand, deine Fragen und dein Ziel.
              </p>
            </div>
            <div className="border rounded-xl p-4 bg-white">
              <p className="font-semibold mb-1">2. Klare Beratung</p>
              <p>
                Du bekommst verständliche Erklärungen und konkrete nächste
                Schritte.
              </p>
            </div>
            <div className="border rounded-xl p-4 bg-white">
              <p className="font-semibold mb-1">3. Sichere Umsetzung</p>
              <p>
                Gemeinsam strukturieren wir deinen Einstieg sauber und ohne
                unnötigen Stress.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Bereit für deinen sicheren Einstieg?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Wenn du Bitcoin wirklich verstehen und nicht einfach blind irgendetwas
          kaufen willst, ist eine klare, ruhige Beratung der beste erste
          Schritt.
        </p>
      </div>
    </div>
  );
}