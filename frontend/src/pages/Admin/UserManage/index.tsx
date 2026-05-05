import React, { useState } from "react";
import { users as allUsers, roles } from "../../../data/mockData";
import { User } from "../../../types/user.type";

const ROLE_MAP: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Admin",    color: "#7c3aed", bg: "#ede9fe" },
  2: { label: "Khách hàng", color: "#166534", bg: "#dcfce7" },
};

const UserManagePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | "all">("all");
  const [selected, setSelected] = useState<User | null>(null);

  const visible = allUsers.filter(u => {
    const matchSearch = search === "" || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role_id === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = allUsers.reduce<Record<number, number>>((acc, u) => {
    acc[u.role_id] = (acc[u.role_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Quản lý người dùng</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>Xem và quản lý tài khoản hệ thống</p>
      </div>

      {/* Stats */}
      <div className="cards-3" style={{ marginBottom: 24 }}>
        {[
          { label: "Tổng người dùng", count: allUsers.length, color: "var(--green)", bg: "var(--green-light)" },
          { label: "Khách hàng",      count: roleCounts[2] ?? 0, color: "#166534", bg: "#dcfce7" },
          { label: "Admin",            count: roleCounts[1] ?? 0, color: "#7c3aed", bg: "#ede9fe" },
        ].map(s => (
          <div key={s.label} className="panel" style={{ textAlign: "center", background: s.bg, border: `1px solid ${s.color}33` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc email..."
          style={{ flex: 1, minWidth: 200, height: 40, border: "1px solid var(--border)", borderRadius: 8, padding: "0 14px", fontSize: 14, outline: "none" }}
        />
        <div className="brand-filter" style={{ margin: 0 }}>
          <button onClick={() => setRoleFilter("all")} className={roleFilter === "all" ? "active" : ""}>Tất cả</button>
          {roles.map(r => (
            <button key={r.role_id} onClick={() => setRoleFilter(r.role_id)} className={roleFilter === r.role_id ? "active" : ""}>
              {ROLE_MAP[r.role_id]?.label ?? r.role_name}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>GPLX</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th style={{ textAlign: "right" }}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>Không tìm thấy người dùng.</td></tr>
            ) : visible.map(u => {
              const role = ROLE_MAP[u.role_id];
              return (
                <tr key={u.user_id}>
                  <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{u.user_id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%", background: "var(--green)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0
                      }}>
                        {u.name.split(" ").at(-1)![0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{u.email}</td>
                  <td style={{ fontSize: 13 }}>{u.phone}</td>
                  <td style={{ fontSize: 13, fontFamily: "monospace" }}>{u.license_no}</td>
                  <td>
                    {role && (
                      <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 700, color: role.color, background: role.bg }}>
                        {role.label}
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {new Date(u.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      onClick={() => setSelected(u)}
                      className="btn btn-ghost btn-sm"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12 }}>
        Hiển thị {visible.length} / {allUsers.length} người dùng
      </p>

      {/* Detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setSelected(null)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "min(420px,90vw)", boxShadow: "var(--shadow-lg)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%", background: "var(--green)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: 22
              }}>
                {selected.name.split(" ").at(-1)![0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{selected.email}</div>
              </div>
            </div>
            {[
              ["ID", selected.user_id],
              ["Điện thoại", selected.phone],
              ["Số GPLX", selected.license_no],
              ["Vai trò", ROLE_MAP[selected.role_id]?.label ?? selected.role_id],
              ["Ngày đăng ký", new Date(selected.created_at).toLocaleString("vi-VN")],
            ].map(([label, value]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{String(value)}</span>
              </div>
            ))}
            <button onClick={() => setSelected(null)} className="btn btn-ghost" style={{ marginTop: 20, width: "100%" }}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagePage;
