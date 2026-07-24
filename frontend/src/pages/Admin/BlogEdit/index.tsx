import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogService } from "../../../services/blog.service";
import { useAuth } from "../../../hooks/useAuth";
import { BlogCategory } from "../../../types/blog.type";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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

  // Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const simulatedUrl = URL.createObjectURL(file);
            setCoverImage(simulatedUrl);
            setUploading(false);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const removeCoverImage = () => {
    setCoverImage("");
  };

  const save = async (publish: boolean) => {
    setError("");
    if (!title.trim()) { setError("Vui lòng nhập tiêu đề bài viết."); return; }
    if (!content.trim()) { setError("Vui lòng nhập nội dung chi tiết."); return; }
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
          slug: toSlug(title),
        });
        postId = created.post_id;
      }
      if (publish) {
        await blogService.adminSetStatus(postId, "published");
      }
      navigate("/admin/blogs");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra khi lưu bài viết.");
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #bbf7d0", borderTopColor: "#006C4C", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", padding: "24px 0", background: "#f8fafc" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", boxSizing: "border-box" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1e293b", margin: "0 0 6px" }}>
              {isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              {isEdit ? "Cập nhật và hoàn thiện nội dung bài viết của bạn" : "Tạo và xuất bản bài viết chất lượng cao cho blog GreenCar"}
            </p>
          </div>
          <button 
            onClick={() => navigate("/admin/blogs")}
            style={{ 
              display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#64748b",
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 14px", 
              cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
            onMouseOver={e => { e.currentTarget.style.color = "#006C4C"; e.currentTarget.style.borderColor = "#006C4C33"; }}
            onMouseOut={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            ← Quay lại
          </button>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#dc2626", marginBottom: 24 }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Title Card */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
              Tiêu đề bài viết <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết sinh động, thu hút người đọc..."
              style={{ 
                width: "100%", fontSize: 20, fontWeight: 800, border: "1.5px solid #cbd5e1", borderRadius: 10, 
                padding: "12px 16px", boxSizing: "border-box", outline: "none", color: "#0f172a", transition: "border-color 0.2s" 
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#006C4C"}
              onBlur={e => e.currentTarget.style.borderColor = "#cbd5e1"}
            />
          </div>

          {/* Category & Cover Image Card */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, flexWrap: "wrap" }}>
            
            {/* Category selection */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                Chuyên mục
              </label>
              <select
                value={categoryId ?? ""}
                onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                style={{ 
                  width: "100%", border: "1.5px solid #cbd5e1", borderRadius: 10, padding: "12px 14px", 
                  fontSize: 14, fontWeight: 600, color: "#334155", background: "#fff", boxSizing: "border-box", outline: "none"
                }}
              >
                <option value="">-- Chọn chuyên mục cho bài viết --</option>
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Cover Image Upload (No URLs required) */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                Ảnh bìa bài viết
              </label>

              {uploading ? (
                <div style={{ border: "2px dashed #cbd5e1", borderRadius: 12, padding: "20px 10px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ width: "100%", height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden", position: "relative" }}>
                    <div style={{ height: "100%", width: `${uploadProgress}%`, background: "linear-gradient(90deg, #006C4C, #4FBD91)", borderRadius: 3, transition: "width 0.2s" }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#006C4C" }}>Đang tải ảnh lên... {uploadProgress}%</span>
                </div>
              ) : coverImage ? (
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", height: 86, border: "1px solid #e2e8f0", display: "flex", alignItems: "center" }}>
                  <img src={coverImage} alt="Ảnh bìa" style={{ width: 120, height: "100%", objectFit: "cover" }} />
                  <div style={{ padding: "0 16px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Ảnh bìa đã chọn</span>
                    <button 
                      type="button" 
                      onClick={removeCoverImage}
                      style={{ background: "none", border: "none", color: "#ef4444", fontSize: 12, fontWeight: 700, padding: 0, textAlign: "left", cursor: "pointer" }}
                    >
                      Xóa & Thay ảnh khác
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", border: "2px dashed #cbd5e1", borderRadius: 10, height: 86, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", cursor: "pointer", overflow: "hidden" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>📸</span>
                    <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Chọn file ảnh từ máy</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>Chấp nhận JPG, PNG, GIF</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Excerpt Card */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
              Tóm tắt / Mô tả ngắn
            </label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Viết một đoạn tóm tắt ngắn (khoảng 2-3 câu) để hiển thị trong trang danh sách tin tức..."
              style={{ 
                width: "100%", border: "1.5px solid #cbd5e1", borderRadius: 10, padding: "12px 14px", 
                fontSize: 14, lineHeight: 1.5, resize: "vertical", boxSizing: "border-box", outline: "none", color: "#334155" 
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#006C4C"}
              onBlur={e => e.currentTarget.style.borderColor = "#cbd5e1"}
            />
          </div>

          {/* Content Card */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
              Nội dung chi tiết <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={16}
              placeholder="Soạn thảo nội dung chi tiết của bài viết tại đây. Bạn có thể sử dụng các thẻ HTML cơ bản để định dạng..."
              style={{ 
                width: "100%", border: "1.5px solid #cbd5e1", borderRadius: 10, padding: "16px", 
                fontSize: 15, lineHeight: 1.8, resize: "vertical", boxSizing: "border-box", outline: "none", 
                color: "#1e293b", fontFamily: "inherit" 
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#006C4C"}
              onBlur={e => e.currentTarget.style.borderColor = "#cbd5e1"}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 14, paddingBottom: 60, justifyContent: "flex-end" }}>
            <button
              onClick={() => save(false)}
              disabled={loading}
              style={{ 
                padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, 
                border: "1.5px solid #cbd5e1", background: "#fff", color: "#475569", 
                cursor: loading ? "wait" : "pointer", transition: "all 0.2s" 
              }}
              onMouseOver={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseOut={e => e.currentTarget.style.background = "#fff"}
            >
              {loading ? "Đang xử lý..." : "Lưu bản nháp"}
            </button>
            <button
              onClick={() => save(true)}
              disabled={loading}
              style={{ 
                padding: "12px 32px", borderRadius: 10, fontSize: 14, fontWeight: 700, 
                background: loading ? "#a7f3d0" : "#006C4C", color: "#fff", border: "none", 
                cursor: loading ? "wait" : "pointer", boxShadow: "0 4px 12px rgba(0,108,76,0.25)", transition: "all 0.2s" 
              }}
              onMouseOver={e => { if(!loading) e.currentTarget.style.background = "#00543b"; }}
              onMouseOut={e => { if(!loading) e.currentTarget.style.background = "#006C4C"; }}
            >
              {loading ? "Đang gửi..." : "Đăng bài ngay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditPage;
