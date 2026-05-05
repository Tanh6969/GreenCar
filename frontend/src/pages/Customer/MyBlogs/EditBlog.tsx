import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogService } from "../../../services/blog.service";
import { useAuth } from "../../../hooks/useAuth";
import { BlogCategory } from "../../../types/blog.type";

const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    blogService.getCategories().then(setCategories);
    if (!isNew && user) {
      blogService.getMyPosts(user.user_id).then(posts => {
        const post = posts.find(p => p.post_id === Number(id));
        if (post) {
          setTitle(post.title);
          setExcerpt(post.excerpt);
          setContent(post.content);
          setCoverImage(post.cover_image);
          setCategoryId(post.category_id);
        }
      }).finally(() => setLoading(false));
    }
  }, [id, isNew, user]);

  const genSlug = (t: string) =>
    t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) { setError("Tiêu đề không được để trống."); return; }
    if (!content.trim()) { setError("Nội dung không được để trống."); return; }
    if (!user) return;

    setSaving(true);
    setError("");
    try {
      if (isNew) {
        await blogService.createPost(user.user_id, {
          title: title.trim(), slug: genSlug(title),
          excerpt: excerpt.trim(), content: content.trim(),
          cover_image: coverImage.trim() || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
          category_id: categoryId,
        });
      } else {
        await blogService.updatePost(Number(id), user.user_id, {
          title: title.trim(), excerpt: excerpt.trim(),
          content: content.trim(), cover_image: coverImage.trim(),
          category_id: categoryId,
        });
      }
      navigate("/customer/blogs");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi khi lưu bài.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="container main-content" style={{ maxWidth: 780 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 24 }}>
        {isNew ? "Viết bài mới" : "Chỉnh sửa bài viết"}
      </h1>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={onSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="search-field">
            <label htmlFor="title">Tiêu đề bài viết <span style={{ color: "#dc2626" }}>*</span></label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề..." disabled={saving} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="search-field">
              <label htmlFor="category">Danh mục</label>
              <select id="category" value={categoryId ?? ""} onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)} disabled={saving}
                style={{ height: 46, border: "1px solid var(--border)", borderRadius: 8, padding: "0 14px", fontSize: 14, background: "#fff", width: "100%" }}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
              </select>
            </div>
            <div className="search-field">
              <label htmlFor="cover">URL ảnh bìa</label>
              <input id="cover" type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)}
                placeholder="https://..." disabled={saving} />
            </div>
          </div>

          <div className="search-field">
            <label htmlFor="excerpt">Tóm tắt (hiển thị ở danh sách)</label>
            <input id="excerpt" type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)}
              placeholder="Mô tả ngắn về bài viết..." disabled={saving} />
          </div>
        </div>

        <div className="panel">
          <div className="search-field" style={{ marginBottom: 0 }}>
            <label htmlFor="content">
              Nội dung <span style={{ color: "#dc2626" }}>*</span>
              <span style={{ fontWeight: 400, fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>Hỗ trợ Markdown cơ bản: ## Tiêu đề, **đậm**, - danh sách</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={18}
              placeholder={"## Mở đầu\n\nViết nội dung bài ở đây...\n\n## Tiếp theo\n\nNội dung tiếp..."}
              disabled={saving}
              style={{
                width: "100%", border: "1px solid var(--border)", borderRadius: 8,
                padding: "12px 14px", fontSize: 14, fontFamily: "monospace",
                lineHeight: 1.7, resize: "vertical", outline: "none", boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        {/* Preview cover */}
        {coverImage && (
          <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
            <img src={coverImage} alt="Ảnh bìa" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Đang lưu..." : isNew ? "Tạo bài viết" : "Lưu thay đổi"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/customer/blogs")} disabled={saving}>Huỷ</button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;
