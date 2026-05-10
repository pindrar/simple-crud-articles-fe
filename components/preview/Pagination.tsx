interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  offset: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  offset,
  onPrev,
  onNext,
}: PaginationProps) {
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + limit, total);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-sm text-gray-500">
        Showing {from}–{to} of {total} articles
      </p>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Prev
        </button>
        <span className="flex items-center px-3 text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
