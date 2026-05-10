"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { listPublished } from "@/lib/api";
import { Article } from "@/lib/types";
import ArticleCard from "@/components/preview/ArticleCard";
import Pagination from "@/components/preview/Pagination";

const LIMIT = 6;

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const offset = (page - 1) * LIMIT;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listPublished(LIMIT, offset);
      setArticles(res.articles ?? []);
      setTotal(res.total ?? 0);
    } catch {
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  function goToPage(p: number) {
    router.push(`/preview?page=${p}`);
  }

  return (
    <>
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(LIMIT)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="py-20 text-center text-sm text-gray-400">
          No published articles yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {!loading && total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={LIMIT}
          offset={offset}
          onPrev={() => goToPage(page - 1)}
          onNext={() => goToPage(page + 1)}
        />
      )}
    </>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Blog</h1>
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(LIMIT)].map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-200" />
              ))}
            </div>
          }
        >
          <PreviewContent />
        </Suspense>
      </div>
    </div>
  );
}
