// app/api/emailjs-email/route.ts
import { NextResponse } from "next/server";
import emailjs from "@emailjs/nodejs";

// Initialize EmailJS with your User ID (Public Key)
emailjs.init({
  publicKey: process.env.EMAILJS_USER_ID || "your-emailjs-user-id",
});

export async function POST(request: Request) {
  try {
    const { to_email, subject, message,template } = await request.json();

    // Send email using EmailJS with HTML content
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID || "your-service-id", // Service ID
      template, // Template ID
      {
        to_email,    // Recipient email
        subject,     // Dynamic subject
        message,   // Raw HTML content
      }
    );

    console.log(`Email sent to ${to_email} via EmailJS`, response);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("EmailJS email sending failed:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}