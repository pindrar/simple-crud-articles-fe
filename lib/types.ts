import { z } from "zod";

// ── Domain Types ──────────────────────────────────────────────────────────────

export type ArticleStatus = "Publish" | "Draft" | "Trash";

export interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  status: ArticleStatus;
  created_date: string;
  updated_date: string;
}

export interface ListResponse {
  limit: number;
  offset: number;
  total: number;
  articles: Article[];
}

// ── Zod Validation Schema ─────────────────────────────────────────────────────

export const articleSchema = z.object({
  title: z.string().min(20, "Title must be at least 20 characters"),
  content: z.string().min(200, "Content must be at least 200 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
