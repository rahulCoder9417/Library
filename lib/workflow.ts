// lib/sendEmail.ts
import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient } from "@upstash/qstash";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) => {
  try {
    await qstashClient.publishJSON({
      url: `${config.env.prodApiEndpoint}/api/mailgun-email`,
      body: {
        to: email,
        from: "noreply@sandbox123.mailgun.org", // Replace with your sender
        subject,
        html,
      },
    });
    console.log(`Email queued for ${email} via Qstash`);
    return { success: true, message: "Email queued successfully" };
  } catch (error) {
    console.log("Cannot queue email for", email, error);
    return { success: false, message: "Failed to queue email" };
  }
};