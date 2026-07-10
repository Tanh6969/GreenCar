const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Owner/MyVehicles/index.tsx', 'utf8');

// 1. Add filter state
content = content.replace(
  'const [activeTab, setActiveTab] = useState<"vehicles" | "registrations" | "bookings">("vehicles");',
  'const [activeTab, setActiveTab] = useState<"vehicles" | "registrations" | "bookings">("vehicles");\n  const [bookingFilter, setBookingFilter] = useState<string>("all");'
);

// 2. Render stepper changes
content = content.replace(
  'const steps = ["Xác nhận", "Đang thuê", "Hoàn thành", "Thanh toán"];',
  'const steps = ["Xác nhận", "Đang thuê", "Thanh toán", "Hoàn thành"];'
);
content = content.replace(
  /if \(status === "completed"\) currentStep = 3;\s*if \(status === "paid"\) currentStep = 4;/g,
  'if (status === "pending_payment") currentStep = 3;\n    if (status === "completed") currentStep = 4;'
);

// 3. Status text and colors
content = content.replace(
  /if \(effectiveStatus === "completed"\) \{ statusText = "Chờ thanh toán"; statusBg = "#F3F4F6"; statusColor = "#6B7280"; \}\s*if \(effectiveStatus === "paid"\) \{ statusText = "Đã thanh toán"; statusBg = "#D1FAE5"; statusColor = "#059669"; \}/g,
  'if (effectiveStatus === "pending_payment") { statusText = "Chờ thanh toán"; statusBg = "#F3F4F6"; statusColor = "#6B7280"; }\n              if (effectiveStatus === "completed") { statusText = "Đã hoàn thành"; statusBg = "#D1FAE5"; statusColor = "#059669"; }'
);

// 4. Update complete trip button text
content = content.replace(
  'Hoàn thành chuyến\n                        </button>',
  'Tính tiền & Nhận xe\n                        </button>'
);

// 5. Change "completed" blocks to "pending_payment" and "paid" blocks to "completed"
// Using split/join for precise string matching to avoid regex headaches
content = content.split('{effectiveStatus === "completed" && (').join('{effectiveStatus === "pending_payment" && (');
content = content.split('{effectiveStatus === "paid" && (').join('{effectiveStatus === "completed" && (');

// 6. Update handleUpdateStatus to "completed" instead of "paid"
content = content.split('handleUpdateStatus(b.booking_id, "paid");').join('handleUpdateStatus(b.booking_id, "completed");');

// 7. Render booking list with filters
const listRenderStart = `? ownerBookings.map((b: any) => {`;
const filteredListRender = `? ownerBookings.filter((b: any) => {
                if (bookingFilter === "all") return true;
                if (bookingFilter === "pending") return b.status === "pending" || b.status === "confirmed";
                if (bookingFilter === "active") return b.status === "active" || b.status === "running";
                if (bookingFilter === "completed") return b.status === "completed" || b.status === "pending_payment";
                if (bookingFilter === "cancelled") return b.status === "cancelled";
                return true;
              }).map((b: any) => {`;
content = content.replace(listRenderStart, filteredListRender);

// 8. Add filter buttons UI right before the list
const listStartMarker = `activeTab === "vehicles" ? vehicles.map(v => (`;
const filterUI = `
            {activeTab === "bookings" && ownerBookings.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 8 }}>
                {[{id: "all", label: "Tất cả"}, {id: "pending", label: "Chờ xác nhận"}, {id: "active", label: "Đang diễn ra"}, {id: "completed", label: "Hoàn thành"}, {id: "cancelled", label: "Đã hủy"}].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setBookingFilter(f.id)}
                    style={{
                      padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: "none", whiteSpace: "nowrap",
                      background: bookingFilter === f.id ? "#006C4C" : "#E5EBE8",
                      color: bookingFilter === f.id ? "#fff" : "#3E4943",
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                  >{f.label}</button>
                ))}
              </div>
            )}
            ` + listStartMarker;
content = content.replace(listStartMarker, filterUI);

// Compact the design: remove padding from the wrapper to make it more compact
content = content.replace(/padding: 24/g, 'padding: 16');

fs.writeFileSync('frontend/src/pages/Owner/MyVehicles/index.tsx', content);
console.log("Updated frontend file successfully.");
