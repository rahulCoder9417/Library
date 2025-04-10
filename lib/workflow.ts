// lib/sendEmail.ts
import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient } from "@upstash/qstash";
import config from "@/lib/config";

// Initialize WorkflowClient (unchanged)
export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

// Initialize QStashClient
const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

// Email-sending function using Qstash to trigger an EmailJS endpoint with HTML
export const sendEmail = async ({
  email,
  subject,
  message, 
  template
}: {
  email: string;
  subject: string;
  message: string;
  template: string;
}) => {
  try {
    await qstashClient.publishJSON({
      url: `${config.env.prodApiEndpoint}/api/emailjs-email`,
      body: {
        to_email: email,
        subject,
        message: message, 
        template
      },
    });
    console.log(`Email queued for ${email} via Qstash`);
    return { success: true, message: "Email queued successfully" };
  } catch (error) {
    console.log("Cannot queue email for", email, error);
    return { success: false, message: "Failed to queue email" };
  }
};