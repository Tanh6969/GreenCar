import React, { useState, useEffect, useCallback } from "react";
import { roles } from "../../../data/mockData";
import { User } from "../../../types/user.type";
import { userService } from "../../../services/user.service";

const ROLE_MAP: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Admin",    color: "#7c3aed", bg: "#ede9fe" },
  2: { label: "Khách hàng", color: "#166534", bg: "#dcfce7" },
  3: { label: "Chủ xe", color: "#b45309", bg: "#fef3c7" },
};

const LICENSE_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  unverified: { label: "Chưa xác thực", color: "#6E7A72", bg: "#f3f4f6" },
  pending: { label: "Chờ duyệt", color: "#b45309", bg: "#fef3c7" },
  verified: { label: "Đã xác thực", color: "#166534", bg: "#dcfce7" },
  rejected: { label: "Bị từ chối", color: "#dc2626", bg: "#fef2f2" },
};

const UserManagePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | "all">("all");
  const [selected, setSelected] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    userService.getAll()
      .then(setUsers)
      .catch(err => setError(err.message || "Lỗi tải danh sách người dùng"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const visible = users.filter(u => {
    const matchSearch = search === "" || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role_id === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = users.reduce<Record<number, number>>((acc, u) => {
    acc[u.role_id] = (acc[u.role_id] ?? 0) + 1;
    return acc;
  }, {});

  const handleVerify = async (userId: number, status: "verified" | "rejected") => {
    if (status === "rejected" && !rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }
    setError("");
    setActionLoading(userId);
    try {
      const updated = await userService.adminVerifyLicense(userId, status, status === "rejected" ? rejectReason : undefined);
      setSelected(updated);
      setRejectReason("");
      setShowRejectInput(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Lỗi cập nhật trạng thái");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Quản lý người dùng</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>Xem và quản lý tài khoản hệ thống</p>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="cards-3" style={{ marginBottom: 24 }}>
        {[
          { label: "Tổng người dùng", count: users.length, color: "var(--green)", bg: "var(--green-light)" },
          { label: "Khách hàng",      count: roleCounts[2] ?? 0, color: "#166534", bg: "#dcfce7" },
          { label: "Chủ xe",         count: roleCounts[3] ?? 0, color: "#b45309", bg: "#fef3c7" },
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
              <th>Trạng thái GPLX</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th style={{ textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>Không tìm thấy người dùng.</td></tr>
            ) : visible.map(u => {
              const role = ROLE_MAP[u.role_id];
              const licStatus = LICENSE_STATUS_MAP[u.license_status || "unverified"];
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
                  <td>
                    <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 700, color: licStatus.color, background: licStatus.bg }}>
                      {licStatus.label}
                    </span>
                  </td>
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
                      onClick={() => {
                        setSelected(u);
                        setShowRejectInput(false);
                        setRejectReason("");
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12 }}>
        Hiển thị {visible.length} / {users.length} người dùng
      </p>

      {/* Detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setSelected(null)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "min(480px,90vw)", maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-lg)" }}
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
              ["ID người dùng", selected.user_id],
              ["Điện thoại", selected.phone || "—"],
              ["Số GPLX", selected.license_no || "—"],
              ["Vai trò", ROLE_MAP[selected.role_id]?.label ?? selected.role_id],
              ["Ngày đăng ký", new Date(selected.created_at).toLocaleString("vi-VN")],
              ["Trạng thái GPLX", LICENSE_STATUS_MAP[selected.license_status || "unverified"].label],
            ].map(([label, value]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{String(value)}</span>
              </div>
            ))}

            {selected.license_front_url && (
              <div style={{ marginTop: 16, padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Ảnh Bằng lái xe (GPLX):</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Mặt trước:</div>
                    <img src={selected.license_front_url} alt="Mặt trước" style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Mặt sau:</div>
                    <img src={selected.license_back_url} alt="Mặt sau" style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                  </div>
                </div>
              </div>
            )}

            {selected.license_reject_reason && selected.license_status === "rejected" && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 13, color: "#dc2626" }}>
                <strong>Lý do từ chối:</strong> {selected.license_reject_reason}
              </div>
            )}

            {/* Verification actions for Admin */}
            {selected.license_status === "pending" && (
              <div style={{ marginTop: 20 }}>
                {!showRejectInput ? (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => handleVerify(selected.user_id, "verified")}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      disabled={actionLoading === selected.user_id}
                    >
                      Phê duyệt GPLX
                    </button>
                    <button
                      onClick={() => setShowRejectInput(true)}
                      className="btn"
                      style={{ flex: 1, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                      disabled={actionLoading === selected.user_id}
                    >
                      Từ chối
                    </button>
                  </div>
                ) : (
                  <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Nhập lý do từ chối:</div>
                    <textarea
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Ví dụ: Ảnh mờ không rõ số, sai thông tin bằng lái..."
                      rows={2}
                      style={{ width: "100%", padding: 8, fontSize: 13, borderRadius: 6, border: "1px solid var(--border)", boxSizing: "border-box", marginBottom: 10 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleVerify(selected.user_id, "rejected")}
                        className="btn btn-sm"
                        style={{ background: "#dc2626", color: "#fff" }}
                      >
                        Xác nhận từ chối
                      </button>
                      <button
                        onClick={() => { setShowRejectInput(false); setRejectReason(""); }}
                        className="btn btn-ghost btn-sm"
                      >
                        Huỷ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setSelected(null)} className="btn btn-ghost" style={{ marginTop: 20, width: "100%" }}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagePage;
