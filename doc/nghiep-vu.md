# GreenCar — Tài Liệu Nghiệp Vụ Chi Tiết

> Hệ thống đặt xe điện tự lái tại Hà Nội & TP.HCM  
> Phiên bản: 1.0 — Cập nhật: 05/2026

---
GreenCar là mô hình thuê xe trực tiếp từ công ty (không phải P2P như BonbonCar), nên bỏ hẳn bước "chủ xe nhận đơn" và "theo dõi trên app" — những bước đó chỉ hợp lý với mô hình cho thuê ngang hàng. Đặt xe xong là xác nhận ngay.

Luồng đề xuất cho GreenCar

[1] Chọn xe + gói thuê (CarDetail)
         ↓
[2] Thông tin đặt xe (Checkout)
    • Guest:   nhập Tên / SĐT / Số GPLX / Email
    • Account: điền sẵn từ profile, chỉ xác nhận
    • Chọn ngày nhận – trả, địa điểm
         ↓
[3] Thanh toán giữ chỗ (Payment)
    • Hiện tóm tắt đơn + số tiền cọc (VD: 30% tổng)
    • Chọn phương thức: Chuyển khoản / Thẻ / COD
    • Bấm "Xác nhận & Giữ chỗ"
         ↓
[4] Xác nhận đơn (Confirmation)
    • Hiện mã đơn, chi tiết xe, thời gian
    • "Email xác nhận đã gửi về [email]"  ← future
    • Nút "Xem đơn của tôi"

Step 2 (Thanh toán): Chỉ còn chuyển khoản, xóa tùy chọn tiền mặt
Booking tạo ra với status confirmed ngay (không cần admin xác nhận)
Admin: Chỉ hiển thị thông báo/danh sách đặt cọc, không có nút xác nhận/huỷ
Đơn của tôi: Hiển thị đúng tên xe, thời gian, đã cọc bao nhiêu

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

### 3.6 Nhận xe & Sử dụng xe (2.4)

Sau khi đơn thuê xe được xác nhận, khách hàng bước vào giai đoạn thực hiện chuyến đi. Trước khi nhận xe, khách hàng cần mang theo CCCD hoặc hộ chiếu và bằng lái xe bản gốc để đối chiếu với thông tin đã đăng ký trong hệ thống. Khi đến điểm nhận xe, nhân viên GreenCar hoặc đại diện vận hành sẽ kiểm tra thông tin khách hàng, xác nhận khớp với booking và tài khoản, sau đó cùng khách hàng tiến hành kiểm tra tình trạng xe. Quá trình này bao gồm việc xem xét ngoại thất, mức pin hiện tại, số km đã đi, tình trạng nội thất và các vết xước có sẵn trên xe. Để đảm bảo tính minh bạch, các thông tin này sẽ được ghi nhận bằng ảnh hoặc video làm bằng chứng trước khi giao xe. Sau khi cả hai bên thống nhất, biên bản giao nhận xe sẽ được ký kết và hệ thống sẽ ghi nhận thời điểm bắt đầu thực tế của chuyến đi, đồng thời chuyển booking sang trạng thái đang hoạt động.

Trong suốt thời gian sử dụng xe, khách hàng cần tuân thủ đúng các điều khoản thuê xe đã thỏa thuận, bao gồm thời gian sử dụng, phạm vi di chuyển, giới hạn số km và các quy định liên quan đến việc vận hành xe. Nếu có thay đổi về thời gian trả xe hoặc địa điểm trả xe, khách hàng phải báo trước để GreenCar có thể phối hợp điều chỉnh kịp thời. Trong trường hợp phát sinh như hư hỏng nhẹ, tai nạn nhỏ, hết pin trước hạn hoặc mất mát, khách hàng cần thông báo ngay cho hệ thống để được ghi nhận và xử lý phù hợp. Khi đến thời điểm kết thúc chuyến, khách hàng sẽ trả xe đúng thời điểm và địa điểm đã thỏa thuận. Tại thời điểm này, nhân viên GreenCar sẽ kiểm tra lại số km thực tế, mức pin còn lại, tình trạng xe và các dấu hiệu mới xuất hiện trong suốt quá trình thuê. Nếu khách hàng trả xe muộn hoặc vượt quá giới hạn của gói thuê, hệ thống sẽ tự động tính các khoản phí phát sinh như phí trả muộn, phí vượt km hoặc các chi phí phát sinh khác. Những thông tin này sẽ được ghi nhận làm cơ sở để hoàn tất thanh toán cuối chuyến.

