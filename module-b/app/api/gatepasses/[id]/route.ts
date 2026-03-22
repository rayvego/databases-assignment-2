import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, gatePass } from "@/lib/db";
import { requireAuth, requireAdmin, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  const { id } = await params;
  const passId = Number(id);

  try {
    const result = await db
      .select()
      .from(gatePass)
      .where(eq(gatePass.passId, passId));

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Gate pass not found" },
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
  const passId = Number(id);

  try {
    const body = await request.json();
    const result = await db
      .update(gatePass)
      .set(body)
      .where(eq(gatePass.passId, passId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Gate pass not found" },
        { status: 404 },
      );
    }

    logAction({
      tableName: "gate_pass",
      action: "UPDATE",
      recordId: passId,
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
  const passId = Number(id);

  try {
    const result = await db
      .delete(gatePass)
      .where(eq(gatePass.passId, passId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Gate pass not found" },
        { status: 404 },
      );
    }

    logAction({
      tableName: "gate_pass",
      action: "DELETE",
      recordId: passId,
      performedBy: session.userId,
    });

    return NextResponse.json({ message: "Gate pass deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
