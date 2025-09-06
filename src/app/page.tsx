// app/page.tsx
import SessionClient from "@/components/SessionClient";
import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";
import SearchBar from "@/components/SearchBar";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";

export default async function HomePage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });

  return (
    <Layout>
      <div className="w-full max-w-6xl px-4 mx-auto space-y-10">
        <EntryForm />
        <SearchBar tags={tags} />
        <EntryList />
      </div>
    </Layout>
  );
}

