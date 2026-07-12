export type BlogStatus = "draft" | "pending" | "published" | "rejected";

export interface BlogCategory {
  category_id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  post_id: number;
  user_id: number;
  category_id: number | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: BlogStatus;
  reject_reason?: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    user_id: number;
    name: string;
    email: string;
  };
  category?: BlogCategory;
}
