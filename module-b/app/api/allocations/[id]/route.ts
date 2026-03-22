import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db, allocation, room } from "@/lib/db";
import { requireAuth, requireAdmin, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  const { id } = await params;
  const allocationId = Number(id);

  try {
    const result = await db
      .select()
      .from(allocation)
      .where(eq(allocation.allocationId, allocationId));

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Allocation not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin(request);
  if (isNextResponse(session)) return session;

  const { id } = await params;
  const allocationId = Number(id);

  try {
    const body = await request.json();

    const existing = await db
      .select()
      .from(allocation)
      .where(eq(allocation.allocationId, allocationId));

    if (existing.length === 0) {
      return NextResponse.json({ error: "Allocation not found" }, { status: 404 });
    }

    const result = await db
      .update(allocation)
      .set(body)
      .where(eq(allocation.allocationId, allocationId))
      .returning();

    // decrement occupancy when an active allocation is closed
    const wasActive = existing[0].status === "Active";
    const isNowClosed = body.status === "Completed" || body.status === "Cancelled";
    if (wasActive && isNowClosed) {
      await db
        .update(room)
        .set({ currentOccupancy: sql`max(0, ${room.currentOccupancy} - 1)` })
        .where(eq(room.roomId, existing[0].roomId));
    }

    logAction({
      tableName: "allocation",
      action: "UPDATE",
      recordId: allocationId,
      performedBy: session.userId,
      details: body,
    });

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin(request);
  if (isNextResponse(session)) return session;

  const { id } = await params;
  const allocationId = Number(id);

  try {
    const existing = await db
      .select()
      .from(allocation)
      .where(eq(allocation.allocationId, allocationId));

    if (existing.length === 0) {
      return NextResponse.json({ error: "Allocation not found" }, { status: 404 });
    }

    await db.delete(allocation).where(eq(allocation.allocationId, allocationId));

    // decrement occupancy if the deleted allocation was still active
    if (existing[0].status === "Active") {
      await db
        .update(room)
        .set({ currentOccupancy: sql`max(0, ${room.currentOccupancy} - 1)` })
        .where(eq(room.roomId, existing[0].roomId));
    }

    logAction({
      tableName: "allocation",
      action: "DELETE",
      recordId: allocationId,
      performedBy: session.userId,
    });

    return NextResponse.json({ message: "Allocation deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
