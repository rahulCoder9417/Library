// app/api/emailjs-email/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to_email, fullName, message,template } = await request.json();

    // EmailJS REST API endpoint
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: process.env.EMAILJS_USER_ID || "your-emailjs-user-id",
        service_id: process.env.EMAILJS_SERVICE_ID || "your-service-id",
        template_id: template,
        template_params: {
          to_email,      // Recipient email
          fullName,      // Maps to {{fullName}}
          message, // Maps to {{customMessage}}
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API failed: ${response.status} - ${errorText}`);
    }

    const result = await response.text();
    console.log(`Email sent to ${to_email} via EmailJS`, result);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("EmailJS email sending failed:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}