"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Article, ArticleStatus } from "@/lib/types";
import { deleteArticle, listDrafted, listPublished, listTrashed, trashArticle } from "@/lib/api";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const TABS: { label: string; value: ArticleStatus }[] = [
  { label: "Published", value: "Publish" },
  { label: "Drafts", value: "Draft" },
  { label: "Trashed", value: "Trash" },
];

const LIMIT = 5;

interface PostsTableProps {
  initialTab: ArticleStatus;
}

export default function PostsTable({ initialTab }: PostsTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ArticleStatus>(initialTab);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [trashTarget, setTrashTarget] = useState<Article | null>(null);

  const offset = (page - 1) * LIMIT;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const fetchTab = useCallback(async (tab: ArticleStatus, currentPage: number) => {
    setLoading(true);
    try {
      const currentOffset = (currentPage - 1) * LIMIT;
      const fetcher = tab === "Publish" ? listPublished : tab === "Draft" ? listDrafted : listTrashed;
      const res = await fetcher(LIMIT, currentOffset);
      setArticles(res.articles ?? []);
      setTotal(res.total ?? 0);
    } catch {
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTab(activeTab, page);
  }, [fetchTab, activeTab, page]);

  function switchTab(tab: ArticleStatus) {
    setActiveTab(tab);
    setPage(1);
    router.push(`/dashboard/posts?tab=${tab.toLowerCase()}`);
  }

  async function handleTrash() {
    if (!trashTarget) return;
    if (activeTab === "Trash") {
      await deleteArticle(trashTarget.id);
    } else {
      await trashArticle(trashTarget.id);
    }
    setTrashTarget(null);
    await fetchTab(activeTab, page);
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => switchTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
        {loading ? (
          <div className="space-y-2 p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">
            No{" "}
            {activeTab === "Publish"
              ? "published"
              : activeTab === "Draft"
                ? "draft"
                : "trashed"}{" "}
            articles yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                    {article.title}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{article.category}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/posts/${article.id}/edit`)}
                        title="Edit"
                        className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setTrashTarget(article)}
                        title={activeTab === "Trash" ? "Delete Permanently" : "Move to Trash"}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && total > LIMIT && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="flex items-center px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={trashTarget !== null}
        title={trashTarget?.title ?? ""}
        isPermanentDelete={activeTab === "Trash"}
        onConfirm={handleTrash}
        onCancel={() => setTrashTarget(null)}
      />
    </>
  );
}
