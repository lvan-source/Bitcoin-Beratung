import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: "Bitte alle Felder ausfüllen." },
        { status: 400 }
      );
    }

    const to = process.env.CONTACT_TO_EMAIL;

    if (!to) {
      return Response.json(
        { error: "CONTACT_TO_EMAIL fehlt in .env.local" },
        { status: 500 }
      );
    }

    const { error } = await resend.emails.send({
      from: "PeakSpark <onboarding@resend.dev>",
      to,
      subject: `Neue Anfrage von ${name}`,
      replyTo: email,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Beim Senden ist ein Fehler aufgetreten." },
      { status: 500 }
    );
  }
}