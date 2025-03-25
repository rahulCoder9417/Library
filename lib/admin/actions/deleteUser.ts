"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function deleteUser(id: string) {
  try {
    await db.delete(borrowRecords).where(eq(borrowRecords.userId, id));

    await db.delete(users).where(eq(users.id, id));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}
export async function deleteBook(id: string) {
  try {
    await db.delete(borrowRecords).where(eq(borrowRecords.bookId, id));

    await db.delete(books).where(eq(books.id, id));

  } catch (error) {
    console.error("Error deleting book:", error);
    throw new Error("Failed to delete book");
  }
}

export async function changeUserStatus(id: string, newStatus: "PENDING" | "APPROVED" ) {
  try {
    await db.update(users).set({ status: newStatus }).where(eq(users.id, id));
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Failed to update user status");
  }
}
export async function allUser(USERS_PER_PAGE:number,offset:number) {
  try {
    return await db.select().from(users).limit(USERS_PER_PAGE).offset(offset);
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Failed to update user status");
  }
}