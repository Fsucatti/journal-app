import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

//const userId = "68b83a16be739d1d2d30322d"; // Replace with actual user ID for testing

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || undefined;
  const tag = searchParams.get("tag") || undefined;

  const entries = await prisma.entry.findMany({
    where: {
      authorId: session.user.id,
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { content: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        tag
          ? {
              entryTags: {
                some: {
                  tag: { name: tag },
                },
              },
            }
          : {},
      ],
    },
    include: {
      author: true,
      entryTags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  // ❌ Temporarily skip session check
   const session = await getServerSession(authOptions);
   if (!session?.user?.id) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

  const { title, content, tags } = await req.json();

  // Create entry first
  const entry = await prisma.entry.create({
    data: {
      title,
      content,
      authorId: session.user.id, // Use session.user.id in production
    },
  });

  // If tags provided, connect or create them
  if (tags && Array.isArray(tags)) {
    for (const name of tags) {
      const tag = await prisma.tag.upsert({
        where: { name },
        create: { name },
        update: {},
      });

      await prisma.entryTag.create({
        data: {
          entryId: entry.id,
          tagId: tag.id,
        },
      });
    }
  }

  // Return full entry with tags included
  const fullEntry = await prisma.entry.findUnique({
    where: { id: entry.id },
    include: {
      author: true,
      entryTags: { include: { tag: true } },
    },
  });

  return NextResponse.json(fullEntry);
}
