import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogService } from "../../../services/blog.service";
import { BlogPost } from "../../../types/blog.type";
import { User } from "../../../types/user.type";

type PostWithAuthor = BlogPost & { author?: User };

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getPublished().then(setPosts).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#003d2a,#006C4C)", padding: "56px 0 48px" }}>
        <div className="container">
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--green-mid)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Blog GreenCar</p>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: "#fff", margin: "0 0 12px", lineHeight: 1.15 }}>Kiến thức xe điện,<br />cập nhật mỗi ngày</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", maxWidth: 520, margin: 0 }}>
            Kinh nghiệm thực tế, đánh giá xe, tin tức EV — được viết bởi cộng đồng người dùng GreenCar.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "48px 0 64px" }}>
        {/* Featured post */}
        {featured && (
          <Link to={`/blog/${featured.slug}`} style={{ display: "block", marginBottom: 48 }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: 0,
              background: "#fff", borderRadius: 16, overflow: "hidden",
              border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
              transition: "box-shadow 0.2s, transform 0.2s"
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
            >
              <img src={featured.cover_image} alt={featured.title}
                style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "36px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{
                  display: "inline-block", padding: "4px 12px", background: "var(--green-light)",
                  border: "1px solid var(--green-border)", borderRadius: 9999, fontSize: 12,
                  fontWeight: 700, color: "var(--green)", marginBottom: 16
                }}>Nổi bật</span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 12px", lineHeight: 1.3 }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65, margin: "0 0 20px" }}>
                  {featured.excerpt}
                </p>
                <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 12, alignItems: "center" }}>
                  <span>✍️ {featured.author?.name ?? "Ẩn danh"}</span>
                  <span>·</span>
                  <span>{featured.published_at ? new Date(featured.published_at).toLocaleDateString("vi-VN") : ""}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", margin: "0 0 24px" }}>Bài viết mới nhất</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {rest.map(post => (
                <Link key={post.post_id} to={`/blog/${post.slug}`} style={{ display: "block" }}>
                  <div className="car-card" style={{ height: "100%" }}>
                    <img src={post.cover_image} alt={post.title} className="car-card-img" />
                    <div style={{ padding: "16px 20px 20px" }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: "0 0 8px", lineHeight: 1.4 }}>
                        {post.title}
                      </h4>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {post.excerpt}
                      </p>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 8 }}>
                        <span>✍️ {post.author?.name ?? "Ẩn danh"}</span>
                        <span>·</span>
                        <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("vi-VN") : ""}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📝</p>
            <p>Chưa có bài viết nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
