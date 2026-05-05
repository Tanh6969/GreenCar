import { blogCategories, blogPosts, users } from "../data/mockData";
import { BlogPost, BlogStatus } from "../types/blog.type";

const wait = async (ms = 150) => new Promise((r) => setTimeout(r, ms));

let _posts = [...blogPosts];

export const blogService = {
  async getPublished() {
    await wait();
    return _posts
      .filter((p) => p.status === "published")
      .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
      .map((p) => ({ ...p, author: users.find((u) => u.user_id === p.user_id) }));
  },

  async getBySlug(slug: string) {
    await wait();
    const p = _posts.find((p) => p.slug === slug && p.status === "published");
    if (!p) return null;
    return { ...p, author: users.find((u) => u.user_id === p.user_id), category: blogCategories.find((c) => c.category_id === p.category_id) };
  },

  async getMyPosts(userId: number) {
    await wait();
    return _posts
      .filter((p) => p.user_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((p) => ({ ...p, category: blogCategories.find((c) => c.category_id === p.category_id) }));
  },

  async createPost(userId: number, data: Omit<BlogPost, "post_id" | "user_id" | "status" | "reject_reason" | "published_at" | "created_at" | "updated_at">) {
    await wait();
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...data,
      post_id: Math.max(..._posts.map((p) => p.post_id)) + 1,
      user_id: userId,
      status: "draft",
      reject_reason: undefined,
      published_at: null,
      created_at: now,
      updated_at: now,
    };
    _posts = [newPost, ..._posts];
    return newPost;
  },

  async updatePost(postId: number, userId: number, data: Partial<Pick<BlogPost, "title" | "excerpt" | "content" | "cover_image" | "category_id">>) {
    await wait();
    const idx = _posts.findIndex((p) => p.post_id === postId && p.user_id === userId);
    if (idx === -1) throw new Error("Không tìm thấy bài viết.");
    const post = _posts[idx];
    if (post.status === "published") throw new Error("Không thể sửa bài đã published. Hãy rút về nháp trước.");
    _posts[idx] = { ...post, ...data, updated_at: new Date().toISOString() };
    return _posts[idx];
  },

  async submitForReview(postId: number, userId: number) {
    await wait();
    const idx = _posts.findIndex((p) => p.post_id === postId && p.user_id === userId);
    if (idx === -1) throw new Error("Không tìm thấy bài viết.");
    if (!_posts[idx].title || !_posts[idx].content) throw new Error("Bài viết cần có tiêu đề và nội dung.");
    _posts[idx] = { ..._posts[idx], status: "pending", updated_at: new Date().toISOString() };
    return _posts[idx];
  },

  async withdrawPost(postId: number, userId: number) {
    await wait();
    const idx = _posts.findIndex((p) => p.post_id === postId && p.user_id === userId);
    if (idx === -1) throw new Error("Không tìm thấy bài viết.");
    _posts[idx] = { ..._posts[idx], status: "draft", updated_at: new Date().toISOString() };
    return _posts[idx];
  },

  async deletePost(postId: number, userId: number) {
    await wait();
    const idx = _posts.findIndex((p) => p.post_id === postId && p.user_id === userId);
    if (idx === -1) throw new Error("Không tìm thấy bài viết.");
    if (_posts[idx].status === "published") throw new Error("Không thể xoá bài đã published.");
    _posts = _posts.filter((_, i) => i !== idx);
  },

  // ── Admin ─────────────────────────────────────────────────────────────────

  async adminGetAll() {
    await wait();
    return _posts
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((p) => ({ ...p, author: users.find((u) => u.user_id === p.user_id), category: blogCategories.find((c) => c.category_id === p.category_id) }));
  },

  async adminSetStatus(postId: number, status: Extract<BlogStatus, "published" | "rejected">, reason?: string) {
    await wait();
    const idx = _posts.findIndex((p) => p.post_id === postId);
    if (idx === -1) throw new Error("Không tìm thấy bài viết.");
    _posts[idx] = {
      ..._posts[idx],
      status,
      reject_reason: status === "rejected" ? (reason ?? "Không đạt yêu cầu nội dung.") : undefined,
      published_at: status === "published" ? new Date().toISOString() : _posts[idx].published_at,
      updated_at: new Date().toISOString(),
    };
    return _posts[idx];
  },

  async adminDeletePost(postId: number) {
    await wait();
    _posts = _posts.filter((p) => p.post_id !== postId);
  },

  async getCategories() {
    await wait();
    return [...blogCategories];
  },
};
