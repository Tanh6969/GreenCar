import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogService } from "../../../services/blog.service";
import { useAuth } from "../../../hooks/useAuth";
import { BlogCategory } from "../../../types/blog.type";

const AdminBlogEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const isEdit    = Boolean(id);

  const [title,      setTitle]      = useState("");
  const [excerpt,    setExcerpt]    = useState("");
  const [content,    setContent]    = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [initLoading, setInitLoading] = useState(isEdit);
  const [error,      setError]      = useState("");

  useEffect(() => {
    blogService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    blogService.getMyPosts(user?.user_id ?? 0).then(posts => {
      const post = posts.find(p => p.post_id === Number(id));
      if (post) {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setCoverImage(post.cover_image);
        setCategoryId(post.category_id);
      }
    }).finally(() => setInitLoading(false));
  }, [id, isEdit, user]);

  const save = async (publish: boolean) => {
    setError("");
    if (!title.trim()) { setError("Vui lòng nhập tiêu đề."); return; }
    if (!content.trim()) { setError("Vui lòng nhập nội dung."); return; }
    if (!user) return;

    setLoading(true);
    try {
      let postId: number;
      if (isEdit && id) {
        await blogService.updatePost(Number(id), user.user_id, { title, excerpt, content, cover_image: coverImage, category_id: categoryId });
        postId = Number(id);
      } else {
        const created = await blogService.createPost(user.user_id, {
          title, excerpt, content,
          cover_image: coverImage,
          category_id: categoryId,
          slug: "",
        });
        postId = created.post_id;
      }
      if (publish) {
        await blogService.adminSetStatus(postId, "published");
      }
      navigate("/admin/blogs");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) return <div className="flex items-center justify-center py-24"><div className="w-8 h-8 border-2 border-[#006C4C] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div style={{ padding: 24, maxWidth: 860 }}>
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>
            {isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
            {isEdit ? "Cập nhật nội dung bài viết" : "Tạo bài viết mới cho blog GreenCar"}
          </p>
        </div>
        <button onClick={() => navigate("/admin/blogs")}
          style={{ fontSize: 13, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          ← Quay lại
        </button>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title */}
        <div className="panel" style={{ padding: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
            Tiêu đề <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài viết..."
            style={{ width: "100%", fontSize: 18, fontWeight: 700, border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", boxSizing: "border-box", outline: "none" }}
          />
        </div>

        {/* Meta row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="panel" style={{ padding: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Danh mục</label>
            <select
              value={categoryId ?? ""}
              onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 14, background: "#fff", boxSizing: "border-box" }}
            >
              <option value="">-- Không chọn --</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="panel" style={{ padding: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Ảnh bìa (URL)</label>
            <input
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://..."
              style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 14, boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="panel" style={{ padding: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Mô tả ngắn</label>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Tóm tắt ngắn gọn về bài viết..."
            style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
          />
        </div>

        {/* Content */}
        <div className="panel" style={{ padding: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
            Nội dung <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={16}
            placeholder="Viết nội dung bài viết tại đây..."
            style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", fontSize: 14, lineHeight: 1.7, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, paddingBottom: 40 }}>
          <button
            onClick={() => save(false)}
            disabled={loading}
            style={{ padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "2px solid var(--border)", background: "#fff", color: "var(--text-mid)", cursor: loading ? "wait" : "pointer" }}
          >
            {loading ? "Đang lưu..." : "Lưu nháp"}
          </button>
          <button
            onClick={() => save(true)}
            disabled={loading}
            style={{ padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, background: loading ? "var(--green-border)" : "var(--green)", color: "#fff", border: "none", cursor: loading ? "wait" : "pointer", boxShadow: "0 2px 8px rgba(0,108,76,0.25)" }}
          >
            {loading ? "Đang xử lý..." : "Đăng bài ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditPage;
