import { apiClient } from "./api";
import { BlogPost, BlogCategory, BlogStatus } from "../types/blog.type";

// ── shapes returned by the backend ───────────────────────────

interface ApiPost {
  post_id: number;
  user_id: number;
  category?: { category_id: number; name: string; slug: string } | null;
  author?: { user_id: number; name: string; email: string } | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: string;
  reject_reason?: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiCategory {
  category_id: number; name: string; slug: string;
}

function toPost(p: ApiPost): BlogPost {
  return {
    post_id:      p.post_id,
    user_id:      p.user_id,
    category_id:  p.category?.category_id ?? null,
    title:        p.title,
    slug:         p.slug,
    excerpt:      p.excerpt,
    content:      p.content,
    cover_image:  p.cover_image,
    status:       p.status as BlogStatus,
    reject_reason: p.reject_reason,
    published_at: p.published_at,
    created_at:   p.created_at,
    updated_at:   p.updated_at,
    author:       p.author ? {
      user_id: p.author.user_id,
      name:    p.author.name,
      email:   p.author.email,
    } : undefined,
    category:     p.category ? {
      category_id: p.category.category_id,
      name:        p.category.name,
      slug:        p.category.slug,
    } : undefined,
  };
}

// ── service ───────────────────────────────────────────────────

export const blogService = {
  async getPublished(): Promise<BlogPost[]> {
    const data = await apiClient<ApiPost[]>("/blog/posts");
    return (data ?? []).map(toPost);
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const p = await apiClient<ApiPost>(`/blog/posts/${slug}`);
      return toPost(p);
    } catch {
      return null;
    }
  },

  async getCategories(): Promise<BlogCategory[]> {
    const data = await apiClient<ApiCategory[]>("/blog/categories");
    return (data ?? []).map(c => ({ category_id: c.category_id, name: c.name, slug: c.slug }));
  },

  async getMyPosts(_userId: number): Promise<BlogPost[]> {
    const data = await apiClient<ApiPost[]>("/my/posts");
    return (data ?? []).map(toPost);
  },

  async createPost(
    _userId: number,
    data: Omit<BlogPost, "post_id" | "user_id" | "status" | "reject_reason" | "published_at" | "created_at" | "updated_at">
  ): Promise<BlogPost> {
    const p = await apiClient<ApiPost>("/my/posts", "POST", {
      category_id: data.category_id,
      title:       data.title,
      slug:        data.slug ?? "",
      excerpt:     data.excerpt,
      content:     data.content,
      cover_image: data.cover_image,
    });
    return toPost(p);
  },

  async updatePost(
    postId: number,
    _userId: number,
    data: Partial<Pick<BlogPost, "title" | "excerpt" | "content" | "cover_image" | "category_id">>
  ): Promise<BlogPost> {
    const p = await apiClient<ApiPost>(`/my/posts/${postId}`, "PUT", data);
    return toPost(p);
  },

  async submitForReview(postId: number, _userId: number): Promise<void> {
    await apiClient<void>(`/my/posts/${postId}/submit`, "POST");
  },

  async withdrawPost(postId: number, _userId: number): Promise<void> {
    await apiClient<void>(`/my/posts/${postId}/withdraw`, "POST");
  },

  async deletePost(postId: number, _userId: number): Promise<void> {
    await apiClient<void>(`/my/posts/${postId}`, "DELETE");
  },

  // ── Admin ─────────────────────────────────────────────────────────────────

  async adminGetAll(): Promise<BlogPost[]> {
    const data = await apiClient<ApiPost[]>("/admin/posts");
    return (data ?? []).map(toPost);
  },

  async adminSetStatus(
    postId: number,
    status: Extract<BlogStatus, "published" | "rejected">,
    reason?: string
  ): Promise<void> {
    await apiClient<void>(`/admin/posts/${postId}/status`, "PUT", {
      status,
      reject_reason: reason ?? "",
    });
  },

  async adminDeletePost(postId: number): Promise<void> {
    await apiClient<void>(`/admin/posts/${postId}`, "DELETE");
  },
};