Về mặt nghiệp vụ, mức pin khi trả xe phải đạt tối thiểu 20% trở lên. Nếu mức pin thấp hơn ngưỡng này, khách hàng sẽ bị áp dụng phí phạt pin thấp. Nếu xe bị hư hỏng hoặc mất mát trong thời gian thuê, khách hàng sẽ chịu trách nhiệm chi phí sửa chữa hoặc bồi thường tương ứng. Ngược lại, nếu xe được trả đúng hạn và trong tình trạng nguyên vẹn, phần cọc sẽ được xử lý theo đúng quy định đã thống nhất trước đó.

---

### 3.7 Hoàn tất & Đánh giá (2.5)

Sau khi quá trình kiểm tra xe và tính toán các khoản phát sinh kết thúc, hệ thống sẽ tổng hợp toàn bộ chi phí cuối chuyến để khách hàng thực hiện bước thanh toán phần còn lại. Khách hàng sẽ thanh toán các khoản phí phát sinh nếu có, bao gồm phí trả muộn, phí vượt km, phí phạt pin hoặc các chi phí hư hỏng phát sinh trong thời gian sử dụng. Nếu xe được trả đúng hạn và không có phát sinh, phần cọc sẽ được giải phóng hoặc điều chỉnh theo chính sách của GreenCar. Trong trường hợp có hư hỏng, vi phạm quy định hoặc trả xe muộn, số tiền tương ứng sẽ được khấu trừ khỏi tiền cọc hoặc cộng vào hóa đơn cuối chuyến. Khi toàn bộ quá trình thanh toán hoàn tất, booking sẽ được cập nhật sang trạng thái hoàn thành, đồng thời hệ thống sẽ lưu lại toàn bộ dữ liệu chuyến đi để phục vụ cho việc theo dõi và quản lý sau này.

Sau khi chuyến đi kết thúc, khách hàng có thể thực hiện đánh giá về trải nghiệm thuê xe. Khách chỉ được đánh giá sau khi booking chuyển sang trạng thái completed. Mỗi booking chỉ được phép gửi một lượt đánh giá duy nhất, nhằm đảm bảo tính trung thực và tránh việc lặp lại ý kiến. Nội dung đánh giá gồm điểm số từ 1 đến 5 cùng với bình luận văn bản có độ dài tối thiểu 20 ký tự. Những đánh giá này sẽ được hiển thị công khai trên trang chi tiết xe để giúp khách hàng khác có thêm căn cứ khi lựa chọn. Nếu đánh giá vi phạm chính sách hoặc chứa nội dung không phù hợp, quản trị viên có thể ẩn đánh giá đó khỏi hệ thống.

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

### 5.1 Đăng ký xe cho chủ xe ký gửi

Khi chủ xe muốn đưa xe vào hệ thống GreenCar để cho thuê, chủ xe sẽ bắt đầu bằng bước đăng ký xe trên portal dành riêng cho chủ xe. Đây là bước đầu tiên để hệ thống xác nhận xe có đủ điều kiện, hồ sơ đầy đủ và phù hợp với mô hình cho thuê của GreenCar trước khi xe được đưa lên danh sách cho khách thuê.

**Điều kiện đăng ký:**
- Chủ xe đã có tài khoản GreenCar và tài khoản này đã được xác minh GPLX.
- Xe điện phải có tuổi đời tối đa **5 năm** tính từ năm sản xuất.
- Xe còn hiệu lực đăng kiểm tối thiểu **1 năm** kể từ ngày đăng ký.
- Xe có bảo hiểm còn hiệu lực và phù hợp với quy định thuê xe.
- Chủ xe đồng ý với các quy định về giá thuê, điều khoản bồi thường và quyền quản lý xe của GreenCar.

