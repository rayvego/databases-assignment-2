import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, room, allocation, maintenanceRequest } from "@/lib/db";
import { requireAuth, requireAdmin, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  const { id } = await params;
  const roomId = Number(id);

  try {
    const result = await db.select().from(room).where(eq(room.roomId, roomId));

    if (result.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
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
  const roomId = Number(id);

  try {
    const body = await request.json();
    const result = await db
      .update(room)
      .set(body)
      .where(eq(room.roomId, roomId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    logAction({
      tableName: "room",
      action: "UPDATE",
      recordId: roomId,
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
  const roomId = Number(id);

  try {
    const existing = await db.select().from(room).where(eq(room.roomId, roomId));

    if (existing.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    db.transaction((tx) => {
      // allocation.room_id is NOT NULL — delete dependent allocations
      tx.delete(allocation).where(eq(allocation.roomId, roomId)).run();
      // maintenance_request.room_id is nullable — null it out rather than deleting the request
      tx.update(maintenanceRequest).set({ roomId: null }).where(eq(maintenanceRequest.roomId, roomId)).run();
      tx.delete(room).where(eq(room.roomId, roomId)).run();
    });

    logAction({
      tableName: "room",
      action: "DELETE",
      recordId: roomId,
      performedBy: session.userId,
    });

    return NextResponse.json({ message: "Room deleted" });
  } catch (error) {
    console.error("DELETE /api/rooms/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
