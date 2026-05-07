import React, { useCallback, useEffect, useRef, useState } from "react";
import { vehicleService } from "../../../services/vehicle.service";
import { VehicleCardData } from "../../../types/vehicle.type";

// ── icons ─────────────────────────────────────────────────────
const IcPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

// ── status badge ───────────────────────────────────────────────
const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  available:   { label: "Sẵn sàng",   color: "#006C4C", bg: "#dcfce7" },
  booked:      { label: "Đang thuê",  color: "#1d4ed8", bg: "#dbeafe" },
  maintenance: { label: "Bảo dưỡng",  color: "#b45309", bg: "#fef3c7" },
};

// ── form default ───────────────────────────────────────────────
interface VehicleForm {
  model_id: number;
  license_plate: string;
  status: string;
  battery_level: number;
  battery_health: number;
  location_id: number;
  image_url: string;
}
const EMPTY_FORM: VehicleForm = {
  model_id: 0, license_plate: "", status: "available",
  battery_level: 100, battery_health: 100, location_id: 1, image_url: "",
};

// ── field helper ───────────────────────────────────────────────
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
    {children}
  </div>
);
const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid var(--border)", borderRadius: 8,
  padding: "9px 12px", fontSize: 14, boxSizing: "border-box", outline: "none",
  background: "#fff",
};

