import { NextRequest, NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import {
  db,
  member,
  student,
  staff,
  users,
  auditLog,
  allocation,
  gatePass,
  visitLog,
  maintenanceRequest,
  feePayment,
  hostelBlock,
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
  const memberId = Number(id);

  try {
    const result = await db
      .select()
      .from(member)
      .where(eq(member.memberId, memberId));

    if (result.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
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
  const memberId = Number(id);

  try {
    const body = await request.json();
    const result = await db
      .update(member)
      .set(body)
      .where(eq(member.memberId, memberId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    logAction({
      tableName: "member",
      action: "UPDATE",
      recordId: memberId,
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
  const memberId = Number(id);

  try {
    const existing = await db
      .select()
      .from(member)
      .where(eq(member.memberId, memberId));

    if (existing.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const memberRecord = existing[0];

    db.transaction((tx) => {
      // 1. get user IDs so we can cascade audit_log
      const memberUsers = tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.memberId, memberId))
        .all();
      const userIds = memberUsers.map((u) => u.id);
      if (userIds.length > 0) {
        tx.delete(auditLog).where(inArray(auditLog.performedBy, userIds)).run();
      }

      if (memberRecord.userType === "Student") {
        // cascade through all student-dependent tables
        tx.delete(feePayment).where(eq(feePayment.studentId, memberId)).run();
        tx.delete(visitLog).where(eq(visitLog.studentId, memberId)).run();
        tx.delete(allocation).where(eq(allocation.studentId, memberId)).run();
        tx.delete(gatePass).where(eq(gatePass.studentId, memberId)).run();
      } else {
        // staff/admin: null out nullable FK references rather than deleting the dependent rows
        tx.update(hostelBlock).set({ wardenId: null }).where(eq(hostelBlock.wardenId, memberId)).run();
        tx.update(gatePass).set({ approverId: null }).where(eq(gatePass.approverId, memberId)).run();
        tx.update(maintenanceRequest).set({ resolvedBy: null }).where(eq(maintenanceRequest.resolvedBy, memberId)).run();
      }

      // reported_by is NOT NULL so delete any maintenance requests filed by this member
      tx.delete(maintenanceRequest).where(eq(maintenanceRequest.reportedBy, memberId)).run();

      tx.delete(student).where(eq(student.studentId, memberId)).run();
      tx.delete(staff).where(eq(staff.staffId, memberId)).run();
      tx.delete(users).where(eq(users.memberId, memberId)).run();
      tx.delete(member).where(eq(member.memberId, memberId)).run();
    });

    logAction({
      tableName: "member",
      action: "DELETE",
      recordId: memberId,
      performedBy: session.userId,
    });

    return NextResponse.json({ message: "Member deleted" });
  } catch (error) {
    console.error("DELETE /api/members/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
