import nodemailer from 'nodemailer';
    import { NextResponse } from 'next/server';
import config from '@/lib/config';
    export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.env.gmail.email,
        pass: config.env.gmail.password,
      },
    });

    // Send email
    await transporter.sendMail({
      from: config.env.gmail.email,
      to: to,
      subject: subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error as string }, { status: 500 });
  }
}