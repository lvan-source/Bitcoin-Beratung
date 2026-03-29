"use client";

import { useState } from "react";

export default function KontaktPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Danke! Deine Nachricht wurde gesendet.");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(data.error || "Fehler beim Senden.");
      }
    } catch {
      setStatus("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold mb-3">
        Kontakt
      </p>

      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Schreib mir deine Frage zu Bitcoin
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Nutze das Formular für Fragen zu Einstieg, Sicherheit, Wallets und
        Selbstverwahrung.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 outline-none bg-white"
            placeholder="Dein Name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">E-Mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 outline-none bg-white"
            placeholder="deine@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nachricht</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 min-h-[160px] outline-none bg-white"
            placeholder="Wobei brauchst du Unterstützung?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Wird gesendet..." : "Anfrage senden"}
        </button>

        {status && (
          <p className="text-sm text-gray-700 pt-2">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}