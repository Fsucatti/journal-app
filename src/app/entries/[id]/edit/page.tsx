import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditEntryForm from "@/components/EditEntryForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { entryTags: { include: { tag: true } } },
  });

  if (!entry) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Entry</h1>
      <EditEntryForm entry={entry} />
    </div>
  );
}
