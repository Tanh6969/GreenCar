-- =============================================================
--  GreenCar — DỮ LIỆU MẪU  (datasample.sql)
--  Chạy SAU khi đã tạo schema từ "xe dien (1).sql"
--
--  psql -U <user> -d <dbname> -f datasample.sql
--
--  Mật khẩu mẫu tất cả: greencar123
--  (bcrypt $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
-- =============================================================

BEGIN;

-- Xóa dữ liệu cũ và reset sequence (an toàn, chỉ dùng cho dev/test)
TRUNCATE TABLE
  reviews, payments, bookings,
  pricing, rental_plans,
  vehicle_model_features, vehicle_specs, vehicle_features,
  vehicle_images, vehicles, vehicle_models,
  locations, users, roles
RESTART IDENTITY CASCADE;

-- =============================================================
-- 1. ROLES
-- =============================================================
INSERT INTO roles (role_name) VALUES
  ('admin'),
  ('customer');
-- role_id: 1=admin, 2=customer

-- =============================================================
-- 2. USERS  (12 người dùng)
-- =============================================================
INSERT INTO users (name, email, password, phone, license_no, role_id, created_at) VALUES
  ('Admin GreenCar',   'admin@greencar.vn',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0900000001', 'B2-ADMIN01', 1, '2026-01-01 08:00:00'),
  ('Nguyễn Văn An',    'nguyenvanan@gmail.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234502', 'B2-023452',  2, '2026-01-10 09:15:00'),
  ('Trần Thị Bình',    'tranthib@gmail.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234503', 'B2-023453',  2, '2026-01-12 10:30:00'),
  ('Lê Hoàng Cường',   'lehcuong@gmail.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234504', 'B2-023454',  2, '2026-01-15 14:00:00'),
  ('Phạm Minh Dũng',   'pminhd@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234505', 'B2-023455',  2, '2026-01-20 08:45:00'),
  ('Hoàng Thị Lan',    'hthilan@gmail.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234506', 'B2-023456',  2, '2026-02-01 11:00:00'),
  ('Vũ Đức Mạnh',      'vdmanh@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234507', 'B2-023457',  2, '2026-02-05 16:20:00'),
  ('Đặng Thị Nga',     'dtnga@gmail.com',         '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234508', 'B2-023458',  2, '2026-02-10 09:00:00'),
  ('Bùi Quang Hải',    'bqhai@gmail.com',         '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234509', 'B2-023459',  2, '2026-02-15 13:30:00'),
  ('Ngô Thị Hương',    'nthhuong@gmail.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234510', 'B2-023460',  2, '2026-02-20 10:15:00'),
  ('Đinh Văn Khoa',    'dvkhoa@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234511', 'B2-023461',  2, '2026-03-01 08:00:00'),
  ('Lý Thị Mai',       'ltmai@gmail.com',         '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234512', 'B2-023462',  2, '2026-03-05 14:45:00'),
  -- Khách hàng TP.HCM
  ('Trần Văn Nam',     'tvnam.hcm@gmail.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0931234513', 'B2-HCM013',  2, '2026-01-18 10:00:00'),
  ('Nguyễn Thị Oanh',  'ntoanh.hcm@gmail.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0931234514', 'B2-HCM014',  2, '2026-01-25 14:00:00'),
  ('Phan Đức Phúc',    'pdphuc.hcm@gmail.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0931234515', 'B2-HCM015',  2, '2026-02-08 09:30:00'),
  ('Võ Thị Quỳnh',     'vtquynh.hcm@gmail.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0931234516', 'B2-HCM016',  2, '2026-02-14 11:00:00'),
  ('Đỗ Minh Sơn',      'dmson.hcm@gmail.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0931234517', 'B2-HCM017',  2, '2026-03-02 15:00:00');
-- user_id: 1=admin, 2-12=KH Hà Nội, 13-17=KH TP.HCM

-- =============================================================
-- 3. LOCATIONS  (7 Hà Nội + 6 TP.HCM = 13 địa điểm)
-- =============================================================
INSERT INTO locations (name, address, city, latitude, longitude) VALUES
  -- Hà Nội
  ('Ba Đình',       '128 Đội Cấn, Ba Đình',                  'Hà Nội',   21.0333, 105.8140),  --  1
  ('Đống Đa',      '45 Nguyễn Lương Bằng, Đống Đa',         'Hà Nội',   21.0180, 105.8290),  --  2
  ('Cầu Giấy',     '99 Xuân Thủy, Cầu Giấy',                'Hà Nội',   21.0360, 105.7900),  --  3
  ('Tây Hồ',       '12 Đặng Thai Mai, Tây Hồ',              'Hà Nội',   21.0580, 105.8230),  --  4
  ('Thanh Xuân',   '67 Nguyễn Trãi, Thanh Xuân',            'Hà Nội',   20.9950, 105.8150),  --  5
  ('Hoàng Mai',    '230 Giải Phóng, Hoàng Mai',              'Hà Nội',   20.9780, 105.8420),  --  6
  ('Long Biên',    '15 Ngô Gia Tự, Long Biên',               'Hà Nội',   21.0400, 105.8820),  --  7
  -- TP.HCM
  ('Quận 1',       '88 Lê Lợi, Quận 1',                     'TP.HCM',   10.7769, 106.7009),  --  8
  ('Quận 3',       '145 Võ Văn Tần, Quận 3',                'TP.HCM',   10.7794, 106.6874),  --  9
  ('Bình Thạnh',   '320 Đinh Bộ Lĩnh, Bình Thạnh',          'TP.HCM',   10.8143, 106.7100),  -- 10
  ('Tân Bình',     '210 Hoàng Văn Thụ, Tân Bình',           'TP.HCM',   10.8017, 106.6524),  -- 11
  ('Phú Nhuận',    '77 Phan Đình Phùng, Phú Nhuận',         'TP.HCM',   10.7998, 106.6827),  -- 12
  ('Thủ Đức',      '36 Võ Văn Ngân, TP. Thủ Đức',           'TP.HCM',   10.8479, 106.7540);  -- 13

-- =============================================================
-- 4. VEHICLE MODELS  (15 mẫu)
-- =============================================================
INSERT INTO vehicle_models (name, brand, seats, horsepower, range_km, trunk_capacity, airbags, vehicle_type, transmission) VALUES
  -- Hạng phổ thông
  ('VF e34',     'VinFast',  5, 147, 300,  290, 6, 'SUV',      'Số tự động'),  -- 1
  ('Accent EV',  'Hyundai',  5, 115, 420,  387, 4, 'Sedan',    'Số tự động'),  -- 2
  ('ID.4',       'VW',       5, 204, 520,  543, 9, 'SUV',      'Số tự động'),  -- 3
  ('Mach-E',     'Ford',     5, 269, 480,  402, 7, 'SUV',      'Số tự động'),  -- 4
  ('IONIQ 5',    'Hyundai',  5, 225, 451,  527, 6, 'Crossover','Số tự động'),  -- 5
  ('IONIQ 6',    'Hyundai',  5, 239, 614,  401, 7, 'Sedan',    'Số tự động'),  -- 6
  ('VF 8',       'VinFast',  7, 402, 400,  376, 8, 'SUV',      'Số tự động'),  -- 7
  ('Model 3',    'Tesla',    5, 283, 491,  561, 8, 'Sedan',    'Số tự động'),  -- 8
  -- Hạng sang
  ('Model S',    'Tesla',    5, 670, 652,  793, 8, 'Sedan',    'Số tự động'),  -- 9
  ('Model X',    'Tesla',    7, 670, 576, 1022, 8, 'SUV',      'Số tự động'),  -- 10
  ('Polestar 2', 'Polestar', 5, 476, 540,  405, 8, 'Fastback', 'Số tự động'),  -- 11
  ('e-tron GT',  'Audi',     5, 530, 488,  405, 9, 'Sedan',    'Số tự động'),  -- 12
  ('Air Pure',   'Lucid',    5, 430, 660,  739, 8, 'Sedan',    'Số tự động'),  -- 13
  ('R1S',        'Rivian',   7, 835, 505,  495, 8, 'SUV',      'Số tự động'),  -- 14
  ('VF 9',       'VinFast',  7, 402, 438,  585, 8, 'SUV',      'Số tự động');  -- 15

-- =============================================================
-- 5. VEHICLES  (22 xe)
-- =============================================================
INSERT INTO vehicles (vehicle_model_id, license_plate, status, battery_level, battery_health, location_id) VALUES
  -- VinFast VF e34
  (1,  '30H-99901', 'available',    86,  95, 1),  -- v1
  (1,  '30H-99902', 'available',    92,  98, 3),  -- v2
  -- Hyundai Accent EV
  (2,  '30A-12301', 'available',   100, 100, 1),  -- v3
  (2,  '30A-12302', 'available',    78,  93, 5),  -- v4
  -- VW ID.4
  (3,  '30K-11101', 'available',   100, 100, 2),  -- v5
  (3,  '30K-11102', 'available',    95,  99, 4),  -- v6
  -- Ford Mach-E
  (4,  '30F-55501', 'available',    88,  96, 3),  -- v7
  (4,  '30F-55502', 'booked',      100, 100, 6),  -- v8
  -- Hyundai IONIQ 5
  (5,  '30E-77701', 'available',   100, 100, 2),  -- v9
  (5,  '30E-77702', 'available',    90,  97, 7),  -- v10
  -- Hyundai IONIQ 6
  (6,  '30E-88801', 'available',   100, 100, 1),  -- v11
  -- VinFast VF 8
  (7,  '30H-44401', 'available',    95,  99, 3),  -- v12
  (7,  '30H-44402', 'available',    82,  94, 5),  -- v13
  -- Tesla Model 3
  (8,  '30T-33301', 'available',   100, 100, 4),  -- v14
  (8,  '30T-33302', 'available',    97, 100, 2),  -- v15
  -- Tesla Model S
  (9,  '30T-99901', 'available',   100, 100, 1),  -- v16
  -- Tesla Model X
  (10, '30T-99902', 'available',   100, 100, 4),  -- v17
  -- Polestar 2
  (11, '30P-22201', 'available',    96, 100, 3),  -- v18
  -- Audi e-tron GT
  (12, '30D-66601', 'available',   100, 100, 1),  -- v19
  -- Lucid Air Pure
  (13, '30L-11101', 'available',   100, 100, 2),  -- v20
  -- Rivian R1S
  (14, '30R-55501', 'maintenance',  98, 100, 7),  -- v21
  -- VinFast VF 9
  (15, '30H-44501', 'available',   100, 100, 6),  -- v22
  -- ── TP.HCM ──────────────────────────────────────────────
  (1,  '51H-12301', 'available',    90,  96, 8),  -- v23  VF e34        Q1
  (2,  '51A-44501', 'available',   100, 100, 8),  -- v24  Accent EV     Q1
  (5,  '51E-77301', 'available',    95,  99, 9),  -- v25  IONIQ 5       Q3
  (5,  '51E-77302', 'available',    88,  97,11),  -- v26  IONIQ 5       Tân Bình
  (8,  '51T-33401', 'available',   100, 100, 9),  -- v27  Tesla Model 3 Q3
  (8,  '51T-33402', 'available',    97, 100,10),  -- v28  Tesla Model 3 Bình Thạnh
  (3,  '51K-11201', 'available',   100, 100,12),  -- v29  VW ID.4       Phú Nhuận
  (4,  '51F-55601', 'booked',       93,  98,13),  -- v30  Ford Mach-E   Thủ Đức
  (7,  '51H-44601', 'available',    91,  95,11),  -- v31  VF 8          Tân Bình
  (9,  '51T-99801', 'available',   100, 100, 8),  -- v32  Tesla Model S Q1
  (11, '51P-22301', 'available',    99, 100,12),  -- v33  Polestar 2    Phú Nhuận
  (12, '51D-66701', 'available',   100, 100, 8),  -- v34  Audi e-tron   Q1
  (13, '51L-11201', 'available',   100, 100, 9),  -- v35  Lucid Air     Q3
  (15, '51H-44601', 'available',   100, 100,13);  -- v36  VF 9          Thủ Đức

-- =============================================================
-- 6. VEHICLE IMAGES
-- =============================================================
INSERT INTO vehicle_images (vehicle_model_id, image_url) VALUES
  (1,  'https://images.unsplash.com/photo-1617531653520-4893f7db7a15?auto=format&fit=crop&w=900&q=80'),
  (2,  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80'),
  (3,  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80'),
  (4,  'https://images.unsplash.com/photo-1624623278313-a930126a11c3?auto=format&fit=crop&w=900&q=80'),
  (5,  'https://images.unsplash.com/photo-1719581597814-b9e88db5ac9d?auto=format&fit=crop&w=900&q=80'),
  (6,  'https://images.unsplash.com/photo-1680093661316-5a7e94ccbf37?auto=format&fit=crop&w=900&q=80'),
  (7,  'https://images.unsplash.com/photo-1617531653320-4cdb88e42ee9?auto=format&fit=crop&w=900&q=80'),
  (8,  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80'),
  (9,  'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=900&q=80'),
  (10, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80'),
  (11, 'https://images.unsplash.com/photo-1646768914119-4ccada7a9f15?auto=format&fit=crop&w=900&q=80'),
  (12, 'https://images.unsplash.com/photo-1614026480418-bd11fdb9fa06?auto=format&fit=crop&w=900&q=80'),
  (13, 'https://images.unsplash.com/photo-1626668011686-8b0cff2ec33f?auto=format&fit=crop&w=900&q=80'),
  (14, 'https://images.unsplash.com/photo-1647531038523-84b9f4d399bf?auto=format&fit=crop&w=900&q=80'),
  (15, 'https://images.unsplash.com/photo-1617531653320-4cdb88e42ee9?auto=format&fit=crop&w=900&q=80');

-- =============================================================
-- 7. VEHICLE FEATURES
-- =============================================================
INSERT INTO vehicle_features (feature_name) VALUES
  ('Camera 360°'),            -- 1
  ('Cruise Control'),         -- 2
  ('Màn hình lớn'),           -- 3
  ('Autopilot'),              -- 4
  ('Sạc nhanh DC'),           -- 5
  ('Cửa sổ trời'),            -- 6
  ('Ghế sưởi'),               -- 7
  ('Đỗ xe tự động'),          -- 8
  ('Hệ thống âm thanh premium'), -- 9
  ('AWD');                    -- 10

-- =============================================================
-- 8. VEHICLE MODEL FEATURES
-- =============================================================
INSERT INTO vehicle_model_features (vehicle_model_id, feature_id) VALUES
  (1, 1),(1, 3),
  (2, 2),(2, 3),
  (3, 5),(3,10),
  (4, 1),(4, 6),
  (5, 5),(5,10),(5, 6),
  (6, 5),(6, 3),
  (7, 1),(7, 7),(7,10),
  (8, 4),(8, 5),(8, 3),
  (9, 4),(9, 8),(9, 9),
  (10,4),(10,8),(10,6),
  (11,10),(11,9),(11,7),
  (12,9),(12,7),(12,8),
  (13,5),(13,9),(13,6),
  (14,10),(14,1),(14,5),
  (15,1),(15,6),(15,10);

-- =============================================================
-- 9. VEHICLE SPECS
-- =============================================================
INSERT INTO vehicle_specs (vehicle_model_id, spec_name, spec_value) VALUES
  (1,  'Pin',       '42 kWh'),
  (1,  'Tăng tốc',  '0–100 trong 9.4s'),
  (2,  'Pin',       '38 kWh'),
  (2,  'Tăng tốc',  '0–100 trong 10.2s'),
  (3,  'Pin',       '77 kWh'),
  (3,  'Tăng tốc',  '0–100 trong 8.5s'),
  (4,  'Pin',       '75.7 kWh'),
  (4,  'Tăng tốc',  '0–100 trong 5.1s'),
  (5,  'Pin',       '77.4 kWh'),
  (5,  'Tăng tốc',  '0–100 trong 5.1s'),
  (6,  'Pin',       '77.4 kWh'),
  (6,  'Tăng tốc',  '0–100 trong 5.1s'),
  (7,  'Pin',       '87.7 kWh'),
  (7,  'Tăng tốc',  '0–100 trong 5.5s'),
  (8,  'Pin',       '82 kWh'),
  (8,  'Tăng tốc',  '0–100 trong 6.1s'),
  (9,  'Pin',       '100 kWh'),
  (9,  'Tăng tốc',  '0–100 trong 2.1s'),
  (10, 'Pin',       '100 kWh'),
  (10, 'Tăng tốc',  '0–100 trong 2.6s'),
  (11, 'Pin',       '78 kWh'),
  (11, 'Tăng tốc',  '0–100 trong 4.2s'),
  (12, 'Pin',       '93.4 kWh'),
  (12, 'Tăng tốc',  '0–100 trong 4.1s'),
  (13, 'Pin',       '112 kWh'),
  (13, 'Tăng tốc',  '0–100 trong 3.8s'),
  (14, 'Pin',       '135 kWh'),
  (14, 'Tăng tốc',  '0–100 trong 3.0s'),
  (15, 'Pin',       '87.7 kWh'),
  (15, 'Tăng tốc',  '0–100 trong 5.5s');

-- =============================================================
-- 10. RENTAL PLANS
-- =============================================================
INSERT INTO rental_plans (name, duration_type, max_km, overtime_price, over_km_price) VALUES
  ('Gói 4h',  'hour', 150, 150000, 3000),  -- plan 1
  ('Gói 8h',  'hour', 250, 150000, 3000),  -- plan 2
  ('Gói 24h', 'day',  400, 150000, 3000);  -- plan 3

-- =============================================================
-- 11. PRICING  (15 model × 3 gói = 45 dòng)
-- =============================================================
INSERT INTO pricing (vehicle_model_id, rental_plan_id, price) VALUES
  (1,  1,  430000), (1,  2,  650000), (1,  3,  860000),
  (2,  1,  380000), (2,  2,  600000), (2,  3,  780000),
  (3,  1,  520000), (3,  2,  820000), (3,  3, 1050000),
  (4,  1,  580000), (4,  2,  900000), (4,  3, 1150000),
  (5,  1,  550000), (5,  2,  860000), (5,  3, 1100000),
  (6,  1,  600000), (6,  2,  950000), (6,  3, 1200000),
  (7,  1,  650000), (7,  2, 1000000), (7,  3, 1300000),
  (8,  1,  750000), (8,  2, 1150000), (8,  3, 1500000),
  (9,  1, 1200000), (9,  2, 1900000), (9,  3, 2500000),
  (10, 1, 1300000), (10, 2, 2050000), (10, 3, 2800000),
  (11, 1, 1000000), (11, 2, 1550000), (11, 3, 2000000),
  (12, 1, 1400000), (12, 2, 2200000), (12, 3, 3200000),
  (13, 1, 1500000), (13, 2, 2400000), (13, 3, 3500000),
  (14, 1, 1600000), (14, 2, 2600000), (14, 3, 4200000),
  (15, 1,  900000), (15, 2, 1400000), (15, 3, 1800000);

-- =============================================================
-- 12. BOOKINGS  (30 đơn — 5 trạng thái)
--
--  Cột:  user_id | vehicle_id | rental_plan_id
--        start_time | end_time
--        actual_start_time | actual_end_time
--        planned_km | actual_km
--        deposit_amount | overtime_fee | over_km_fee | total_price
--        status | created_at
-- =============================================================
INSERT INTO bookings (
  user_id, vehicle_id, rental_plan_id,
  start_time, end_time,
  actual_start_time, actual_end_time,
  planned_km, actual_km,
  deposit_amount, overtime_fee, over_km_fee, total_price,
  status, created_at
) VALUES

-- ── COMPLETED (18 đơn đã hoàn thành) ────────────────────────
(2,  14, 3, '2026-02-01 08:00+07','2026-02-02 08:00+07', '2026-02-01 08:05+07','2026-02-02 07:50+07', 400,312, 300000,      0,     0, 1500000, 'completed','2026-01-30 15:20:00+07'),
(3,   9, 3, '2026-02-03 09:00+07','2026-02-04 09:00+07', '2026-02-03 09:10+07','2026-02-04 09:05+07', 400,398, 220000,      0,     0, 1100000, 'completed','2026-02-02 11:00:00+07'),
(4,   5, 2, '2026-02-05 10:00+07','2026-02-05 18:00+07', '2026-02-05 10:02+07','2026-02-05 18:45+07', 250,241, 165000, 112500,     0,  932500, 'completed','2026-02-04 09:30:00+07'),
(5,  16, 3, '2026-02-08 08:00+07','2026-02-09 08:00+07', '2026-02-08 08:00+07','2026-02-09 08:30+07', 400,425, 500000,  75000, 75000, 2650000, 'completed','2026-02-07 14:00:00+07'),
(6,   3, 1, '2026-02-10 14:00+07','2026-02-10 18:00+07', '2026-02-10 14:00+07','2026-02-10 17:55+07', 150,132,  78000,      0,     0,  780000, 'completed','2026-02-10 12:30:00+07'),
(7,  15, 3, '2026-02-12 08:00+07','2026-02-13 08:00+07', '2026-02-12 08:10+07','2026-02-13 08:00+07', 400,387, 300000,      0,     0, 1500000, 'completed','2026-02-11 16:00:00+07'),
(8,  20, 3, '2026-02-15 09:00+07','2026-02-16 09:00+07', '2026-02-15 09:00+07','2026-02-16 09:20+07', 400,400, 700000,  50000,     0, 3550000, 'completed','2026-02-14 10:00:00+07'),
(9,   7, 2, '2026-02-18 08:00+07','2026-02-18 16:00+07', '2026-02-18 08:05+07','2026-02-18 16:00+07', 250,208, 180000,      0,     0,  900000, 'completed','2026-02-17 20:00:00+07'),
(10, 12, 3, '2026-02-20 07:30+07','2026-02-21 07:30+07', '2026-02-20 07:35+07','2026-02-21 07:30+07', 400,355, 260000,      0,     0, 1300000, 'completed','2026-02-19 08:00:00+07'),
(11, 18, 3, '2026-02-22 10:00+07','2026-02-23 10:00+07', '2026-02-22 10:05+07','2026-02-23 10:00+07', 400,412, 400000,      0, 36000, 2036000, 'completed','2026-02-21 11:00:00+07'),
(12,  1, 1, '2026-02-25 13:00+07','2026-02-25 17:00+07', '2026-02-25 13:00+07','2026-02-25 17:00+07', 150,120,  86000,      0,     0,  430000, 'completed','2026-02-25 11:00:00+07'),
(2,  11, 2, '2026-02-27 09:00+07','2026-02-27 17:00+07', '2026-02-27 09:00+07','2026-02-27 17:30+07', 250,235, 190000,  75000,     0, 1025000, 'completed','2026-02-26 14:00:00+07'),
(3,  19, 3, '2026-03-01 08:00+07','2026-03-02 08:00+07', '2026-03-01 08:00+07','2026-03-02 08:10+07', 400,443, 640000,  25000,129000, 3354000, 'completed','2026-02-28 10:00:00+07'),
(4,   4, 3, '2026-03-05 08:00+07','2026-03-06 08:00+07', '2026-03-05 08:00+07','2026-03-06 08:00+07', 400,399, 156000,      0,     0,  780000, 'completed','2026-03-04 09:00:00+07'),
(5,  17, 3, '2026-03-08 09:00+07','2026-03-09 09:00+07', '2026-03-08 09:05+07','2026-03-09 09:00+07', 400,380, 560000,      0,     0, 2800000, 'completed','2026-03-07 12:00:00+07'),
(6,   6, 2, '2026-03-10 10:00+07','2026-03-10 18:00+07', '2026-03-10 10:00+07','2026-03-10 18:00+07', 250,197, 164000,      0,     0,  820000, 'completed','2026-03-09 18:00:00+07'),
(7,  13, 1, '2026-03-12 14:00+07','2026-03-12 18:00+07', '2026-03-12 14:05+07','2026-03-12 18:00+07', 150,148, 130000,      0,     0,  650000, 'completed','2026-03-12 10:00:00+07'),
(8,  22, 3, '2026-03-15 08:00+07','2026-03-16 08:00+07', '2026-03-15 08:00+07','2026-03-16 08:00+07', 400,401, 360000,      0,  3000, 1803000, 'completed','2026-03-14 11:00:00+07'),

-- ── CONFIRMED (4 đơn xác nhận, chưa bắt đầu) ────────────────
(9,  14, 3, '2026-05-07 08:00+07','2026-05-08 08:00+07', NULL,NULL, 400,NULL, 300000,0,0, 1500000, 'confirmed','2026-05-04 10:00:00+07'),
(10,  9, 2, '2026-05-08 09:00+07','2026-05-08 17:00+07', NULL,NULL, 250,NULL, 172000,0,0,  860000, 'confirmed','2026-05-04 14:30:00+07'),
(11, 20, 3, '2026-05-10 08:00+07','2026-05-11 08:00+07', NULL,NULL, 400,NULL, 700000,0,0, 3500000, 'confirmed','2026-05-05 09:00:00+07'),
(12, 16, 3, '2026-05-12 09:00+07','2026-05-13 09:00+07', NULL,NULL, 400,NULL, 500000,0,0, 2500000, 'confirmed','2026-05-05 10:00:00+07'),

-- ── ACTIVE (2 đơn đang thuê xe) ─────────────────────────────
(2,   8, 3, '2026-05-05 08:00+07','2026-05-06 08:00+07', '2026-05-05 08:05+07',NULL, 400,NULL, 230000,0,0, 1150000, 'active','2026-05-04 18:00:00+07'),
(3,  15, 3, '2026-05-05 09:00+07','2026-05-06 09:00+07', '2026-05-05 09:10+07',NULL, 400,NULL, 300000,0,0, 1500000, 'active','2026-05-04 20:00:00+07'),

-- ── PENDING (3 đơn chờ xác nhận) ────────────────────────────
(4,   6, 2, '2026-05-09 10:00+07','2026-05-09 18:00+07', NULL,NULL, 250,NULL, 164000,0,0,  820000, 'pending','2026-05-05 07:30:00+07'),
(5,  12, 3, '2026-05-10 08:00+07','2026-05-11 08:00+07', NULL,NULL, 400,NULL, 260000,0,0, 1300000, 'pending','2026-05-05 08:00:00+07'),
(6,   5, 1, '2026-05-08 14:00+07','2026-05-08 18:00+07', NULL,NULL, 150,NULL, 110000,0,0,  550000, 'pending','2026-05-05 09:15:00+07'),

-- ── CANCELLED (3 đơn đã hủy) ────────────────────────────────
(7,  14, 3, '2026-03-20 08:00+07','2026-03-21 08:00+07', NULL,NULL, 400,NULL, 300000,0,0, 1500000, 'cancelled','2026-03-18 10:00:00+07'),
(8,   3, 2, '2026-04-01 09:00+07','2026-04-01 17:00+07', NULL,NULL, 250,NULL, 120000,0,0,  600000, 'cancelled','2026-03-30 14:00:00+07'),
(9,  18, 1, '2026-04-10 14:00+07','2026-04-10 18:00+07', NULL,NULL, 150,NULL, 200000,0,0, 1000000, 'cancelled','2026-04-09 11:00:00+07'),

-- ── TP.HCM COMPLETED (8 đơn) ────────────────────────────────
(13, 27, 3, '2026-02-10 08:00+07','2026-02-11 08:00+07', '2026-02-10 08:05+07','2026-02-11 08:00+07', 400,385, 300000,     0,     0, 1500000, 'completed','2026-02-09 10:00:00+07'),
(14, 32, 3, '2026-02-15 09:00+07','2026-02-16 09:00+07', '2026-02-15 09:10+07','2026-02-16 09:00+07', 400,412, 500000,     0, 36000, 2536000, 'completed','2026-02-14 12:00:00+07'),
(15, 25, 2, '2026-02-20 10:00+07','2026-02-20 18:00+07', '2026-02-20 10:00+07','2026-02-20 18:30+07', 250,230, 172000, 75000,     0,  935000, 'completed','2026-02-19 09:00:00+07'),
(16, 35, 3, '2026-03-01 08:00+07','2026-03-02 08:00+07', '2026-03-01 08:00+07','2026-03-02 08:10+07', 400,400, 700000,  25000,    0, 3525000, 'completed','2026-02-28 14:00:00+07'),
(17, 23, 1, '2026-03-05 14:00+07','2026-03-05 18:00+07', '2026-03-05 14:00+07','2026-03-05 18:00+07', 150,143,  86000,     0,     0,  430000, 'completed','2026-03-05 11:30:00+07'),
(13, 31, 3, '2026-03-10 08:00+07','2026-03-11 08:00+07', '2026-03-10 08:05+07','2026-03-11 08:00+07', 400,378, 260000,     0,     0, 1300000, 'completed','2026-03-09 10:00:00+07'),
(14, 33, 3, '2026-03-18 09:00+07','2026-03-19 09:00+07', '2026-03-18 09:00+07','2026-03-19 09:00+07', 400,401, 400000,     0,  3000, 2003000, 'completed','2026-03-17 11:00:00+07'),
(15, 28, 2, '2026-04-01 10:00+07','2026-04-01 18:00+07', '2026-04-01 10:05+07','2026-04-01 18:00+07', 250,244, 164000,     0,     0,  820000, 'completed','2026-03-31 15:00:00+07'),
-- ── TP.HCM CONFIRMED / PENDING ──────────────────────────────
(16, 34, 3, '2026-05-08 09:00+07','2026-05-09 09:00+07', NULL,NULL, 400,NULL, 640000,0,0, 3200000, 'confirmed','2026-05-05 08:00:00+07'),
(17, 26, 3, '2026-05-10 08:00+07','2026-05-11 08:00+07', NULL,NULL, 400,NULL, 220000,0,0, 1100000, 'pending',  '2026-05-05 09:30:00+07');

-- =============================================================
-- 13. PAYMENTS  (26 giao dịch)
-- =============================================================
INSERT INTO payments (booking_id, amount, payment_method, payment_status, paid_at) VALUES
  -- completed
  (1,  1500000, 'momo',          'completed', '2026-01-30 15:25:00+07'),
  (2,  1100000, 'vnpay',         'completed', '2026-02-02 11:05:00+07'),
  (3,   932500, 'bank_transfer', 'completed', '2026-02-04 09:35:00+07'),
  (4,  2650000, 'momo',          'completed', '2026-02-07 14:10:00+07'),
  (5,   780000, 'cash',          'completed', '2026-02-10 14:00:00+07'),
  (6,  1500000, 'vnpay',         'completed', '2026-02-11 16:05:00+07'),
  (7,  3550000, 'bank_transfer', 'completed', '2026-02-14 10:10:00+07'),
  (8,   900000, 'momo',          'completed', '2026-02-17 20:05:00+07'),
  (9,  1300000, 'vnpay',         'completed', '2026-02-19 08:10:00+07'),
  (10, 2036000, 'momo',          'completed', '2026-02-21 11:10:00+07'),
  (11,  430000, 'cash',          'completed', '2026-02-25 13:00:00+07'),
  (12, 1025000, 'vnpay',         'completed', '2026-02-26 14:05:00+07'),
  (13, 3354000, 'bank_transfer', 'completed', '2026-02-28 10:10:00+07'),
  (14,  780000, 'momo',          'completed', '2026-03-04 09:05:00+07'),
  (15, 2800000, 'bank_transfer', 'completed', '2026-03-07 12:05:00+07'),
  (16,  820000, 'cash',          'completed', '2026-03-09 18:05:00+07'),
  (17,  650000, 'momo',          'completed', '2026-03-12 10:05:00+07'),
  (18, 1803000, 'vnpay',         'completed', '2026-03-14 11:05:00+07'),
  -- confirmed / active — đặt cọc
  (19,  300000, 'momo',          'completed', '2026-05-04 10:05:00+07'),
  (20,  172000, 'vnpay',         'completed', '2026-05-04 14:35:00+07'),
  (21,  700000, 'bank_transfer', 'completed', '2026-05-05 09:05:00+07'),
  (22,  500000, 'momo',          'completed', '2026-05-05 10:05:00+07'),
  (23,  230000, 'vnpay',         'completed', '2026-05-04 18:05:00+07'),
  (24,  300000, 'momo',          'completed', '2026-05-04 20:05:00+07'),
  -- cancelled — hoàn tiền
  (28,  300000, 'momo',   'refunded',  '2026-03-18 15:00:00+07'),
  (29,  120000, 'vnpay',  'refunded',  '2026-03-30 16:00:00+07'),
  -- TP.HCM completed
  (31, 1500000, 'momo',          'completed', '2026-02-09 10:05:00+07'),
  (32, 2536000, 'bank_transfer', 'completed', '2026-02-14 12:05:00+07'),
  (33,  935000, 'vnpay',         'completed', '2026-02-19 09:05:00+07'),
  (34, 3525000, 'bank_transfer', 'completed', '2026-02-28 14:05:00+07'),
  (35,  430000, 'cash',          'completed', '2026-03-05 11:35:00+07'),
  (36, 1300000, 'momo',          'completed', '2026-03-09 10:05:00+07'),
  (37, 2003000, 'vnpay',         'completed', '2026-03-17 11:05:00+07'),
  (38,  820000, 'momo',          'completed', '2026-03-31 15:05:00+07'),
  -- TP.HCM confirmed — cọc
  (39,  640000, 'bank_transfer', 'completed', '2026-05-05 08:05:00+07'),
  (40,  220000, 'momo',          'completed', '2026-05-05 09:35:00+07');

-- =============================================================
-- 14. REVIEWS  (18 đánh giá — chỉ booking completed)
-- =============================================================
INSERT INTO reviews (user_id, vehicle_model_id, booking_id, rating, comment, created_at) VALUES
  (2,  8, 1,  5, 'Tesla Model 3 tuyệt vời, êm ái và tiết kiệm. Nhân viên giao xe đúng giờ, xe sạc đầy 100%. Chắc chắn sẽ thuê lại!',                    '2026-02-02 10:00:00+07'),
  (3,  5, 2,  5, 'IONIQ 5 rộng rãi, công nghệ hiện đại. Sạc nhanh DC cực tiện. Rất ổn cho chuyến đi gia đình.',                                         '2026-02-04 11:00:00+07'),
  (4,  3, 3,  4, 'VW ID.4 lái khá tốt, nội thất rộng. Chỉ tiếc phí giờ vượt hơi cao. Dịch vụ hỗ trợ nhiệt tình.',                                      '2026-02-05 20:00:00+07'),
  (5,  9, 4,  5, 'Tesla Model S sang trọng đỉnh cao. Autopilot hoạt động cực tốt. Xứng đáng với giá tiền. Trải nghiệm không thể quên!',                  '2026-02-09 09:00:00+07'),
  (6,  2, 5,  4, 'Accent EV phù hợp cho việc đi lại trong thành phố. Gọn, dễ đỗ xe. Giá hợp lý.',                                                      '2026-02-10 19:00:00+07'),
  (7,  8, 6,  5, 'Model 3 lái cực sướng, vào cua rất chuẩn. Màn hình 15 inch siêu đẹp. Sẽ giới thiệu cho bạn bè.',                                     '2026-02-13 09:00:00+07'),
  (8, 13, 7,  5, 'Lucid Air Pure — chiếc xe đẹp nhất tôi từng lái. Yên tĩnh tuyệt đối, nội thất sang trọng. Chắc chắn thuê lại dịp đặc biệt.',          '2026-02-16 10:00:00+07'),
  (9,  4, 8,  4, 'Ford Mach-E mạnh và ổn định. Hệ thống SYNC đôi lúc lag nhẹ. Nhưng tổng thể rất tốt.',                                                '2026-02-18 17:00:00+07'),
  (10, 7, 9,  5, 'VF 8 rộng rãi, chở được nhiều người. Giá tốt nhất trong tầm phổ thông. Hài lòng 100%.',                                               '2026-02-21 08:00:00+07'),
  (11,11,10,  5, 'Polestar 2 thiết kế đẹp xuất sắc, âm thanh Harman Kardon cực hay. Xe Thụy Điển chất lượng Châu Âu thực sự.',                         '2026-02-23 11:00:00+07'),
  (12, 1,11,  4, 'VF e34 tiện cho đường phố Hà Nội, dễ lái. Pin 42kWh đủ dùng nửa ngày. Giao diện hơi khó dùng.',                                       '2026-02-25 18:00:00+07'),
  (2,  6,12,  5, 'IONIQ 6 đẹp như máy bay, rất khí động học. Phạm vi 614km là vô địch phân khúc. Thuê lại ngay!',                                       '2026-02-27 18:00:00+07'),
  (3, 12,13,  5, 'Audi e-tron GT — đỉnh nhất. Khoang hành khách cao cấp như xe sang Đức. Khẳng định đẳng cấp khi đi đón đối tác.',                      '2026-03-02 09:00:00+07'),
  (4,  2,14,  3, 'Accent EV ổn cho ngân sách. Xe còn mới nhưng cabin ồn khi chạy cao tốc. Phù hợp đi nội đô.',                                          '2026-03-06 09:00:00+07'),
  (5, 10,15,  5, 'Tesla Model X cửa cánh chim cực ngầu. 7 chỗ rộng rãi, phù hợp đưa cả gia đình đi du lịch. Tuyệt vời!',                              '2026-03-09 10:00:00+07'),
  (6,  3,16,  4, 'ID.4 lái thoải mái, cảm giác lái tốt. Giao diện Volkswagen hơi phức tạp lúc đầu nhưng quen rồi ổn.',                                  '2026-03-10 19:00:00+07'),
  (7,  7,17,  5, 'VF 8 7 chỗ rất tiện cho cả nhóm bạn. Lái mượt, màn hình lớn, cảm biến đủ cả. Giá tốt, nên thử!',                                     '2026-03-12 18:30:00+07'),
  (8, 15,18,  4, 'VF 9 rộng rãi cho 7 người, phù hợp đi Hạ Long. Phạm vi 438km đủ cho chuyến đi ngày. Dịch vụ tốt.',                                   '2026-03-16 09:00:00+07'),
  -- TP.HCM reviews
  (13, 8, 31, 5, 'Tesla Model 3 tại Sài Gòn thật tuyệt! Giao xe tận nơi, sạch sẽ, pin đầy. Phù hợp chạy nội đô và cao tốc Long An.',                   '2026-02-11 09:00:00+07'),
  (14, 9, 32, 5, 'Tesla Model S ở Quận 1 — đẳng cấp. Lái thử nguyên ngày Sài Gòn, không tốn xăng, cảm giác như bay. Sẽ thuê dịp kỷ niệm.',              '2026-02-16 10:00:00+07'),
  (15, 5, 33, 4, 'IONIQ 5 tại Q3 tiện lợi. Đủ rộng cho 4 người đi Vũng Tàu. Sạc DC nhanh lắm. Trừ nửa sao vì giao diện điều hướng hơi lag.',           '2026-02-20 19:00:00+07'),
  (16,13, 34, 5, 'Lucid Air Pure — thiếu từ để tả. Êm tuyệt đối, cabin sang hơn Mercedes. Chắc chắn thuê lại mỗi lần tiếp khách VIP.',                  '2026-03-02 10:00:00+07'),
  (17, 1, 35, 4, 'VF e34 ổn cho Q1, dễ đỗ hẻm. Pin hơi yếu cho chuyến dài nhưng đi nội đô đủ dùng cả ngày. Giá hợp lý.',                               '2026-03-05 19:00:00+07'),
  (13, 7, 36, 5, 'VF 8 tại Tân Bình chở cả gia đình 6 người đi Đà Lạt. Cabin rộng, điều hòa mát. Dịch vụ GreenCar chuyên nghiệp, giao nhận tận nơi!',  '2026-03-11 10:00:00+07'),
  (14,11, 37, 5, 'Polestar 2 tại Phú Nhuận — thiết kế Scandinavian tinh tế. Âm thanh trong xe cực hay. Lái Sài Gòn mà không lo kẹt xe vì pin dự phòng.','2026-03-19 10:00:00+07'),
  (15, 3, 38, 4, 'VW ID.4 lái cảm giác chắc chắn. Hệ thống Discover Pro dễ dùng. Sẽ thuê lại cho chuyến Cần Thơ lần tới.',                              '2026-04-01 19:00:00+07');

COMMIT;

-- =============================================================
--  KIỂM TRA NHANH
-- =============================================================
-- SELECT 'roles'           AS tbl, COUNT(*) FROM roles
-- UNION ALL SELECT 'users',           COUNT(*) FROM users
-- UNION ALL SELECT 'locations',       COUNT(*) FROM locations
-- UNION ALL SELECT 'vehicle_models',  COUNT(*) FROM vehicle_models
-- UNION ALL SELECT 'vehicles',        COUNT(*) FROM vehicles
-- UNION ALL SELECT 'vehicle_images',  COUNT(*) FROM vehicle_images
-- UNION ALL SELECT 'vehicle_features',COUNT(*) FROM vehicle_features
-- UNION ALL SELECT 'vehicle_specs',   COUNT(*) FROM vehicle_specs
-- UNION ALL SELECT 'rental_plans',    COUNT(*) FROM rental_plans
-- UNION ALL SELECT 'pricing',         COUNT(*) FROM pricing
-- UNION ALL SELECT 'bookings',        COUNT(*) FROM bookings
-- UNION ALL SELECT 'payments',        COUNT(*) FROM payments
-- UNION ALL SELECT 'reviews',         COUNT(*) FROM reviews;
