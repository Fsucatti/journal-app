import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Tags used in the signed-in user's own entries. Visitors get an empty list. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([]);

  const tags = await prisma.tag.findMany({
    where: { entryTags: { some: { entry: { authorId: session.user.id } } } },
    orderBy: { name: "asc" },
    select: { name: true },
  });

  return NextResponse.json(tags);
}
