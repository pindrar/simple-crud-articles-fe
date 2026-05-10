"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import ArticleForm from "@/components/posts/ArticleForm";
import DeleteConfirmDialog from "@/components/posts/DeleteConfirmDialog";
import { getArticle, updateArticle, trashArticle } from "@/lib/api";
import { Article, ArticleFormValues, ArticleStatus } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: PageProps) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      getArticle(Number(id))
        .then(setArticle)
        .catch(() => setNotFound(true));
    });
  }, [params]);

  async function handleSubmit(values: ArticleFormValues, status: ArticleStatus) {
    if (!article) return;
    try {
      await updateArticle(article.id, { ...values, status });
      toast.success(`Article ${status === "Publish" ? "published" : "saved as draft"}!`);
      router.push(`/dashboard/posts?tab=${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update article");
    }
  }

  async function handleTrash() {
    if (!article) return;
    await trashArticle(article.id);
    toast.success("Article moved to Trash");
    router.push("/dashboard/posts?tab=Trash");
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-300">404</p>
          <p className="mt-2 text-gray-500">Article not found</p>
          <button
            onClick={() => router.push("/dashboard/posts")}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            ← Back to All Posts
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-4 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
          </div>
          <button
            onClick={() => setTrashOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Trash
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <ArticleForm
            defaultValues={{
              title: article.title,
              content: article.content,
              category: article.category,
            }}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <DeleteConfirmDialog
        open={trashOpen}
        title={article.title}
        isPermanentDelete={false}
        onConfirm={handleTrash}
        onCancel={() => setTrashOpen(false)}
      />
    </div>
  );
}
