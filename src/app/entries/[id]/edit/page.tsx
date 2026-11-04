import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditEntryForm from "@/components/EditEntryForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin");

  // Invalid ids make Prisma throw, so they are treated as not found too.
  const entry = await prisma.entry
    .findUnique({
      where: { id },
      include: { entryTags: { include: { tag: true } } },
    })
    .catch(() => null);

  // Same response for other people's entries, so it doesn't reveal that they exist.
  if (!entry || entry.authorId !== session.user.id) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Entry</h1>
      <EditEntryForm entry={entry} />
    </div>
  );
}
