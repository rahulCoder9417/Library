"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import dayjs from "dayjs";
import { cancelBorrowWorkflow, triggerBorrowWorkflow } from "../workflow";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }
    const dueDate = dayjs().add(4, "day").format("YYYY-MM-DD");
    
    const isBorrowed = await db
      .select()
      .from(borrowRecords)
      .where(and(
        eq(borrowRecords.bookId, bookId),
        eq(borrowRecords.userId, userId)
      ))
      .limit(1);

    let record;

    if (isBorrowed && isBorrowed.length > 0) {
      record = await db.update(borrowRecords).set({
        dueDate,
        status: "BORROWED",
        returnDate: null,
      }).where(eq(borrowRecords.id, isBorrowed[0].id)).returning({id: borrowRecords.id});
    }
    else{
       record = await db.insert(borrowRecords).values({
        userId,
        bookId,
        dueDate,
        status: "BORROWED",
      }).returning({id: borrowRecords.id});
    }
    const res = await db.select({email: users.email, fullName: users.fullName}).from(users).where(eq(users.id, userId)).limit(1);
    const workflowRunId = await triggerBorrowWorkflow({
      email : res[0].email,
      studentName: res[0].fullName,
      dueDate,
      borrowId: record[0].id,
    });
    await db
      .update(borrowRecords)
      .set({ workflowRunId })
      .where(eq(borrowRecords.id, record[0].id));
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));
    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

export const returnBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);
    const isBorrowed = await db
      .select()
      .from(borrowRecords)
      .where(and(
        eq(borrowRecords.bookId, bookId),
        eq(borrowRecords.userId, userId)
      ))
      .limit(1);

    const returnDate = dayjs().format("YYYY-MM-DD");
    const workflowRunId = isBorrowed[0].workflowRunId;

    const record = await db.update(borrowRecords).set({
      returnDate,
      status: "RETURNED",
      workflowRunId: "",
    }).where(eq(borrowRecords.id, isBorrowed[0].id));

    // ✅ Cancel workflow after DB update
    if (workflowRunId) {
      try {
        await cancelBorrowWorkflow(workflowRunId);
      } catch (error) {
        console.log("Failed to cancel workflow:", error);
        // Continue anyway - status check will handle it
      }
    }
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies + 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while returning the book",
    };
  }
};