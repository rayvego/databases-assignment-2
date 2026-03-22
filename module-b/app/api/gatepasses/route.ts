import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, gatePass } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  try {
    const gatePasses = await db.select().from(gatePass);
    return NextResponse.json(gatePasses);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  try {
    const body = await request.json();
    const result = await db.insert(gatePass).values(body).returning();
    const newPass = result[0];

    logAction({
      tableName: "gate_pass",
      action: "INSERT",
      recordId: newPass.passId,
      performedBy: session.userId,
      details: { studentId: newPass.studentId, reason: newPass.reason },
    });

    return NextResponse.json(newPass, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
