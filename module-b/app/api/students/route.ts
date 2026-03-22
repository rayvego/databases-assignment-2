import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, student, member } from "@/lib/db";
import { requireAuth, requireAdmin, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  try {
    const students = await db
      .select()
      .from(student)
      .innerJoin(member, eq(student.studentId, member.memberId));

    return NextResponse.json(students);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (isNextResponse(session)) return session;

  try {
    const body = await request.json();
    const {
      // member fields
      name,
      email,
      contactNumber,
      age,
      gender,
      address,
      profileImage,
      // student-specific fields
      enrollmentNo,
      course,
      batchYear,
      guardianName,
      guardianContact,
    } = body;

    // Insert member first, then student (FK dependency)
    const memberResult = await db
      .insert(member)
      .values({
        name,
        email,
        contactNumber,
        age,
        gender,
        address,
        profileImage,
        userType: "Student",
      })
      .returning();

    const newMember = memberResult[0];

    logAction({
      tableName: "member",
      action: "INSERT",
      recordId: newMember.memberId,
      performedBy: session.userId,
      details: { name, email },
    });

    const studentResult = await db
      .insert(student)
      .values({
        studentId: newMember.memberId,
        enrollmentNo,
        course,
        batchYear,
        guardianName,
        guardianContact,
      })
      .returning();

    const newStudent = studentResult[0];

    logAction({
      tableName: "student",
      action: "INSERT",
      recordId: newStudent.studentId,
      performedBy: session.userId,
      details: { enrollmentNo, course },
    });

    return NextResponse.json(
      { member: newMember, student: newStudent },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
