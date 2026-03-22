import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, maintenanceRequest } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/middleware";
import { logAction } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  try {
    const requests = await db.select().from(maintenanceRequest);
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth(request);
  if (isNextResponse(session)) return session;

  try {
    const body = await request.json();
    const result = await db.insert(maintenanceRequest).values(body).returning();
    const newRequest = result[0];

    logAction({
      tableName: "maintenance_request",
      action: "INSERT",
      recordId: newRequest.requestId,
      performedBy: session.userId,
      details: { title: newRequest.title, roomId: newRequest.roomId },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
