// app/api/mailgun-email/route.ts
import { NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import FormData from "form-data";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "your-mailgun-api-key",
});

export async function POST(request: Request) {
  try {
    const { to, from, subject, html } = await request.json();

    console.log("Mailgun API Key prefix:", process.env.MAILGUN_API_KEY?.slice(0, 4) || "undefined");

    const msg = await mg.messages.create(
      process.env.MAILGUN_DOMAIN || "sandbox123.mailgun.org",
      {
        from,
        to,
        subject,
        html,
      }
    );

    console.log(`Email sent to ${to} via Mailgun`, msg);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Mailgun email sending failed:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}