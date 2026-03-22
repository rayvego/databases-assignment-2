import { NextRequest, NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import {
  db,
  student,
  member,
  users,
  auditLog,
  allocation,
  gatePass,
  visitLog,
  maintenanceRequest,
  feePayment,
} from "@/lib/db";
import { requireAuth, requireAdmin, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  const { id } = await params;
  const studentId = Number(id);

  try {
    const result = await db
      .select()
      .from(student)
      .innerJoin(member, eq(student.studentId, member.memberId))
      .where(eq(student.studentId, studentId));

    if (result.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
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
  const studentId = Number(id);

  try {
    const body = await request.json();
    const result = await db
      .update(student)
      .set(body)
      .where(eq(student.studentId, studentId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    logAction({
      tableName: "student",
      action: "UPDATE",
      recordId: studentId,
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
  const studentId = Number(id);

  try {
    const existing = await db
      .select()
      .from(student)
      .where(eq(student.studentId, studentId));

    if (existing.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    db.transaction((tx) => {
      const memberUsers = tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.memberId, studentId))
        .all();
      const userIds = memberUsers.map((u) => u.id);
      if (userIds.length > 0) {
        tx.delete(auditLog).where(inArray(auditLog.performedBy, userIds)).run();
      }

      tx.delete(feePayment).where(eq(feePayment.studentId, studentId)).run();
      tx.delete(visitLog).where(eq(visitLog.studentId, studentId)).run();
      tx.delete(allocation).where(eq(allocation.studentId, studentId)).run();
      tx.delete(gatePass).where(eq(gatePass.studentId, studentId)).run();
      tx.delete(maintenanceRequest).where(eq(maintenanceRequest.reportedBy, studentId)).run();
      tx.delete(student).where(eq(student.studentId, studentId)).run();
      tx.delete(users).where(eq(users.memberId, studentId)).run();
      tx.delete(member).where(eq(member.memberId, studentId)).run();
    });

    logAction({
      tableName: "student",
      action: "DELETE",
      recordId: studentId,
      performedBy: session.userId,
    });

    return NextResponse.json({ message: "Student deleted" });
  } catch (error) {
    console.error("DELETE /api/students/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
