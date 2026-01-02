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
   

    console.log("=== WORKFLOW DEBUG ===");
    console.log("Received dueDate:", dueDate);
    
    const due = new Date(dueDate + "T00:00:00.000Z").getTime();
    const now = Date.now();
  
    // ✅ Change to ONE_DAY
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const oneDayBefore = due - ONE_DAY;
    
    console.log("due:", due);
    console.log("Current time:", now);
    console.log("oneDayBefore:", oneDayBefore);
    console.log("oneDayBefore > now:", oneDayBefore > now);
    console.log("Sleep duration (ms):", oneDayBefore - now);
    console.log("Sleep duration (days):", (oneDayBefore - now) / (1000 * 60 * 60 * 24));
  
    // ── wait until 1 day before due date
    if (oneDayBefore > now) {
      await context.sleep("wait-before-due", oneDayBefore - now);
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