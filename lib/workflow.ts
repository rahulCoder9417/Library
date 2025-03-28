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

// Email-sending function using Qstash to trigger a SendGrid endpoint
export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    await qstashClient.publishJSON({
      url: `${config.env.prodApiEndpoint}/api/sendgrid-email`, // Your SendGrid email endpoint
      body: {
        to: email,
        from: "user7867575@gmail.com", // Replace with your verified sender email
        subject,
        html: `<p>${message}</p>`,
      },
    });
    return { success: true, message: "Email queued successfully" };
  } catch (error) {
    console.log("Cannot queue email for", email, error);
    return { success: false, message: "Failed to queue email" };
  }
};