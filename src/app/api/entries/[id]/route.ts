import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, tags } = await req.json();

  const existing = await prisma.entry.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  await prisma.entry.update({
    where: { id: params.id },
    data: { title, content },
  });

  await prisma.entryTag.deleteMany({ where: { entryId: params.id } });

  if (tags && Array.isArray(tags)) {
    for (const name of tags) {
      const tag = await prisma.tag.upsert({
        where: { name },
        create: { name },
        update: {},
      });

      await prisma.entryTag.create({
        data: {
          entryId: params.id,
          tagId: tag.id,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entry = await prisma.entry.findUnique({
    where: { id: params.id },
    include: { entryTags: { include: { tag: true } } },
  });

  if (!entry || entry.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  return NextResponse.json(entry);
}


export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.entry.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  await prisma.entryTag.deleteMany({ where: { entryId: params.id } });
  await prisma.entry.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}