// ── page ──────────────────────────────────────────────────────
const VehicleManagePage: React.FC = () => {
  const [cards,    setCards]    = useState<VehicleCardData[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [open,     setOpen]     = useState(false);
  const [editId,   setEditId]   = useState<number | null>(null);
  const [form,     setForm]     = useState<VehicleForm>(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [formErr,  setFormErr]  = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    vehicleService.getVehicleCards()
      .then(setCards)
      .catch(() => setError("Không tải được danh sách xe."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // extract unique models & locations for dropdowns
  const models = Array.from(
    new Map(cards.map(c => [c.model.vehicle_model_id, c.model])).values()
  ).sort((a, b) => a.vehicle_model_id - b.vehicle_model_id);

  const locations = Array.from(
    new Map(cards.map(c => [c.location.location_id, c.location])).values()
  ).sort((a, b) => a.location_id - b.location_id);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, model_id: models[0]?.vehicle_model_id ?? 1, location_id: locations[0]?.location_id ?? 1 });
    setFormErr("");
    setOpen(true);
  };

  const openEdit = (c: VehicleCardData) => {
    setEditId(c.vehicle.vehicle_id);
    setForm({
      model_id:      c.vehicle.vehicle_model_id,
      license_plate: c.vehicle.license_plate,
      status:        c.vehicle.status,
      battery_level: c.vehicle.battery_level,
      battery_health: c.vehicle.battery_health,
      location_id:   c.vehicle.location_id,
      image_url:     c.image?.image_url ?? "",
    });
    setFormErr("");
    setOpen(true);
  };

  const closeModal = () => { setOpen(false); setEditId(null); };

  const handleSave = async () => {
    if (!form.license_plate.trim()) { setFormErr("Vui lòng nhập biển số xe."); return; }
    if (!form.model_id) { setFormErr("Vui lòng chọn dòng xe."); return; }
    setSaving(true);
    setFormErr("");
    try {
      if (editId !== null) {
        await vehicleService.adminUpdateVehicle(editId, form);
      } else {
        await vehicleService.adminCreateVehicle(form);
      }
      closeModal();
      refresh();
    } catch (e: unknown) {
      setFormErr(e instanceof Error ? e.message : "Lỗi lưu dữ liệu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xoá xe này? Hành động không thể hoàn tác.")) return;
    setDeleting(id);
    try {
      await vehicleService.adminDeleteVehicle(id);
      refresh();
    } catch {
      setError("Không thể xoá xe này.");
    } finally {
      setDeleting(null);
    }
  };

  const set = (k: keyof VehicleForm, v: string | number) =>
    setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div style={{ padding: 24 }}>

      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Quản lý xe</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>Thêm, sửa, xoá phương tiện trong hệ thống</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IcPlus /> Thêm xe mới
        </button>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div style={{ width: 32, height: 32, border: "3px solid #006C4C", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Dòng xe</th>
                <th>Biển số</th>
                <th>Trạng thái</th>
                <th>Pin</th>
                <th>Địa điểm</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cards.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>Chưa có xe nào.</td></tr>
              ) : cards.map(c => {
                const st = STATUS[c.vehicle.status] ?? STATUS.available;
                const busy = deleting === c.vehicle.vehicle_id;
                return (
                  <tr key={c.vehicle.vehicle_id} style={{ opacity: busy ? 0.5 : 1 }}>
                    <td style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--green)", fontSize: 13 }}>
                      #{c.vehicle.vehicle_id}
                    </td>
                    <td>
                      <p style={{ fontWeight: 700, margin: "0 0 1px", fontSize: 13 }}>{c.model.brand} {c.model.name}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{c.model.vehicle_type} · {c.model.seats} chỗ</p>
                    </td>
                    <td style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 13 }}>{c.vehicle.license_plate}</td>
                    <td>
                      <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 700, color: st.color, background: st.bg }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 48, height: 6, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${c.vehicle.battery_level}%`, background: c.vehicle.battery_level > 40 ? "#006C4C" : "#dc2626", borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.vehicle.battery_level}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>
                      <p style={{ margin: "0 0 1px", fontWeight: 600 }}>{c.location.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>{c.location.city}</p>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button onClick={() => openEdit(c)} disabled={busy} className="btn btn-sm"
                          style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--green)", borderColor: "var(--green-border)" }}>
                          <IcEdit /> Sửa
                        </button>
                        <button onClick={() => handleDelete(c.vehicle.vehicle_id)} disabled={busy} className="btn btn-sm"
                          style={{ display: "flex", alignItems: "center", gap: 4, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                          <IcTrash /> Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────────── */}
      {open && (
        <div
          ref={overlayRef}
          onClick={e => { if (e.target === overlayRef.current) closeModal(); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", margin: 0 }}>
                {editId !== null ? "Chỉnh sửa xe" : "Thêm xe mới"}
              </h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--text-muted)", lineHeight: 1 }}>×</button>
            </div>

            {formErr && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "#dc2626", marginBottom: 14 }}>
                {formErr}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Dòng xe">
                  <select value={form.model_id} onChange={e => set("model_id", Number(e.target.value))} style={inputStyle}>
                    {models.map(m => (
                      <option key={m.vehicle_model_id} value={m.vehicle_model_id}>
                        {m.brand} {m.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Biển số xe">
                  <input value={form.license_plate} onChange={e => set("license_plate", e.target.value)}
                    placeholder="51A-123.45" style={inputStyle} />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Trạng thái">
                  <select value={form.status} onChange={e => set("status", e.target.value)} style={inputStyle}>
                    <option value="available">Sẵn sàng</option>
                    <option value="booked">Đang thuê</option>
                    <option value="maintenance">Bảo dưỡng</option>
                  </select>
                </Field>
                <Field label="Địa điểm">
                  <select value={form.location_id} onChange={e => set("location_id", Number(e.target.value))} style={inputStyle}>
                    {locations.map(l => (
                      <option key={l.location_id} value={l.location_id}>
                        {l.name} — {l.city}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label={`Pin hiện tại: ${form.battery_level}%`}>
                  <input type="range" min={0} max={100} value={form.battery_level}
                    onChange={e => set("battery_level", Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#006C4C" }} />
                </Field>
                <Field label={`Sức khoẻ pin: ${form.battery_health}%`}>
                  <input type="range" min={0} max={100} value={form.battery_health}
                    onChange={e => set("battery_health", Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#006C4C" }} />
                </Field>
              </div>

              <Field label="Ảnh xe (URL)">
                <input value={form.image_url} onChange={e => set("image_url", e.target.value)}
                  placeholder="https://..." style={inputStyle} />
              </Field>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={closeModal} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "1.5px solid var(--border)", background: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "var(--text-mid)" }}>
                Huỷ
              </button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: "11px 0", borderRadius: 10, border: "none", background: saving ? "var(--green-border)" : "var(--green)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: saving ? "wait" : "pointer" }}>
                {saving ? "Đang lưu..." : editId !== null ? "Cập nhật xe" : "Thêm xe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagePage;
