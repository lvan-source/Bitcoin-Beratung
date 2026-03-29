export default function WissenPage() {
  const topics = [
    {
      title: "Was ist Bitcoin?",
      text: "Die Grundlagen einfach erklärt: Ursprung, Nutzen und warum Bitcoin anders ist als klassische Kryptowährungen.",
    },
    {
      title: "Selbstverwahrung",
      text: "Warum echte Kontrolle erst beginnt, wenn du deine Bitcoin selbst hältst.",
    },
    {
      title: "Wallets verstehen",
      text: "Hot Wallet, Hardware Wallet, Seed Phrase und Backup ohne Fachchinesisch.",
    },
    {
      title: "Häufige Anfängerfehler",
      text: "Die wichtigsten Fehler beim Kauf, bei der Verwahrung und beim Sicherheitskonzept.",
    },
    {
      title: "Bitcoin vs. Krypto",
      text: "Warum Bitcoin einen anderen Fokus hat als der restliche Krypto-Markt.",
    },
    {
      title: "Langfristig denken",
      text: "Weniger Aktionismus, mehr Verständnis, Sicherheit und Geduld.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="max-w-3xl mb-14">
        <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold mb-3">
          Wissen
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Bitcoin verständlich erklärt
        </h1>
        <p className="text-lg text-gray-600">
          Hier findest du die wichtigsten Grundlagen rund um Bitcoin, Sicherheit
          und Selbstverwahrung. Klar formuliert und ohne unnötigen Hype.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <div key={topic.title} className="border rounded-2xl p-6 bg-white">
            <h2 className="text-xl font-semibold mb-3">{topic.title}</h2>
            <p className="text-gray-600">{topic.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}