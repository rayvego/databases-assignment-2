import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, feePayment } from "@/lib/db";
import { requireAdmin, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (isNextResponse(session)) return session;

  try {
    const payments = await db.select().from(feePayment);
    return NextResponse.json(payments);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (isNextResponse(session)) return session;

  try {
    const body = await request.json();
    const result = await db.insert(feePayment).values(body).returning();
    const newPayment = result[0];

    logAction({
      tableName: "fee_payment",
      action: "INSERT",
      recordId: newPayment.paymentId,
      performedBy: session.userId,
      details: {
        studentId: newPayment.studentId,
        amount: newPayment.amount,
        paymentType: newPayment.paymentType,
      },
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
