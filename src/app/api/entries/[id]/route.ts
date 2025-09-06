import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { entryTags: { include: { tag: true } } },
  });

  if (!entry || entry.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, tags } = await req.json();
  const existing = await prisma.entry.findUnique({ where: { id } });

  if (!existing || existing.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  await prisma.entry.update({ where: { id }, data: { title, content } });
  await prisma.entryTag.deleteMany({ where: { entryId: id } });

  if (tags && Array.isArray(tags)) {
    for (const name of tags) {
      const tag = await prisma.tag.upsert({
        where: { name },
        create: { name },
        update: {},
      });
      await prisma.entryTag.create({
        data: { entryId: id, tagId: tag.id },
      });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.entry.findUnique({ where: { id } });

  if (!existing || existing.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  await prisma.entryTag.deleteMany({ where: { entryId: id } });
  await prisma.entry.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
