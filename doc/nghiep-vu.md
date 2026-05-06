# GreenCar — Tài Liệu Nghiệp Vụ Chi Tiết

> Hệ thống đặt xe điện tự lái tại Hà Nội & TP.HCM  
> Phiên bản: 1.0 — Cập nhật: 05/2026

---
GreenCar là mô hình thuê xe trực tiếp từ công ty (không phải P2P như BonbonCar), nên bỏ hẳn bước "chủ xe nhận đơn" và "theo dõi trên app" — những bước đó chỉ hợp lý với mô hình cho thuê ngang hàng. Đặt xe xong là xác nhận ngay.
## MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Phân loại người dùng & vai trò](#2-phân-loại-người-dùng--vai-trò)
3. [Nghiệp vụ — Khách hàng](#3-nghiệp-vụ--khách-hàng-customer)
4. [Nghiệp vụ — Quản trị viên](#4-nghiệp-vụ--quản-trị-viên-admin)
5. [Nghiệp vụ — Chủ xe ký gửi](#5-nghiệp-vụ--chủ-xe-ký-gửi-vehicle-owner)
6. [Quy trình liên vai trò](#6-quy-trình-liên-vai-trò)
7. [Quy tắc tính tiền](#7-quy-tắc-tính-tiền)
8. [Trạng thái & chuyển trạng thái](#8-trạng-thái--chuyển-trạng-thái)

---

## 1. TỔNG QUAN HỆ THỐNG

**GreenCar** là nền tảng cho thuê xe điện tự lái vận hành theo mô hình B2C (doanh nghiệp cung cấp xe — khách thuê trực tiếp) kết hợp C2B2C (chủ xe cá nhân ký gửi — GreenCar vận hành — khách thuê).

### Mục tiêu

| Góc nhìn | Mục tiêu |
|----------|----------|
| Khách hàng | Thuê xe điện nhanh, minh bạch giá, không lo xăng, bảo hiểm đầy đủ |
| Admin | Vận hành đội xe hiệu quả, kiểm soát doanh thu, quản lý chất lượng |
| Chủ xe | Sinh lời từ xe nhàn rỗi mà không tự vận hành |

### Phạm vi địa lý

- **Hà Nội**: Ba Đình, Đống Đa, Cầu Giấy, Tây Hồ, Thanh Xuân, Hoàng Mai, Long Biên
- **TP.HCM**: Quận 1, Quận 3, Bình Thạnh, Tân Bình, Phú Nhuận, TP. Thủ Đức

---

## 2. PHÂN LOẠI NGƯỜI DÙNG & VAI TRÒ

```
┌──────────────────────────────────────────────────┐
│                   HỆ THỐNG GREENCAR              │
│                                                  │
│  [Khách hàng]  [Chủ xe ký gửi]  [Quản trị viên] │
│   (customer)    (vehicle_owner)      (admin)      │
└──────────────────────────────────────────────────┘
```

| Vai trò | Mô tả | Quyền truy cập |
|---------|-------|----------------|
| **Khách hàng** | Người dùng cuối tìm kiếm và đặt thuê xe | Trang công khai + khu vực cá nhân |
| **Chủ xe ký gửi** | Cá nhân/doanh nghiệp sở hữu xe muốn cho thuê qua GreenCar | Portal ký gửi + báo cáo doanh thu |
| **Quản trị viên** | Nhân viên GreenCar vận hành toàn bộ hệ thống | Toàn quyền hệ thống |

---

## 3. NGHIỆP VỤ — KHÁCH HÀNG (customer)

### 3.1 Đăng ký & Xác minh tài khoản

**Luồng đăng ký:**

```
Khách nhập thông tin
  → Hệ thống gửi OTP qua email/SMS
  → Khách xác minh OTP
  → Khách tải lên ảnh GPLX (Giấy phép lái xe)
  → Admin duyệt GPLX (trong vòng 24h)
  → Tài khoản được kích hoạt đặt xe
```

**Thông tin bắt buộc khi đăng ký:**

| Trường | Mô tả | Ràng buộc |
|--------|-------|-----------|
| Họ và tên | Tên đầy đủ | Không rỗng |
| Email | Dùng đăng nhập | Unique, định dạng email hợp lệ |
| Số điện thoại | Liên hệ & OTP | Định dạng VN (+84 hoặc 0xx) |
| Số GPLX | Giấy phép lái xe | Unique, còn hiệu lực |
| Ảnh GPLX (2 mặt) | Xác minh danh tính | JPG/PNG, < 5MB mỗi ảnh |
| Mật khẩu | Đăng nhập | Tối thiểu 8 ký tự |

**Quy tắc nghiệp vụ:**
- Mỗi GPLX chỉ được liên kết với **một tài khoản duy nhất**.
- GPLX phải còn hiệu lực tối thiểu **6 tháng** kể từ ngày đăng ký.
- Chưa xác minh GPLX → chỉ xem xe, không đặt được.

---

### 3.2 Tìm kiếm xe

**Bộ lọc tìm kiếm:**

| Bộ lọc | Mô tả |
|--------|-------|
| Địa điểm đón | Chọn từ danh sách điểm GreenCar (theo thành phố) |
| Ngày & giờ nhận xe | Chọn từ lịch |
| Ngày & giờ trả xe | Phải sau giờ nhận tối thiểu 4 giờ |
| Hãng xe | Tesla, VinFast, Hyundai, VW, Ford, Polestar, Audi, Lucid, Rivian |
| Loại xe | Sedan, SUV, Crossover, Fastback |
| Phạm vi pin | > 300km / > 400km / > 500km / > 600km |
| Số chỗ ngồi | 5 chỗ / 7 chỗ |
| Sắp xếp | Giá tăng dần, giá giảm dần, phạm vi xa nhất, mạnh nhất |

**Quy tắc hiển thị xe:**
- Chỉ hiển thị xe có `status = 'available'` trong khung thời gian yêu cầu.
- Xe đang bảo trì (`maintenance`) **không hiển thị**.
- Nếu không có xe trống tại địa điểm → gợi ý điểm gần nhất trong bán kính 5km.

---

### 3.3 Xem chi tiết xe

Trang chi tiết hiển thị:

- **Thông số kỹ thuật**: Pin (kWh), phạm vi (km), tăng tốc 0–100, horsepower, số chỗ, cốp xe, số túi khí, hộp số
- **Tính năng nổi bật**: Camera 360°, Autopilot, Sạc nhanh DC, AWD, Cửa sổ trời, Ghế sưởi...
- **Ảnh xe**: Ảnh thực tế của từng mẫu (exterior, interior)
- **Trạng thái pin hiện tại** và sức khỏe pin
- **Bảng giá thuê**: Gói 4h / 8h / 24h — hiển thị rõ km tối đa, phí vượt giờ, phí vượt km
- **Đánh giá khách hàng trước**: Rating sao + bình luận (chỉ từ người đã hoàn thành chuyến)
- **Vị trí xe trên bản đồ**

---

### 3.4 Đặt xe (Checkout)

**Bước 1 — Chọn gói thuê:**

| Gói | Thời lượng | KM tối đa | Giá ví dụ (Tesla Model 3) |
|-----|-----------|-----------|---------------------------|
| Gói 4h | 4 giờ | 150km | 750.000đ |
| Gói 8h | 8 giờ | 250km | 1.150.000đ |
| Gói 24h | 24 giờ | 400km | 1.500.000đ |

**Bước 2 — Xác nhận thông tin:**
- Địa điểm nhận và trả xe (có thể khác nhau nếu xe hỗ trợ one-way)
- Ngày giờ nhận xe / trả xe
- Gói thuê đã chọn
- Tổng tiền dự kiến = giá gói + ước tính phí phát sinh

**Bước 3 — Đặt cọc:**
- Mức cọc = **20% tổng giá thuê** (tối thiểu 200.000đ)
- Cọc được thanh toán ngay khi đặt lịch
- Cọc sẽ khấu trừ vào tổng thanh toán cuối chuyến

**Bước 4 — Xác nhận đặt lịch:**
- Hệ thống tạo booking với `status = 'pending'`
- Admin xác nhận trong vòng **2 giờ** → `status = 'confirmed'`
- Khách nhận email/SMS xác nhận kèm mã booking

**Quy tắc nghiệp vụ:**
- Khách chỉ có thể có tối đa **2 booking đang active/confirmed** cùng lúc.
- Không thể đặt xe khi thời gian nhận xe < **2 giờ** kể từ lúc đặt.
- Xe chỉ bị giữ chỗ (blocked) sau khi Admin xác nhận booking, không phải khi khách vừa đặt.

---

### 3.5 Thanh toán

**Phương thức thanh toán được hỗ trợ:**

| Phương thức | Mô tả |
|-------------|-------|
| MoMo | Ví điện tử MoMo |
| VNPay | Cổng thanh toán VNPay (ATM, thẻ Visa/Master) |
| Chuyển khoản ngân hàng | Chuyển khoản theo số tài khoản GreenCar |
| Tiền mặt | Thanh toán trực tiếp khi nhận xe (chỉ áp dụng thanh toán phần còn lại) |

**Quy trình thanh toán 2 bước:**

```
Đặt lịch → Thanh toán cọc (20%) → [Chuyến đi] → Thanh toán phần còn lại + phí phát sinh
```

**Hoàn tiền khi hủy:**

| Thời điểm hủy | Hoàn tiền |
|---------------|-----------|
| Hủy trước 24h so với giờ nhận xe | Hoàn **100%** tiền cọc trong 1-3 ngày làm việc |
| Hủy trong 2–24h trước giờ nhận | Hoàn **50%** tiền cọc |
| Hủy trong vòng 2h hoặc sau khi đã nhận xe | **Không hoàn** tiền cọc |

---

### 3.6 Nhận xe & Trả xe

**Quy trình nhận xe:**
1. Khách mang theo CCCD hoặc hộ chiếu và GPLX gốc
2. Nhân viên GreenCar xác nhận danh tính khớp với tài khoản
3. Kiểm tra xe cùng nhau: ngoại thất, mức pin, số km hiện tại, các vết xước có sẵn (chụp ảnh)
4. Ký biên bản giao nhận xe (bản điện tử qua app)
5. Hệ thống cập nhật `actual_start_time`, booking chuyển sang `status = 'active'`

**Quy trình trả xe:**
1. Khách trả xe tại địa điểm đã thỏa thuận
2. Nhân viên kiểm tra: số km thực tế, tình trạng xe, mức pin còn lại
3. Hệ thống tính phí phát sinh:
   - `overtime_fee` nếu trả muộn (tính theo phút, làm tròn lên 30 phút)
   - `over_km_fee` nếu vượt km (= km vượt × over_km_price)
4. Khách thanh toán phần còn lại = `total_price − deposit_amount`
5. Hệ thống cập nhật `actual_end_time`, `actual_km`, booking → `status = 'completed'`

**Quy tắc nghiệp vụ:**
- Mức pin khi trả phải ≥ **20%**. Nếu < 20% → phí phạt pin thấp = 100.000đ.
- Nếu xe bị hư hỏng → khách chịu chi phí sửa chữa, trừ vào tiền cọc bổ sung.

---

### 3.7 Đánh giá xe

- Khách chỉ được đánh giá sau khi booking chuyển sang `completed`.
- Mỗi booking chỉ được **1 lượt đánh giá** (unique constraint trên `booking_id`).
- Đánh giá gồm: rating sao (1–5) + bình luận văn bản (tối thiểu 20 ký tự).
- Đánh giá hiển thị công khai trên trang chi tiết xe.
- Admin có thể ẩn đánh giá vi phạm chính sách.

---

### 3.8 Quản lý tài khoản cá nhân

Khách có thể:
- Cập nhật thông tin cá nhân (họ tên, số điện thoại, avatar)
- Đổi mật khẩu
- Xem lịch sử tất cả booking (filter theo trạng thái)
- Xem chi tiết từng chuyến (bao gồm hóa đơn)
- Hủy booking (nếu đủ điều kiện)
- Xem và quản lý các đánh giá đã gửi

---

## 4. NGHIỆP VỤ — QUẢN TRỊ VIÊN (admin)

### 4.1 Dashboard tổng quan

Admin nhìn thấy ngay khi đăng nhập:

| Chỉ số | Mô tả |
|--------|-------|
| Tổng doanh thu hôm nay / tháng / năm | Tổng `total_price` của booking `completed` |
| Số booking đang chờ xác nhận | `status = 'pending'` — cần xử lý trong 2h |
| Số xe đang active (đang cho thuê) | `vehicle.status = 'booked'` |
| Số xe đang bảo trì | `vehicle.status = 'maintenance'` |
| Số xe còn trống | `vehicle.status = 'available'` |
| Tỷ lệ lấp đầy đội xe | % xe đang được thuê / tổng xe |
| Doanh thu theo thành phố | Hà Nội vs TP.HCM |
| Top xe được đặt nhiều nhất | Theo số booking completed |
| Số đánh giá mới chưa duyệt | `reviews` chưa được kiểm tra |

**Biểu đồ theo dõi:**
- Doanh thu theo ngày (30 ngày gần nhất) — Line chart
- Số booking theo trạng thái — Donut chart
- Top 5 mẫu xe phổ biến — Bar chart

---

### 4.2 Quản lý đặt xe (BookingManage)

#### 4.2.1 Duyệt booking mới

Khi `status = 'pending'`:
1. Admin nhận thông báo booking mới
2. Kiểm tra thông tin: khách hàng hợp lệ, xe còn trống, thời gian không trùng lịch xe khác
3. **Xác nhận** → `status = 'confirmed'`, hệ thống gửi SMS/email cho khách
4. **Từ chối** → `status = 'cancelled'`, hệ thống hoàn tiền cọc tự động, gửi lý do từ chối cho khách

**SLA xử lý:** Booking pending phải được xử lý trong **2 giờ**. Quá thời hạn → hệ thống cảnh báo admin.

#### 4.2.2 Quản lý booking đang active

Admin có thể:
- Cập nhật `actual_start_time` khi khách nhận xe
- Ghi nhận sự cố phát sinh trong chuyến (hỏng hóc, tai nạn nhỏ...)
- Gia hạn thêm giờ nếu khách yêu cầu (và xe không có lịch kế tiếp)
- Liên hệ khách qua hệ thống nội bộ

#### 4.2.3 Kết thúc chuyến

Khi khách trả xe:
1. Admin nhập `actual_end_time` và `actual_km`
2. Hệ thống tự tính:
   - `overtime_fee = số_phút_trễ / 30 × (overtime_price/2)` (làm tròn lên)
   - `over_km_fee = (actual_km - max_km) × over_km_price` (nếu > 0)
   - `total_price = price + overtime_fee + over_km_fee`
3. Admin xác nhận hóa đơn → khách thanh toán phần còn lại
4. Cập nhật `status = 'completed'`
5. Hệ thống tự đổi `vehicle.status = 'available'`

#### 4.2.4 Xử lý hủy & hoàn tiền

| Ai hủy | Điều kiện | Hành động |
|--------|----------|-----------|
| Khách hủy | > 24h trước nhận xe | Admin duyệt hoàn 100% cọc |
| Khách hủy | 2–24h trước nhận xe | Admin duyệt hoàn 50% cọc |
| Khách hủy | < 2h hoặc đang active | Không hoàn — Admin ghi nhận |
| Admin hủy (lỗi hệ thống, xe hỏng) | Bất kỳ | Hoàn 100% cọc + gửi voucher bù đắp |

---

### 4.3 Quản lý đội xe (VehicleManage)

#### 4.3.1 Thêm mẫu xe mới (vehicle_model)

Thông tin cần nhập:
- Tên mẫu xe, hãng sản xuất
- Số chỗ ngồi, công suất (HP), phạm vi (km), dung tích cốp, số túi khí
- Loại xe (SUV/Sedan/Crossover/Fastback)
- Hộp số
- Thêm specs kỹ thuật (pin kWh, tăng tốc...)
- Chọn các tính năng có sẵn từ danh mục
- Upload ảnh xe (tối đa 10 ảnh, ảnh đại diện đánh dấu `is_primary`)

#### 4.3.2 Thêm xe cụ thể (vehicle)

- Chọn mẫu xe đã có trong hệ thống
- Nhập biển số xe (unique)
- Chọn địa điểm đỗ xe (location_id)
- Nhập mức pin hiện tại và sức khỏe pin
- Trạng thái ban đầu: `available`

#### 4.3.3 Cập nhật trạng thái xe

Admin có thể thay đổi `vehicle.status` thủ công:

| Từ | Sang | Lý do |
|----|------|-------|
| `available` | `maintenance` | Đưa xe đi bảo dưỡng định kỳ |
| `maintenance` | `available` | Bảo dưỡng xong, xe sẵn sàng |
| `available` | `booked` | Hệ thống tự chuyển khi booking confirmed |

**Quy tắc:** Không thể đổi sang `maintenance` nếu xe đang có booking `confirmed` hoặc `active`.

#### 4.3.4 Lịch bảo dưỡng

Admin lập lịch bảo dưỡng định kỳ:
- Mỗi xe bảo dưỡng định kỳ sau **5.000 km** hoặc **3 tháng** (tùy cái nào đến trước)
- Khi lên lịch bảo dưỡng → hệ thống chặn booking cho xe đó trong khoảng thời gian đó
- Sau khi bảo dưỡng xong → cập nhật mức pin và sức khỏe pin

#### 4.3.5 Quản lý giá

- Admin có thể điều chỉnh giá từng gói thuê (4h/8h/24h) cho từng mẫu xe
- Giá mới áp dụng cho booking **mới** sau thời điểm cập nhật, không ảnh hưởng booking cũ
- Có thể thiết lập giá theo mùa (dịp lễ, cuối tuần) — lưu riêng với `effective_from`, `effective_to`

---

### 4.4 Quản lý người dùng (UserManage)

Admin có thể:

| Hành động | Mô tả |
|-----------|-------|
| Xem danh sách users | Lọc theo role, thành phố, ngày đăng ký |
| Duyệt GPLX | Xem ảnh GPLX, xác nhận hợp lệ hoặc từ chối kèm lý do |
| Khóa/mở tài khoản | Khóa khi vi phạm chính sách |
| Xem lịch sử booking của user | Kiểm tra hành vi thuê xe |
| Reset mật khẩu | Khi user quên mật khẩu và không nhận được email |
| Nâng cấp lên owner | Phê duyệt người dùng trở thành chủ xe ký gửi |

**Quy trình duyệt GPLX:**
1. User đăng ký và upload GPLX
2. Admin nhận thông báo "GPLX mới cần duyệt"
3. Admin xem ảnh, kiểm tra: còn hạn, ảnh rõ nét, tên khớp với tên tài khoản
4. **Duyệt** → user nhận email kích hoạt đặt xe
5. **Từ chối** → user nhận email với lý do, được phép upload lại

---

### 4.5 Quản lý điểm đón/trả (LocationManage)

- Thêm, sửa, ẩn địa điểm
- Mỗi địa điểm có: tên, địa chỉ đầy đủ, thành phố, tọa độ GPS
- Liên kết địa điểm với từng xe cụ thể
- Xem số xe và xe cụ thể đang có tại từng địa điểm

---

### 4.6 Báo cáo & Thống kê

| Báo cáo | Nội dung | Chu kỳ |
|---------|----------|--------|
| Doanh thu | Tổng theo ngày/tháng/quý, chia theo thành phố, chia theo mẫu xe | Theo yêu cầu |
| Tỷ lệ lấp đầy | % thời gian từng xe được thuê / tổng thời gian | Hàng tuần |
| Phí phát sinh | Tổng overtime_fee, over_km_fee — xe nào phát sinh nhiều nhất | Hàng tháng |
| Chất lượng dịch vụ | Rating trung bình theo xe, theo địa điểm | Hàng tháng |
| Khách hàng thân thiết | Top 20 khách thuê nhiều nhất theo số chuyến và tổng chi tiêu | Hàng quý |
| Xe sắp bảo dưỡng | Xe gần đến mốc km/tháng bảo dưỡng | Hàng tuần |

---

## 5. NGHIỆP VỤ — CHỦ XE KÝ GỬI (vehicle_owner)

> Chủ xe ký gửi là cá nhân hoặc doanh nghiệp sở hữu xe điện muốn cho GreenCar vận hành và cho thuê thay, thu tiền theo doanh thu.

### 5.1 Đăng ký làm chủ xe ký gửi

**Điều kiện:**
- Đã có tài khoản GreenCar (đã xác minh GPLX)
- Xe điện phải ≤ **5 năm** tuổi
- Còn đăng kiểm ít nhất **1 năm**
- Có bảo hiểm xe còn hiệu lực

**Quy trình đăng ký:**

```
Chủ xe gửi yêu cầu ký gửi
  → Điền thông tin xe (biển số, model, năm SX, km đã đi)
  → Upload: ảnh xe 360°, đăng ký xe, bảo hiểm, đăng kiểm
  → GreenCar kiểm định xe thực tế tại địa điểm chủ xe (trong 5 ngày làm việc)
  → Kiểm định viên ghi nhận: tình trạng ngoại thất, nội thất, pin, phần mềm
  → Admin duyệt hồ sơ và ký hợp đồng điện tử
  → Xe được thêm vào hệ thống với status = 'available'
```

---

### 5.2 Hợp đồng ký gửi

**Các điều khoản chính:**

| Điều khoản | Nội dung |
|-----------|----------|
| Tỷ lệ chia doanh thu | Chủ xe nhận **70%**, GreenCar giữ **30%** (thỏa thuận theo từng xe) |
| Thời hạn hợp đồng | Tối thiểu **6 tháng**, gia hạn tự động theo năm |
| Lấy xe lại | Chủ xe thông báo trước **7 ngày**, GreenCar xắp xếp bàn giao |
| Bảo hiểm | GreenCar mua bổ sung bảo hiểm thuê xe trong thời gian ký gửi |
| Bảo dưỡng | GreenCar chịu trách nhiệm bảo dưỡng định kỳ, chủ xe chịu sửa chữa lớn |
| Thiệt hại | GreenCar chịu trách nhiệm thiệt hại trong khi cho thuê (từ tiền đặt cọc khách) |

---

### 5.3 Portal chủ xe

Chủ xe có giao diện riêng với các tính năng:

#### Xem trạng thái xe real-time
- Xe đang trống / đang cho thuê / đang bảo dưỡng
- Mức pin hiện tại
- Vị trí xe (nếu có GPS)
- Số km đã đi trong tháng

#### Lịch sử cho thuê
- Xem tất cả booking của xe mình theo thời gian
- Chi tiết từng chuyến: thời gian, km, tiền thu được
- Xuất báo cáo PDF/Excel theo tháng

#### Doanh thu & Thanh toán

| Kỳ thanh toán | Ngày chuyển tiền |
|---------------|-----------------|
| Nửa đầu tháng (1–15) | Ngày 18 hàng tháng |
| Nửa cuối tháng (16–31) | Ngày 3 tháng sau |

Chủ xe nhận:
- Bảng kê chi tiết từng booking đã hoàn thành trong kỳ
- Doanh thu gộp, tỷ lệ chia, số tiền thực nhận
- Lịch sử chuyển khoản

#### Yêu cầu & Khiếu nại
- Chủ xe có thể gửi yêu cầu lấy xe lại (trước thời hạn hợp đồng)
- Yêu cầu giải trình khi có sự cố liên quan xe của mình
- Chat trực tiếp với admin phụ trách

#### Cập nhật xe
- Upload ảnh mới của xe
- Báo cáo hư hỏng phát hiện khi xe về tay
- Yêu cầu nâng cấp thiết bị (ốp điện thoại, thảm lót...)

---

### 5.4 Quy trình kiểm định xe định kỳ

- **Hàng tháng**: Admin chụp ảnh tình trạng ngoại/nội thất, kiểm tra pin
- **Mỗi 3 tháng**: Kiểm định toàn diện tại gara đối tác
- Kết quả kiểm định được chia sẻ với chủ xe qua portal
- Nếu phát hiện hư hỏng do khách → GreenCar khấu trừ từ tiền cọc khách và thông báo chủ xe

---

## 6. QUY TRÌNH LIÊN VAI TRÒ

### 6.1 Luồng đặt xe hoàn chỉnh

```
[Khách]                    [Hệ thống]               [Admin]
   │                           │                        │
   │── Tìm kiếm xe ───────────>│                        │
   │<─ Kết quả xe trống ───────│                        │
   │── Chọn xe & gói thuê ────>│                        │
   │── Thanh toán cọc ────────>│                        │
   │                           │── Tạo booking PENDING ─>│
   │                           │                        │── Kiểm tra & Duyệt
   │<─ Email xác nhận ─────────│<── CONFIRMED ──────────│
   │                           │                        │
   │  [Ngày nhận xe]           │                        │
   │── Đến điểm, xuất trình GiH│                        │
   │                           │<─ Cập nhật actual_start │
   │<─ Nhận xe, ký biên bản ───│── Booking → ACTIVE ────│
   │                           │                        │
   │  [Lái xe...]              │                        │
   │                           │                        │
   │── Trả xe ────────────────>│                        │
   │                           │<─ Cập nhật actual_end, km
   │                           │── Tính phí phát sinh ──│
   │── Thanh toán phần còn lại>│                        │
   │<─ Hóa đơn điện tử ────────│── Booking → COMPLETED ─│
   │── Đánh giá xe (tùy chọn)─>│                        │
```

### 6.2 Luồng ký gửi xe

```
[Chủ xe]                   [Admin]                  [Hệ thống]
   │── Gửi yêu cầu ký gửi ──>│                          │
   │── Upload hồ sơ xe ──────>│                          │
   │                          │── Lên lịch kiểm định ───>│
   │                          │                          │── Gửi thông báo cho chủ xe
   │<─ Xác nhận lịch ─────────│                          │
   │                          │── [Kiểm định thực tế]    │
   │                          │── Nhập kết quả KĐ ──────>│
   │<─ Gửi hợp đồng điện tử ──│                          │
   │── Ký hợp đồng ──────────>│                          │
   │                          │── Thêm xe vào hệ thống ─>│
   │<─ Xác nhận xe live ───────│                          │── vehicle.status = 'available'
```

---

## 7. QUY TẮC TÍNH TIỀN

### 7.1 Công thức tổng quát

```
total_price = base_price + overtime_fee + over_km_fee + pin_penalty
```

| Thành phần | Công thức | Ví dụ |
|-----------|-----------|-------|
| `base_price` | Giá gói thuê cố định | Tesla Model 3 / Gói 24h = 1.500.000đ |
| `overtime_fee` | `CEIL(phút_trễ / 30) × (overtime_price / 2)` | Trễ 45 phút → 2 lần × 75.000đ = 150.000đ |
| `over_km_fee` | `MAX(0, actual_km - max_km) × over_km_price` | Vượt 50km × 3.000đ = 150.000đ |
| `pin_penalty` | 100.000đ nếu trả xe với pin < 20% | — |

### 7.2 Tính cọc

```
deposit_amount = MAX(200.000đ, ROUND(base_price × 0.2, -3))
```
*(Làm tròn đến nghìn đồng)*

### 7.3 Thanh toán cuối chuyến

```
amount_due = total_price - deposit_amount
```

Nếu `amount_due < 0` (ví dụ khách về sớm, GreenCar hủy chuyến) → hoàn tiền phần chênh lệch.

---

## 8. TRẠNG THÁI & CHUYỂN TRẠNG THÁI

### 8.1 Trạng thái Booking

```
                  ┌──────────┐
                  │ PENDING  │  ← Khách vừa đặt + thanh toán cọc
                  └────┬─────┘
           Duyệt ──────┤──────── Từ chối
                       ▼                 ▼
                ┌──────────┐       ┌───────────┐
                │CONFIRMED │       │ CANCELLED │
                └────┬─────┘       └───────────┘
        Nhận xe ─────┤──────── Khách/Admin hủy
                     ▼                   ▼
               ┌──────────┐        ┌───────────┐
               │  ACTIVE  │        │ CANCELLED │
               └────┬─────┘        └───────────┘
        Trả xe ──────┤
                     ▼
              ┌───────────┐
              │ COMPLETED │
              └───────────┘
```

### 8.2 Trạng thái Vehicle

```
  ┌───────────┐     Admin/Hệ thống lock khi booking confirmed
  │ AVAILABLE │ ──────────────────────────────────────────────> ┌────────┐
  └─────┬─────┘                                                  │ BOOKED │
        │ <──────────────────────────────────────────────────── └────────┘
        │              Booking completed / cancelled
        │
        │ Admin đưa đi bảo dưỡng
        ▼
  ┌─────────────┐
  │ MAINTENANCE │
  └─────────────┘
        │ Admin xác nhận bảo dưỡng xong
        ▼
  ┌───────────┐
  │ AVAILABLE │
  └───────────┘
```

### 8.3 Trạng thái Payment

```
PENDING → COMPLETED   (thanh toán thành công)
PENDING → FAILED      (thanh toán thất bại)
COMPLETED → REFUNDED  (hoàn tiền khi hủy)
```

---

*Tài liệu này được duy trì bởi team GreenCar. Mọi thay đổi nghiệp vụ cần cập nhật tài liệu trước khi triển khai code.*
