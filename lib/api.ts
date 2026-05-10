import { Article, ArticleFormValues, ArticleStatus, ListResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message ?? "An unexpected error occurred");
  }

  return json.data as T;
}

// ── Article API ───────────────────────────────────────────────────────────────

export async function listArticles(limit = 100, offset = 0): Promise<ListResponse> {
  return request<ListResponse>(`/article/${limit}/${offset}`);
}

export async function getArticle(id: number): Promise<Article> {
  return request<Article>(`/article/${id}`);
}

export async function createArticle(
  values: ArticleFormValues,
  status: ArticleStatus
): Promise<Article> {
  return request<Article>("/article/", {
    method: "POST",
    body: JSON.stringify({ ...values, status }),
  });
}

export async function updateArticle(
  id: number,
  values: Partial<ArticleFormValues> & { status?: ArticleStatus }
): Promise<Article> {
  return request<Article>(`/article/${id}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}

export async function deleteArticle(id: number): Promise<void> {
  await request<unknown>(`/article/${id}`, { method: "DELETE" });
}

export async function trashArticle(id: number): Promise<Article> {
  return updateArticle(id, { status: "Trash" });
}

export async function listPublished(limit: number, offset: number): Promise<ListResponse> {
  return request<ListResponse>(`/publishedArticle/${limit}/${offset}`);
}

export async function listTrashed(limit: number, offset: number): Promise<ListResponse> {
  return request<ListResponse>(`/trashedArticle/${limit}/${offset}`);
}

export async function listDrafted(limit: number, offset: number): Promise<ListResponse> {
  return request<ListResponse>(`/draftedArticle/${limit}/${offset}`);
}
