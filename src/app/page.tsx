import { Suspense } from "react";
import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";
import SearchBar from "@/components/SearchBar";
import Layout from "@/components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="w-full max-w-6xl px-4 mx-auto space-y-10">
        <EntryForm />

        <Suspense fallback={<div>Loading search bar...</div>}>
          <SearchBar />
        </Suspense>

        <Suspense fallback={<div>Loading entries...</div>}>
          <EntryList />
        </Suspense>
      </div>
    </Layout>
  );
}
