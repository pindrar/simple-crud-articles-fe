"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema, ArticleFormValues } from "@/lib/types";
import { ArticleStatus } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ArticleFormProps {
  defaultValues?: Partial<ArticleFormValues>;
  onSubmit: (values: ArticleFormValues, status: ArticleStatus) => Promise<void>;
}

export default function ArticleForm({ defaultValues, onSubmit }: ArticleFormProps) {
  const [pending, setPending] = useState<ArticleStatus | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues,
  });

  async function submit(status: ArticleStatus) {
    handleSubmit(async (values) => {
      setPending(status);
      try {
        await onSubmit(values, status);
      } finally {
        setPending(null);
      }
    })();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Article title (min. 20 characters)"
        />
        {errors.title && (
          <p className="text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("content")}
          rows={10}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-black"
          placeholder="Article content (min. 200 characters)"
        />
        {errors.content && (
          <p className="text-xs text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <input
          {...register("category")}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="e.g. Technology"
        />
        {errors.category && (
          <p className="text-xs text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => submit("Draft")}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {pending === "Draft" && <Loader2 className="h-4 w-4 animate-spin" />}
          Draft
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => submit("Publish")}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {pending === "Publish" && <Loader2 className="h-4 w-4 animate-spin" />}
          Publish
        </button>
      </div>
    </div>
  );
}
