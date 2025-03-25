import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { id, role } = await req.json();

    if (!id || !role) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await db.update(users).set({ role }).where(eq(users.id, id));

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
