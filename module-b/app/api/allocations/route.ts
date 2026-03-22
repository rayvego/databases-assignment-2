import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db, allocation, room } from "@/lib/db";
import { requireAuth, requireAdmin, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  try {
    const allocations = await db.select().from(allocation);
    return NextResponse.json(allocations);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (isNextResponse(session)) return session;

  try {
    const body = await request.json();
    const result = await db.insert(allocation).values(body).returning();
    const newAllocation = result[0];

    await db
      .update(room)
      .set({ currentOccupancy: sql`${room.currentOccupancy} + 1` })
      .where(eq(room.roomId, newAllocation.roomId));

    logAction({
      tableName: "allocation",
      action: "INSERT",
      recordId: newAllocation.allocationId,
      performedBy: session.userId,
      details: {
        studentId: newAllocation.studentId,
        roomId: newAllocation.roomId,
      },
    });

    return NextResponse.json(newAllocation, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
