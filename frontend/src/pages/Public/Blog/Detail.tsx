import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { blogService } from "../../../services/blog.service";
import { BlogPost } from "../../../types/blog.type";
import { BlogCategory } from "../../../types/blog.type";
import { User } from "../../../types/user.type";
import fb1 from "../../../assets/images/Lucid Air Dream.png";
import fb2 from "../../../assets/images/Rivian R1S.png";
import fb3 from "../../../assets/images/Audi e-tron GT.png";
import fb4 from "../../../assets/images/Electric SUV.png";

const fallbacks = [fb1, fb2, fb3, fb4];

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
    <div className="container" style={{ maxWidth: 1024, padding: "40px 24px 80px" }}>
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
      <img src={post.cover_image || fallbacks[post.post_id % 4]} alt={post.title}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          const fb = fallbacks[post.post_id % 4];
          if (target.src !== fb) {
            target.src = fb;
          }
        }}
        style={{ width: "100%", height: 500, objectFit: "cover", borderRadius: 16, marginBottom: 32, display: "block", backgroundColor: "#f3f4f6" }} />

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

      <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--text)", margin: "0 0 16px", lineHeight: 1.3 }}>
        {post.title}
      </h1>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%", background: "var(--green)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0
        }}>
          G
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Admin GreenCar</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {post.published_at ? `Đăng ngày ${new Date(post.published_at).toLocaleDateString("vi-VN")}` : ""}
          </div>
        </div>
      </div>

      {/* Content — Render as HTML */}
      <style>{`
        .blog-content p { margin-bottom: 1.25em; }
        .blog-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2em; margin-bottom: 0.75em; color: #191C1E; }
        .blog-content h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.75em; color: #191C1E; }
        .blog-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.25em; }
        .blog-content strong { font-weight: 700; color: #191C1E; }
        .blog-content a { color: #006C4C; text-decoration: underline; }
      `}</style>
      <div 
        className="blog-content"
        style={{ fontSize: 17, lineHeight: 1.9, color: "#3E4943" }}
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <Link to="/blog" className="btn btn-ghost">← Quay lại Blog</Link>
      </div>
    </div>
  );
};

export default BlogDetailPage;