**Thông tin cần cung cấp khi đăng ký:**
- Thông tin chủ xe: họ tên, số điện thoại, địa chỉ liên hệ và tài khoản GreenCar.
- Thông tin xe: hãng xe, model, năm sản xuất, biển số, màu sắc và số km hiện tại.
- Hồ sơ pháp lý: giấy đăng ký xe, giấy đăng kiểm và bản sao bảo hiểm xe.
- Hồ sơ kỹ thuật: ảnh xe 360°, ảnh nội thất, ảnh pin, ảnh biển số và các giấy tờ liên quan khác.
- Thông tin cho thuê: địa điểm nhận/trả xe, thời gian xe sẵn sàng, mức giá đề xuất và điều kiện sử dụng.

**Quy trình đăng ký xe:**
1. Chủ xe đăng nhập vào portal chủ xe và chọn chức năng “Đăng ký xe cho thuê”.
2. Hệ thống yêu cầu chủ xe nhập đầy đủ thông tin cơ bản về xe, bao gồm biển số, model, năm sản xuất, số km hiện tại, địa điểm xe đang lưu trữ và các thông tin liên hệ.
3. Chủ xe tải lên hồ sơ cần thiết như ảnh xe toàn cảnh, ảnh nội thất, ảnh biển số, giấy đăng ký xe, giấy đăng kiểm và bản sao bảo hiểm.
4. Hệ thống sẽ kiểm tra tính đầy đủ của hồ sơ. Nếu hồ sơ chưa đủ, hệ thống sẽ lưu ở trạng thái nháp và yêu cầu chủ xe bổ sung trước khi gửi.
5. Khi hồ sơ đã đầy đủ, chủ xe bấm gửi yêu cầu đăng ký. Hệ thống sẽ chuyển hồ sơ sang trạng thái “đang xét duyệt”.
6. GreenCar sẽ phân công kiểm định viên hoặc nhân viên vận hành tiếp nhận hồ sơ và tiến hành kiểm định thực tế tại địa điểm xe đang đặt.
7. Trong buổi kiểm định, đơn vị kiểm định sẽ ghi nhận tình trạng ngoại thất, nội thất, mức pin hiện tại, tình trạng pin, phần mềm vận hành và các hạng mục liên quan khác.
8. Sau khi kiểm định xong, hồ sơ sẽ được chuyển cho admin xem xét và phê duyệt. Nếu đạt yêu cầu, hệ thống sẽ ký hợp đồng điện tử và kích hoạt xe để đưa vào danh sách cho thuê.
9. Nếu hồ sơ không đạt yêu cầu, hệ thống sẽ gửi thông báo cho chủ xe, kèm lý do từ chối và hướng dẫn chỉnh sửa hoặc nộp lại hồ sơ.

**Trạng thái hồ sơ đăng ký xe:**
- `draft`: chủ xe đang nhập hồ sơ nhưng chưa gửi.
- `submitted`: chủ xe đã gửi hồ sơ và chờ xử lý.
- `reviewing`: GreenCar đang kiểm tra và kiểm định xe.
- `approved`: hồ sơ hợp lệ, xe được kích hoạt cho thuê.
- `rejected`: hồ sơ bị từ chối vì không đủ điều kiện hoặc không đạt tiêu chuẩn.
- `suspended`: xe đã được kích hoạt nhưng tạm thời bị khóa do vi phạm, hư hỏng hoặc chờ kiểm tra lại.

**Quy tắc nghiệp vụ:**
- Xe chỉ được hiển thị cho khách thuê sau khi trạng thái hồ sơ chuyển sang `approved`.
- Nếu chủ xe chỉnh sửa thông tin sau khi hồ sơ đã gửi, trạng thái hồ sơ sẽ quay lại `reviewing` để được kiểm tra lại.
- Nếu xe bị phát hiện không đúng với hồ sơ đã nộp, GreenCar có quyền tạm ngừng cho thuê cho đến khi giải quyết xong.
- Hồ sơ đăng ký xe là căn cứ để xác định tính hợp lệ của xe trong toàn bộ vòng đời cho thuê.

**Vai trò liên quan trong quy trình:**
- Chủ xe: cung cấp thông tin và hồ sơ, phản hồi khi có yêu cầu bổ sung.
- Admin: duyệt hồ sơ, xác nhận trạng thái và cấp quyền cho xe hoạt động.
- Kiểm định viên/nhân viên vận hành: kiểm tra xe thực tế và ghi nhận kết quả kiểm định.
- Hệ thống: lưu trữ hồ sơ, cập nhật trạng thái và điều phối workflow đăng ký xe.

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
