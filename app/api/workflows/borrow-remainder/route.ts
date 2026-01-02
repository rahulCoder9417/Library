import { sendEmail } from "@/lib/email";
import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";

type Payload = {
  email: string;
  studentName: string;
  dueDate: string;
  borrowId: string;
};

const fetchBorrowState = async (borrowId: string) => {
  const res = await db
    .select({
      status: borrowRecords.status,
      dueDate: borrowRecords.dueDate,
    })
    .from(borrowRecords)
    .where(eq(borrowRecords.id, borrowId))
    .limit(1);

  return res[0] ?? null;
};

export const { POST } = serve(async (context) => {
  const { email, studentName, dueDate, borrowId } =
    context.requestPayload as Payload;

    const due = new Date(dueDate + "T23:59:59.999Z").getTime();
    const now = Date.now();
  

  const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
  const twoDaysBefore = due - TWO_DAYS;

  // ── wait until near due date
  if (twoDaysBefore > now) {
    await context.sleep("wait-before-due", twoDaysBefore - now);
  }

  // 🛑 cancellation / invalidation check
  const state1 = await context.run("check-before-due", async () => {
    return fetchBorrowState(borrowId);
  });

  if (
    !state1 ||
    state1.status === "RETURNED" ||
    state1.dueDate !== dueDate
  ) {
    return;
  }

  // ── send due soon email
  await context.run("send-due-soon", async () => {
    await sendEmail(email, studentName, "borrow-remainder");
  });

  // ── wait until due date
  if (due > Date.now()) {
    await context.sleep("wait-until-due", due - Date.now());
  }

  // 🛑 cancellation / invalidation check again
  const state2 = await context.run("check-after-due", async () => {
    return fetchBorrowState(borrowId);
  });

  if (
    !state2 ||
    state2.status === "RETURNED" ||
    state2.dueDate !== dueDate
  ) {
    return;
  }

  // ── overdue email
  await context.run("send-overdue", async () => {
    await sendEmail(email, studentName, "borrow-overdue");
  });
});

//this is done using 2 state because when a borrow is cancel it dont get updated that time it has to manually check here,it is done by due date