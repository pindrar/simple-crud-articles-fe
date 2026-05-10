"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ArticleForm from "@/components/posts/ArticleForm";
import { createArticle } from "@/lib/api";
import { ArticleFormValues, ArticleStatus } from "@/lib/types";

export default function AddNewPage() {
  const router = useRouter();

  async function handleSubmit(values: ArticleFormValues, status: ArticleStatus) {
    try {
      await createArticle(values, status);
      toast.success(`Article ${status === "Publish" ? "published" : "saved as draft"}!`);
      router.push(`/dashboard/posts?tab=${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create article");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Article</h1>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <ArticleForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
