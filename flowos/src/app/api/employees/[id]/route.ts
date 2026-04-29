import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const result = await db
      .update(employees)
      .set({
        fullName: body.fullName,
        jobTitle: body.jobTitle,
        color: body.color,
        positionX: body.positionX,
        positionY: body.positionY,
      })
      .where(and(eq(employees.id, params.id), eq(employees.organizationId, orgId)))
      .returning();
    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db
      .delete(employees)
      .where(and(eq(employees.id, params.id), eq(employees.organizationId, orgId)));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
