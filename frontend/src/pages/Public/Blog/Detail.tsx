import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { blogService } from "../../../services/blog.service";
import { BlogPost } from "../../../types/blog.type";
import { BlogCategory } from "../../../types/blog.type";
import { User } from "../../../types/user.type";

type PostDetail = BlogPost & { author?: User; category?: BlogCategory };

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    blogService.getBySlug(slug)
      .then(p => { if (!p) setNotFound(true); else setPost(p); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  if (notFound || !post) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ fontSize: 48 }}>🔍</p>
        <h2 style={{ color: "var(--text)", marginBottom: 8 }}>Bài viết không tồn tại</h2>
        <Link to="/blog" className="btn btn-primary" style={{ marginTop: 16 }}>Quay lại Blog</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 780, padding: "40px 24px 80px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24, display: "flex", gap: 6, alignItems: "center" }}>
        <Link to="/" style={{ color: "var(--green)" }}>Trang chủ</Link>
        <span>/</span>
        <Link to="/blog" style={{ color: "var(--green)" }}>Blog</Link>
        {post.category && (
          <>
            <span>/</span>
            <span>{post.category.name}</span>
          </>
        )}
      </div>

      {/* Cover */}
      <img src={post.cover_image} alt={post.title}
        style={{ width: "100%", height: 400, objectFit: "cover", borderRadius: 14, marginBottom: 32, display: "block" }} />

      {/* Meta */}
      {post.category && (
        <span style={{
          display: "inline-block", padding: "4px 12px", background: "var(--green-light)",
          border: "1px solid var(--green-border)", borderRadius: 9999, fontSize: 12,
          fontWeight: 700, color: "var(--green)", marginBottom: 14
        }}>
          {post.category.name}
        </span>
      )}

      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", margin: "0 0 16px", lineHeight: 1.25 }}>
        {post.title}
      </h1>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%", background: "var(--green)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0
        }}>
          {(post.author?.name ?? "?").split(" ").at(-1)![0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{post.author?.name ?? "Ẩn danh"}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {post.published_at ? `Đăng ngày ${new Date(post.published_at).toLocaleDateString("vi-VN")}` : ""}
          </div>
        </div>
      </div>

      {/* Content — render newlines as paragraphs, ## as headings */}
      <div style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-mid)" }}>
        {post.content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", margin: "28px 0 10px" }}>{line.slice(3)}</h2>;
          if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontWeight: 700, color: "var(--text)", margin: "12px 0 4px" }}>{line.slice(2, -2)}</p>;
          if (line.startsWith("- ")) return <li key={i} style={{ marginLeft: 20 }}>{line.slice(2)}</li>;
          if (line.startsWith("|")) return <p key={i} style={{ fontFamily: "monospace", fontSize: 13, background: "#f8f9fb", padding: "2px 8px", borderRadius: 4 }}>{line}</p>;
          if (line === "") return <br key={i} />;
          return <p key={i} style={{ margin: "8px 0" }}>{line}</p>;
        })}
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <Link to="/blog" className="btn btn-ghost">← Quay lại Blog</Link>
      </div>
    </div>
  );
};

export default BlogDetailPage;
