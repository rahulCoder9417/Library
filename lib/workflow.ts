import { Client } from "@upstash/qstash";
import config from "@/lib/config";

const qstash = new Client({
  token: config.env.upstash.qstashToken,
});

export async function triggerBorrowWorkflow(payload: {
  borrowId: string;
  email: string;
  studentName: string;
  dueDate: string;
}) {
  
  const res = await qstash.publishJSON({
    url: `${config.env.apiEndpoint}/api/workflows/borrow-remainder`,
    body: payload,
  });

  return res.messageId;
}

export async function cancelBorrowWorkflow(workflowRunId: string) {
  try {
    const response = await fetch(
      `https://qstash.upstash.io/v2/workflows/runs/${workflowRunId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${config.env.upstash.qstashToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to cancel workflow: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel workflow:", error);
    return { success: false };
  }
}