import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Downloads all of the signed-in user's entries as one Markdown file, oldest first. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.entry.findMany({
    where: { authorId: session.user.id },
    include: { entryTags: { include: { tag: true } } },
    orderBy: { createdAt: "asc" },
  });

  const body = entries
    .map((entry) => {
      const tags = entry.entryTags.map(({ tag }) => `#${tag.name}`).join(" ");
      const date = entry.createdAt.toISOString().slice(0, 10);
      const header = [`# ${entry.title}`, `Date: ${date}`];
      if (tags) header.push(`Tags: ${tags}`);
      return `${header.join("\n")}\n\n${entry.content}`;
    })
    .join("\n\n---\n\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="journal.md"',
      "Cache-Control": "no-store",
    },
  });
}
