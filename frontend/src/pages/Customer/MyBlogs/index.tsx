import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { blogService } from "../../../services/blog.service";
import { useAuth } from "../../../hooks/useAuth";
import { BlogPost, BlogCategory } from "../../../types/blog.type";

type PostRow = BlogPost & { category?: BlogCategory };

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: "Nháp",          color: "#6E7A72", bg: "#f3f4f6" },
  pending:   { label: "Chờ duyệt",     color: "#b45309", bg: "#fef3c7" },
  published: { label: "Đã đăng",       color: "#166534", bg: "#dcfce7" },
  rejected:  { label: "Bị từ chối",    color: "#dc2626", bg: "#fef2f2" },
};

const MyBlogsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    if (!user) return;
    blogService.getMyPosts(user.user_id).then(setPosts).finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const doAction = async (action: () => Promise<unknown>, postId: number) => {
    setError("");
    setActionLoading(postId);
    try {
      await action();
      refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="container main-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: 0 }}>Bài viết của tôi</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "4px 0 0" }}>Quản lý và theo dõi trạng thái duyệt bài</p>
        </div>
        <Link to="/customer/blogs/new" className="btn btn-primary">+ Viết bài mới</Link>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>✍️</p>
          <p style={{ marginBottom: 20 }}>Bạn chưa viết bài nào. Hãy chia sẻ kinh nghiệm xe điện của mình!</p>
          <Link to="/customer/blogs/new" className="btn btn-primary">Viết bài đầu tiên</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {posts.map(post => {
            const st = STATUS_LABEL[post.status] ?? STATUS_LABEL.draft;
            const busy = actionLoading === post.post_id;
            return (
              <div key={post.post_id} className="panel" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <img src={post.cover_image} alt={post.title}
                  style={{ width: 130, height: 88, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0, flex: 1, minWidth: 0 }}>
                      {post.title}
                    </h3>
                    <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 700, color: st.color, background: st.bg, flexShrink: 0 }}>
                      {st.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 6px" }}>{post.excerpt}</p>
                  {post.status === "rejected" && post.reject_reason && (
                    <p style={{ fontSize: 12, color: "#dc2626", background: "#fef2f2", padding: "4px 10px", borderRadius: 6, margin: "0 0 6px" }}>
                      Lý do từ chối: {post.reject_reason}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 12px" }}>
                    {post.category?.name ?? "Chưa phân loại"} · Cập nhật {new Date(post.updated_at).toLocaleDateString("vi-VN")}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(post.status === "draft" || post.status === "rejected") && (
                      <>
                        <button onClick={() => navigate(`/customer/blogs/edit/${post.post_id}`)} className="btn btn-ghost btn-sm" disabled={busy}>Chỉnh sửa</button>
                        <button onClick={() => doAction(() => blogService.submitForReview(post.post_id, user!.user_id), post.post_id)} className="btn btn-primary btn-sm" disabled={busy}>
                          {busy ? "..." : "Gửi duyệt"}
                        </button>
                      </>
                    )}
                    {post.status === "pending" && (
                      <button onClick={() => doAction(() => blogService.withdrawPost(post.post_id, user!.user_id), post.post_id)} className="btn btn-ghost btn-sm" disabled={busy}>
                        {busy ? "..." : "Rút về nháp"}
                      </button>
                    )}
                    {post.status === "published" && (
                      <Link to={`/blog/${post.slug}`} className="btn btn-ghost btn-sm">Xem bài đăng</Link>
                    )}
                    {post.status !== "published" && (
                      <button
                        onClick={() => { if (window.confirm("Xoá bài này?")) doAction(() => blogService.deletePost(post.post_id, user!.user_id), post.post_id); }}
                        className="btn btn-sm"
                        style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                        disabled={busy}
                      >
                        Xoá
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBlogsPage;
