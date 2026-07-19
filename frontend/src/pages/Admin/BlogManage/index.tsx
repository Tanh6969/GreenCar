import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { blogService } from "../../../services/blog.service";
import { BlogPost, BlogCategory, BlogStatus } from "../../../types/blog.type";
import { User } from "../../../types/user.type";
import { Pagination } from "../../../components/common/Pagination";

type PostRow = BlogPost;

const STATUS_LABEL: Record<BlogStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: "Nháp",       color: "#6E7A72", bg: "#f3f4f6" },
  pending:   { label: "Chờ duyệt",  color: "#b45309", bg: "#fef3c7" },
  published: { label: "Đã đăng",    color: "#166534", bg: "#dcfce7" },
  rejected:  { label: "Từ chối",    color: "#dc2626", bg: "#fef2f2" },
};

const FILTERS: { key: BlogStatus | "all"; label: string }[] = [
  { key: "all",       label: "Tất cả" },
  { key: "pending",   label: "Chờ duyệt" },
  { key: "published", label: "Đã đăng" },
  { key: "draft",     label: "Nháp" },
  { key: "rejected",  label: "Từ chối" },
];

const BlogManagePage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BlogStatus | "all">("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");
  const [page,     setPage]     = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,    setTotal]    = useState(0);

  const refresh = useCallback((p: number) => {
    setLoading(true);
    blogService.adminGetAll(p, 10)
      .then(res => {
        setPosts(res.data);
        setTotalPages(res.pagination.total_pages);
        setTotal(res.pagination.total);
      })
      .catch(() => setError("Không tải được danh sách bài viết."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh(page);
  }, [refresh, page]);

  const counts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const visible = filter === "all" ? posts : posts.filter(p => p.status === filter);

  const approve = async (postId: number) => {
    setError("");
    setActionLoading(postId);
    try { await blogService.adminSetStatus(postId, "published"); refresh(page); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Lỗi."); }
    finally { setActionLoading(null); }
  };

  const reject = async () => {
    if (!rejectTarget) return;
    setError("");
    setActionLoading(rejectTarget);
    try {
      await blogService.adminSetStatus(rejectTarget, "rejected", rejectReason || undefined);
      setRejectTarget(null);
      setRejectReason("");
      refresh(page);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Lỗi."); }
    finally { setActionLoading(null); }
  };

  const del = async (postId: number) => {
    if (!window.confirm("Xoá bài viết này?")) return;
    setActionLoading(postId);
    try { await blogService.adminDeletePost(postId); refresh(page); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Lỗi."); }
    finally { setActionLoading(null); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Quản lý Blog</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>Duyệt và quản lý bài viết</p>
        </div>
        <button
          onClick={() => navigate("/admin/blogs/new")}
          style={{ padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700, background: "var(--green)", color: "#fff", border: "none", cursor: "pointer" }}
        >
          + Viết bài mới
        </button>
      </div>

      {/* Stats */}
      <div className="cards-3" style={{ marginBottom: 24 }}>
        {[
          { label: "Chờ duyệt", count: counts.pending ?? 0, color: "#b45309", bg: "#fef3c7" },
          { label: "Đã đăng",   count: counts.published ?? 0, color: "#166534", bg: "#dcfce7" },
          { label: "Tổng bài",  count: total, color: "var(--green)", bg: "var(--green-light)" },
        ].map(s => (
          <div key={s.label} className="panel" style={{ textAlign: "center", background: s.bg, border: `1px solid ${s.color}22` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget !== null && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 500,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: "min(440px,90vw)", boxShadow: "var(--shadow-lg)" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 12px" }}>Từ chối bài viết</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>Nhập lý do từ chối (sẽ được gửi đến tác giả):</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Ví dụ: Nội dung chưa đủ chi tiết, thiếu hình ảnh..."
              style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={reject} className="btn btn-sm" style={{ background: "#dc2626", color: "#fff" }}>Xác nhận từ chối</button>
              <button onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="btn btn-ghost btn-sm">Huỷ</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="brand-filter" style={{ marginBottom: 20 }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={filter === f.key ? "active" : ""}
          >
            {f.label}
            {f.key !== "all" && counts[f.key] != null && (
              <span style={{ marginLeft: 6, background: "rgba(0,0,0,0.1)", borderRadius: 9999, padding: "1px 7px", fontSize: 11 }}>
                {counts[f.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th style={{ textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>Không có bài viết nào.</td></tr>
            ) : visible.map(post => {
              const st = STATUS_LABEL[post.status];
              const busy = actionLoading === post.post_id;
              return (
                <tr key={post.post_id} style={{ opacity: busy ? 0.5 : 1 }}>
                  <td style={{ maxWidth: 280 }}>
                    <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{post.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{post.excerpt?.slice(0, 60)}...</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{post.author?.name ?? "—"}</td>
                  <td style={{ fontSize: 13 }}>{post.category?.name ?? "—"}</td>
                  <td>
                    <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 700, color: st.color, background: st.bg }}>
                      {st.label}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {new Date(post.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      {post.status === "published" && (
                        <Link to={`/blog/${post.slug}`} className="btn btn-ghost btn-sm" target="_blank">Xem</Link>
                      )}
                      {post.status === "pending" && (
                        <>
                          <button onClick={() => approve(post.post_id)} className="btn btn-primary btn-sm" disabled={busy}>Duyệt</button>
                          <button onClick={() => setRejectTarget(post.post_id)} className="btn btn-sm" style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }} disabled={busy}>Từ chối</button>
                        </>
                      )}
                      <button onClick={() => del(post.post_id)} className="btn btn-sm" style={{ background: "#f3f4f6", color: "var(--text-muted)", border: "1px solid var(--border)" }} disabled={busy}>Xoá</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          Hiển thị {visible.length} / {posts.length} bài viết (Tổng số: {total})
        </p>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default BlogManagePage;
