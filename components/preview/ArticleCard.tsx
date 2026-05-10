import { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const snippet =
    article.content.length > 150
      ? article.content.slice(0, 150) + "…"
      : article.content;

  const date = new Date(article.created_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <span className="mb-2 inline-block self-start rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 wrap-anywhere">
        {article.category}
      </span>
      <h2 className="mb-1 text-base font-semibold text-gray-900 line-clamp-2 wrap-anywhere">
        {article.title}
      </h2>
      <p className="mb-3 text-xs text-gray-400">{date}</p>
      <p className="flex-1 text-sm text-gray-600 wrap-anywhere">{snippet}</p>
      <button className="mt-4 self-start text-xs font-medium text-blue-600 hover:underline">
        Read more →
      </button>
    </div>
  );
}
