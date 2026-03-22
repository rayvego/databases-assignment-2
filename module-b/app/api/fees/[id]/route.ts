import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, feePayment } from "@/lib/db";
import { requireAdmin, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin(request);
  if (isNextResponse(session)) return session;

  const { id } = await params;
  const paymentId = Number(id);

  try {
    const result = await db
      .select()
      .from(feePayment)
      .where(eq(feePayment.paymentId, paymentId));

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Fee payment not found" },
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
  const paymentId = Number(id);

  try {
    const body = await request.json();
    const result = await db
      .update(feePayment)
      .set(body)
      .where(eq(feePayment.paymentId, paymentId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Fee payment not found" },
        { status: 404 },
      );
    }

    logAction({
      tableName: "fee_payment",
      action: "UPDATE",
      recordId: paymentId,
      performedBy: session.userId,
      details: body,
    });

    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
