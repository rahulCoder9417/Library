// app/api/sendgrid-email/route.ts
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Set SendGrid API key (loaded from environment variables)
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { to, from, subject, html } = await request.json();

    const msg = {
      to,
      from, // Must match your verified sender email
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${to} via SendGrid`);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("SendGrid email sending failed:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}