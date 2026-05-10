import Link from "next/link";
import { Plus, List } from "lucide-react";
import PostsTable from "@/components/posts/PostsTable";
import { ArticleStatus } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

function resolveTab(raw?: string): ArticleStatus {
  if (raw === "draft") return "Draft";
  if (raw === "Trash") return "Trash";
  return "Publish";
}

export default async function AllPostsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialTab = resolveTab(params.tab);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Posts</h1>
          <div className="justify-between flex items-center gap-2">
            <Link
              href="/preview"
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-100"
            >
              <List className="h-4 w-4" />
              Preview
            </Link>
            <Link
              href="/dashboard/posts/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add New
            </Link>
          </div>
        </div>

        <PostsTable initialTab={initialTab} />
      </div>
    </div>
  );
}
