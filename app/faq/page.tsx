const faqs = [
  {
    question: "Ist Bitcoin dasselbe wie Krypto?",
    answer:
      "Nein. Bitcoin wird oft zusammen mit anderen Krypto-Projekten genannt, verfolgt aber einen deutlich anderen Ansatz und Fokus.",
  },
  {
    question: "Ist Bitcoin legal?",
    answer:
      "Das hängt vom Land ab, aber in vielen Ländern ist der Besitz und Kauf von Bitcoin grundsätzlich legal.",
  },
  {
    question: "Brauche ich sofort eine Hardware Wallet?",
    answer:
      "Nicht unbedingt sofort. Es kommt auf Betrag, Erfahrung und Sicherheitsanspruch an. Langfristig ist Selbstverwahrung aber ein wichtiges Thema.",
  },
  {
    question: "Was ist eine Seed Phrase?",
    answer:
      "Eine Seed Phrase ist die wichtigste Sicherung deiner Wallet. Wer sie besitzt, kann auf die Bitcoin zugreifen. Deshalb muss sie sehr sicher aufbewahrt werden.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="max-w-3xl mb-14">
        <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold mb-3">
          FAQ
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Häufige Fragen zu Bitcoin
        </h1>
        <p className="text-lg text-gray-600">
          Die wichtigsten Antworten für Einsteiger und Interessierte.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="border rounded-2xl p-6 bg-white">
            <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}