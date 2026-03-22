import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, maintenanceRequest } from "@/lib/db";
import { requireAuth, requireAdmin, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  const { id } = await params;
  const requestId = Number(id);

  try {
    const result = await db
      .select()
      .from(maintenanceRequest)
      .where(eq(maintenanceRequest.requestId, requestId));

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Maintenance request not found" },
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
  const requestId = Number(id);

  try {
    const body = await request.json();
    const result = await db
      .update(maintenanceRequest)
      .set(body)
      .where(eq(maintenanceRequest.requestId, requestId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Maintenance request not found" },
        { status: 404 },
      );
    }

    logAction({
      tableName: "maintenance_request",
      action: "UPDATE",
      recordId: requestId,
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
  const requestId = Number(id);

  try {
    const result = await db
      .delete(maintenanceRequest)
      .where(eq(maintenanceRequest.requestId, requestId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Maintenance request not found" },
        { status: 404 },
      );
    }

    logAction({
      tableName: "maintenance_request",
      action: "DELETE",
      recordId: requestId,
      performedBy: session.userId,
    });

    return NextResponse.json({ message: "Maintenance request deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
