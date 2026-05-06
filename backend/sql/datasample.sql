-- ============================================================
--  GreenCar — SAMPLE DATA (datasample.sql)
--  Khớp 100% với frontend mockData.ts
--  Chạy sau 001_schema.sql
--  Tất cả mật khẩu mẫu = 'greencar123'
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ROLES
-- ────────────────────────────────────────────────────────────
INSERT INTO roles (role_id, role_name) OVERRIDING SYSTEM VALUE VALUES
  (1, 'admin'),
  (2, 'customer')
ON CONFLICT (role_name) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 2. USERS  (bcrypt hash of 'greencar123')
-- ────────────────────────────────────────────────────────────
INSERT INTO users (user_id, name, email, password, phone, license_no, role_id, created_at) OVERRIDING SYSTEM VALUE VALUES
  (1,  'Admin GreenCar',    'admin@greencar.vn',         '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0900000001', 'B2-ADMIN01',  1, '2026-01-01 08:00:00'),
  (2,  'Nguyễn Văn An',     'nguyenvanan@gmail.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234501', 'B2-023451',   2, '2026-01-10 09:15:00'),
  (3,  'Trần Thị Bình',     'tranthib@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234502', 'B2-023452',   2, '2026-01-12 10:30:00'),
  (4,  'Lê Hoàng Cường',    'lehcuong@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234503', 'B2-023453',   2, '2026-01-15 14:00:00'),
  (5,  'Phạm Minh Dũng',    'pminhd@gmail.com',          '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234504', 'B2-023454',   2, '2026-01-20 08:45:00'),
  (6,  'Hoàng Thị Lan',     'hthilan@gmail.com',         '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234505', 'B2-023455',   2, '2026-02-01 11:00:00'),
  (7,  'Vũ Đức Mạnh',       'vdmanh@gmail.com',          '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234506', 'B2-023456',   2, '2026-02-05 16:20:00'),
  (8,  'Đặng Thị Nga',       'dtnga@gmail.com',           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234507', 'B2-023457',   2, '2026-02-10 09:00:00'),
  (9,  'Bùi Quang Hải',     'bqhai@gmail.com',           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234508', 'B2-023458',   2, '2026-02-15 13:30:00'),
  (10, 'Ngô Thị Hương',     'nthhuong@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234509', 'B2-023459',   2, '2026-02-20 10:15:00'),
  (11, 'Đinh Văn Khoa',     'dvkhoa@gmail.com',          '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234510', 'B2-023460',   2, '2026-03-01 08:00:00'),
  (12, 'Lý Thị Mai',        'ltmai@gmail.com',           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234511', 'B2-023461',   2, '2026-03-05 14:45:00')
ON CONFLICT (email) DO NOTHING;

SELECT setval('users_user_id_seq', 12);

-- ────────────────────────────────────────────────────────────
-- 3. LOCATIONS (7 quận Hà Nội)
-- ────────────────────────────────────────────────────────────
INSERT INTO locations (location_id, name, address, city, latitude, longitude) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Ba Đình',    '128 Đội Cấn, Ba Đình',          'Hà Nội', 21.033, 105.814),
  (2, 'Đống Đa',   '45 Nguyễn Lương Bằng, Đống Đa', 'Hà Nội', 21.018, 105.829),
  (3, 'Cầu Giấy',  '99 Xuân Thủy, Cầu Giấy',        'Hà Nội', 21.036, 105.790),
  (4, 'Tây Hồ',    '12 Đặng Thai Mai, Tây Hồ',      'Hà Nội', 21.058, 105.823),
  (5, 'Thanh Xuân','67 Nguyễn Trãi, Thanh Xuân',    'Hà Nội', 20.995, 105.815),
  (6, 'Hoàng Mai', '230 Giải Phóng, Hoàng Mai',     'Hà Nội', 20.978, 105.842),
  (7, 'Long Biên', '15 Ngô Gia Tự, Long Biên',      'Hà Nội', 21.040, 105.882)
ON CONFLICT DO NOTHING;

SELECT setval('locations_location_id_seq', 7);

-- ────────────────────────────────────────────────────────────
-- 4. VEHICLE MODELS (15 mẫu)
-- ────────────────────────────────────────────────────────────
INSERT INTO vehicle_models (vehicle_model_id, name, brand, seats, horsepower, range_km, trunk_capacity, airbags, vehicle_type, transmission) OVERRIDING SYSTEM VALUE VALUES
  -- Phổ thông
  (1,  'VF e34',     'VinFast',  5, 147, 300,  290,  6, 'SUV',      'Số tự động'),
  (2,  'Accent EV',  'Hyundai',  5, 115, 420,  387,  4, 'Sedan',    'Số tự động'),
  (3,  'ID.4',       'VW',       5, 204, 520,  543,  9, 'SUV',      'Số tự động'),
  (4,  'Mach-E',     'Ford',     5, 269, 480,  402,  7, 'SUV',      'Số tự động'),
  (5,  'IONIQ 5',    'Hyundai',  5, 225, 451,  527,  6, 'Crossover','Số tự động'),
  (6,  'IONIQ 6',    'Hyundai',  5, 239, 614,  401,  7, 'Sedan',    'Số tự động'),
  (7,  'VF 8',       'VinFast',  7, 402, 400,  376,  8, 'SUV',      'Số tự động'),
  (8,  'Model 3',    'Tesla',    5, 283, 491,  561,  8, 'Sedan',    'Số tự động'),
  -- Cao cấp
  (9,  'Model S',    'Tesla',    5, 670, 652,  793,  8, 'Sedan',    'Số tự động'),
  (10, 'Model X',    'Tesla',    7, 670, 576, 1022,  8, 'SUV',      'Số tự động'),
  (11, 'Polestar 2', 'Polestar', 5, 476, 540,  405,  8, 'Fastback', 'Số tự động'),
  (12, 'e-tron GT',  'Audi',     5, 530, 488,  405,  9, 'Sedan',    'Số tự động'),
  (13, 'Air Pure',   'Lucid',    5, 430, 660,  739,  8, 'Sedan',    'Số tự động'),
  (14, 'R1S',        'Rivian',   7, 835, 505,  495,  8, 'SUV',      'Số tự động'),
  (15, 'VF 9',       'VinFast',  7, 402, 438,  585,  8, 'SUV',      'Số tự động')
ON CONFLICT DO NOTHING;

SELECT setval('vehicle_models_vehicle_model_id_seq', 15);

-- ────────────────────────────────────────────────────────────
-- 5. VEHICLES (22 xe)
-- ────────────────────────────────────────────────────────────
INSERT INTO vehicles (vehicle_id, vehicle_model_id, license_plate, status, battery_level, battery_health, location_id) OVERRIDING SYSTEM VALUE VALUES
  -- VinFast VF e34
  (1,  1,  '30H-99901', 'available',    86,  95, 1),
  (2,  1,  '30H-99902', 'available',    92,  98, 3),
  -- Hyundai Accent EV
  (3,  2,  '30A-12301', 'available',   100, 100, 1),
  (4,  2,  '30A-12302', 'available',    78,  93, 5),
  -- VW ID.4
  (5,  3,  '30K-11101', 'available',   100, 100, 2),
  (6,  3,  '30K-11102', 'available',    95,  99, 4),
  -- Ford Mach-E
  (7,  4,  '30F-55501', 'available',    88,  96, 3),
  (8,  4,  '30F-55502', 'booked',      100, 100, 6),
  -- Hyundai IONIQ 5
  (9,  5,  '30E-77701', 'available',   100, 100, 2),
  (10, 5,  '30E-77702', 'available',    90,  97, 7),
  -- Hyundai IONIQ 6
  (11, 6,  '30E-88801', 'available',   100, 100, 1),
  -- VinFast VF 8
  (12, 7,  '30H-44401', 'available',    95,  99, 3),
  (13, 7,  '30H-44402', 'available',    82,  94, 5),
  -- Tesla Model 3
  (14, 8,  '30T-33301', 'available',   100, 100, 4),
  (15, 8,  '30T-33302', 'available',    97, 100, 2),
  -- Tesla Model S
  (16, 9,  '30T-99901', 'available',   100, 100, 1),
  -- Tesla Model X
  (17, 10, '30T-99902', 'available',   100, 100, 4),
  -- Polestar 2
  (18, 11, '30P-22201', 'available',    96, 100, 3),
  -- Audi e-tron GT
  (19, 12, '30D-66601', 'available',   100, 100, 1),
  -- Lucid Air Pure
  (20, 13, '30L-11101', 'available',   100, 100, 2),
  -- Rivian R1S
  (21, 14, '30R-55501', 'maintenance',  98, 100, 7),
  -- VinFast VF 9
  (22, 15, '30H-44501', 'available',   100, 100, 6)
ON CONFLICT DO NOTHING;

SELECT setval('vehicles_vehicle_id_seq', 22);

-- ────────────────────────────────────────────────────────────
-- 6. VEHICLE IMAGES
-- ────────────────────────────────────────────────────────────
INSERT INTO vehicle_images (image_id, vehicle_model_id, image_url) OVERRIDING SYSTEM VALUE VALUES
  (1,  1,  'https://images.unsplash.com/photo-1617531653520-4893f7db7a15?auto=format&fit=crop&w=900&q=80'),
  (2,  2,  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80'),
  (3,  3,  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80'),
  (4,  4,  'https://images.unsplash.com/photo-1624623278313-a930126a11c3?auto=format&fit=crop&w=900&q=80'),
  (5,  5,  'https://images.unsplash.com/photo-1719581597814-b9e88db5ac9d?auto=format&fit=crop&w=900&q=80'),
  (6,  6,  'https://images.unsplash.com/photo-1680093661316-5a7e94ccbf37?auto=format&fit=crop&w=900&q=80'),
  (7,  7,  'https://images.unsplash.com/photo-1617531653320-4cdb88e42ee9?auto=format&fit=crop&w=900&q=80'),
  (8,  8,  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80'),
  (9,  9,  'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=900&q=80'),
  (10, 10, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80'),
  (11, 11, 'https://images.unsplash.com/photo-1646768914119-4ccada7a9f15?auto=format&fit=crop&w=900&q=80'),
  (12, 12, 'https://images.unsplash.com/photo-1614026480418-bd11fdb9fa06?auto=format&fit=crop&w=900&q=80'),
  (13, 13, 'https://images.unsplash.com/photo-1626668011686-8b0cff2ec33f?auto=format&fit=crop&w=900&q=80'),
  (14, 14, 'https://images.unsplash.com/photo-1647531038523-84b9f4d399bf?auto=format&fit=crop&w=900&q=80'),
  (15, 15, 'https://images.unsplash.com/photo-1617531653320-4cdb88e42ee9?auto=format&fit=crop&w=900&q=80')
ON CONFLICT DO NOTHING;

SELECT setval('vehicle_images_image_id_seq', 15);

-- ────────────────────────────────────────────────────────────
-- 7. VEHICLE FEATURES
-- ────────────────────────────────────────────────────────────
INSERT INTO vehicle_features (feature_id, feature_name) OVERRIDING SYSTEM VALUE VALUES
  (1,  'Camera 360°'),
  (2,  'Cruise Control'),
  (3,  'Màn hình lớn'),
  (4,  'Autopilot'),
  (5,  'Sạc nhanh DC'),
  (6,  'Cửa sổ trời'),
  (7,  'Ghế sưởi'),
  (8,  'Đỗ xe tự động'),
  (9,  'Hệ thống âm thanh premium'),
  (10, 'AWD')
ON CONFLICT DO NOTHING;

SELECT setval('vehicle_features_feature_id_seq', 10);

-- ────────────────────────────────────────────────────────────
-- 8. VEHICLE MODEL FEATURES (mapping)
-- ────────────────────────────────────────────────────────────
INSERT INTO vehicle_model_features (vehicle_model_id, feature_id) VALUES
  (1,  1), (1,  3),
  (2,  2), (2,  3),
  (3,  5), (3,  10),
  (4,  1), (4,  6),
  (5,  5), (5,  10), (5,  6),
  (6,  5), (6,  3),
  (7,  1), (7,  7),  (7,  10),
  (8,  4), (8,  5),  (8,  3),
  (9,  4), (9,  8),  (9,  9),
  (10, 4), (10, 8),  (10, 6),
  (11, 10),(11, 9),  (11, 7),
  (12, 9), (12, 7),  (12, 8),
  (13, 5), (13, 9),  (13, 6),
  (14, 10),(14, 1),  (14, 5),
  (15, 1), (15, 6),  (15, 10)
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 9. VEHICLE SPECS
-- ────────────────────────────────────────────────────────────
INSERT INTO vehicle_specs (spec_id, vehicle_model_id, spec_name, spec_value) OVERRIDING SYSTEM VALUE VALUES
  (1,  1,  'Pin',        '42 kWh'),
  (2,  1,  'Tăng tốc',   '0–100 trong 9.4s'),
  (3,  2,  'Pin',        '38 kWh'),
  (4,  2,  'Tăng tốc',   '0–100 trong 10.2s'),
  (5,  3,  'Pin',        '77 kWh'),
  (6,  3,  'Tăng tốc',   '0–100 trong 8.5s'),
  (7,  4,  'Pin',        '75.7 kWh'),
  (8,  4,  'Tăng tốc',   '0–100 trong 5.1s'),
  (9,  5,  'Pin',        '77.4 kWh'),
  (10, 5,  'Tăng tốc',   '0–100 trong 5.1s'),
  (11, 6,  'Pin',        '77.4 kWh'),
  (12, 6,  'Tăng tốc',   '0–100 trong 5.1s'),
  (13, 7,  'Pin',        '87.7 kWh'),
  (14, 7,  'Tăng tốc',   '0–100 trong 5.5s'),
  (15, 8,  'Pin',        '82 kWh'),
  (16, 8,  'Tăng tốc',   '0–100 trong 6.1s'),
  (17, 9,  'Pin',        '100 kWh'),
  (18, 9,  'Tăng tốc',   '0–100 trong 2.1s'),
  (19, 10, 'Pin',        '100 kWh'),
  (20, 10, 'Tăng tốc',   '0–100 trong 2.6s'),
  (21, 11, 'Pin',        '78 kWh'),
  (22, 11, 'Tăng tốc',   '0–100 trong 4.2s'),
  (23, 12, 'Pin',        '93.4 kWh'),
  (24, 12, 'Tăng tốc',   '0–100 trong 4.1s'),
  (25, 13, 'Pin',        '112 kWh'),
  (26, 13, 'Tăng tốc',   '0–100 trong 3.8s'),
  (27, 14, 'Pin',        '135 kWh'),
  (28, 14, 'Tăng tốc',   '0–100 trong 3.0s'),
  (29, 15, 'Pin',        '87.7 kWh'),
  (30, 15, 'Tăng tốc',   '0–100 trong 5.5s')
ON CONFLICT DO NOTHING;

SELECT setval('vehicle_specs_spec_id_seq', 30);

-- ────────────────────────────────────────────────────────────
-- 10. RENTAL PLANS
-- ────────────────────────────────────────────────────────────
INSERT INTO rental_plans (rental_plan_id, name, duration_type, max_km, overtime_price, over_km_price) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Gói 4h',  'hour', 150, 150000, 3000),
  (2, 'Gói 8h',  'hour', 250, 150000, 3000),
  (3, 'Gói 24h', 'day',  400, 150000, 3000)
ON CONFLICT DO NOTHING;

SELECT setval('rental_plans_rental_plan_id_seq', 3);

-- ────────────────────────────────────────────────────────────
-- 11. PRICING (15 model × 3 gói = 45 bản ghi)
-- ────────────────────────────────────────────────────────────
INSERT INTO pricing (pricing_id, vehicle_model_id, rental_plan_id, price) OVERRIDING SYSTEM VALUE VALUES
  -- VF e34
  (1,  1,  1,  430000),  (2,  1,  2,  650000),  (3,  1,  3,  860000),
  -- Hyundai Accent EV
  (4,  2,  1,  380000),  (5,  2,  2,  600000),  (6,  2,  3,  780000),
  -- VW ID.4
  (7,  3,  1,  520000),  (8,  3,  2,  820000),  (9,  3,  3, 1050000),
  -- Ford Mach-E
  (10, 4,  1,  580000),  (11, 4,  2,  900000),  (12, 4,  3, 1150000),
  -- Hyundai IONIQ 5
  (13, 5,  1,  550000),  (14, 5,  2,  860000),  (15, 5,  3, 1100000),
  -- Hyundai IONIQ 6
  (16, 6,  1,  600000),  (17, 6,  2,  950000),  (18, 6,  3, 1200000),
  -- VinFast VF 8
  (19, 7,  1,  650000),  (20, 7,  2, 1000000),  (21, 7,  3, 1300000),
  -- Tesla Model 3
  (22, 8,  1,  750000),  (23, 8,  2, 1150000),  (24, 8,  3, 1500000),
  -- Tesla Model S
  (25, 9,  1, 1200000),  (26, 9,  2, 1900000),  (27, 9,  3, 2500000),
  -- Tesla Model X
  (28, 10, 1, 1300000),  (29, 10, 2, 2050000),  (30, 10, 3, 2800000),
  -- Polestar 2
  (31, 11, 1, 1000000),  (32, 11, 2, 1550000),  (33, 11, 3, 2000000),
  -- Audi e-tron GT
  (34, 12, 1, 1400000),  (35, 12, 2, 2200000),  (36, 12, 3, 3200000),
  -- Lucid Air Pure
  (37, 13, 1, 1500000),  (38, 13, 2, 2400000),  (39, 13, 3, 3500000),
  -- Rivian R1S
  (40, 14, 1, 1600000),  (41, 14, 2, 2600000),  (42, 14, 3, 4200000),
  -- VinFast VF 9
  (43, 15, 1,  900000),  (44, 15, 2, 1400000),  (45, 15, 3, 1800000)
ON CONFLICT DO NOTHING;

SELECT setval('pricing_pricing_id_seq', 45);

-- ────────────────────────────────────────────────────────────
-- 12. BOOKINGS (30 đơn — đa dạng trạng thái)
-- ────────────────────────────────────────────────────────────
INSERT INTO bookings (
  booking_id, user_id, vehicle_id, rental_plan_id,
  start_time, end_time,
  actual_start_time, actual_end_time,
  planned_km, actual_km,
  deposit_amount, overtime_fee, over_km_fee, total_price,
  status, payment_method, created_at
) OVERRIDING SYSTEM VALUE VALUES

-- ── completed (đã hoàn thành) ──────────────────────────────
(1,  2, 14, 3, '2026-02-01 08:00+07', '2026-02-02 08:00+07', '2026-02-01 08:05+07', '2026-02-02 07:50+07', 400, 312, 300000, 0,      0,      1500000, 'completed', 'transfer', '2026-01-30 15:20:00+07'),
(2,  3,  9, 3, '2026-02-03 09:00+07', '2026-02-04 09:00+07', '2026-02-03 09:10+07', '2026-02-04 09:05+07', 400, 398, 220000, 0,      0,      1100000, 'completed', 'transfer', '2026-02-02 11:00:00+07'),
(3,  4,  5, 2, '2026-02-05 10:00+07', '2026-02-05 18:00+07', '2026-02-05 10:02+07', '2026-02-05 18:45+07', 250, 241, 165000, 112500, 0,      932500,  'completed', 'cod',      '2026-02-04 09:30:00+07'),
(4,  5, 16, 3, '2026-02-08 08:00+07', '2026-02-09 08:00+07', '2026-02-08 08:00+07', '2026-02-09 08:30+07', 400, 425, 500000, 75000,  75000,  2650000, 'completed', 'transfer', '2026-02-07 14:00:00+07'),
(5,  6,  3, 1, '2026-02-10 14:00+07', '2026-02-10 18:00+07', '2026-02-10 14:00+07', '2026-02-10 17:55+07', 150, 132, 78000,  0,      0,      780000,  'completed', 'cod',      '2026-02-10 12:30:00+07'),
(6,  7, 15, 3, '2026-02-12 08:00+07', '2026-02-13 08:00+07', '2026-02-12 08:10+07', '2026-02-13 08:00+07', 400, 387, 300000, 0,      0,      1500000, 'completed', 'transfer', '2026-02-11 16:00:00+07'),
(7,  8, 20, 3, '2026-02-15 09:00+07', '2026-02-16 09:00+07', '2026-02-15 09:00+07', '2026-02-16 09:20+07', 400, 400, 700000, 50000,  0,      3550000, 'completed', 'transfer', '2026-02-14 10:00:00+07'),
(8,  9,  7, 2, '2026-02-18 08:00+07', '2026-02-18 16:00+07', '2026-02-18 08:05+07', '2026-02-18 16:00+07', 250, 208, 180000, 0,      0,      900000,  'completed', 'cod',      '2026-02-17 20:00:00+07'),
(9,  10, 12, 3, '2026-02-20 07:30+07', '2026-02-21 07:30+07', '2026-02-20 07:35+07', '2026-02-21 07:30+07', 400, 355, 260000, 0,      0,      1300000, 'completed', 'transfer', '2026-02-19 08:00:00+07'),
(10, 11, 18, 3, '2026-02-22 10:00+07', '2026-02-23 10:00+07', '2026-02-22 10:05+07', '2026-02-23 10:00+07', 400, 412, 400000, 0,      36000,  2036000, 'completed', 'transfer', '2026-02-21 11:00:00+07'),
(11, 12,  1, 1, '2026-02-25 13:00+07', '2026-02-25 17:00+07', '2026-02-25 13:00+07', '2026-02-25 17:00+07', 150, 120, 86000,  0,      0,      430000,  'completed', 'cod',      '2026-02-25 11:00:00+07'),
(12,  2, 11, 2, '2026-02-27 09:00+07', '2026-02-27 17:00+07', '2026-02-27 09:00+07', '2026-02-27 17:30+07', 250, 235, 190000, 75000,  0,      1025000, 'completed', 'transfer', '2026-02-26 14:00:00+07'),
(13,  3, 19, 3, '2026-03-01 08:00+07', '2026-03-02 08:00+07', '2026-03-01 08:00+07', '2026-03-02 08:10+07', 400, 443, 640000, 25000,  129000, 3354000, 'completed', 'transfer', '2026-02-28 10:00:00+07'),
(14,  4,  4, 3, '2026-03-05 08:00+07', '2026-03-06 08:00+07', '2026-03-05 08:00+07', '2026-03-06 08:00+07', 400, 399, 156000, 0,      0,      780000,  'completed', 'cod',      '2026-03-04 09:00:00+07'),
(15,  5, 17, 3, '2026-03-08 09:00+07', '2026-03-09 09:00+07', '2026-03-08 09:05+07', '2026-03-09 09:00+07', 400, 380, 560000, 0,      0,      2800000, 'completed', 'transfer', '2026-03-07 12:00:00+07'),
(16,  6,  6, 2, '2026-03-10 10:00+07', '2026-03-10 18:00+07', '2026-03-10 10:00+07', '2026-03-10 18:00+07', 250, 197, 164000, 0,      0,      820000,  'completed', 'cod',      '2026-03-09 18:00:00+07'),
(17,  7, 13, 1, '2026-03-12 14:00+07', '2026-03-12 18:00+07', '2026-03-12 14:05+07', '2026-03-12 18:00+07', 150, 148, 130000, 0,      0,      650000,  'completed', 'transfer', '2026-03-12 10:00:00+07'),
(18,  8, 22, 3, '2026-03-15 08:00+07', '2026-03-16 08:00+07', '2026-03-15 08:00+07', '2026-03-16 08:00+07', 400, 401, 360000, 0,      3000,   1803000, 'completed', 'transfer', '2026-03-14 11:00:00+07'),

-- ── confirmed (đã xác nhận, chưa bắt đầu) ─────────────────
(19, 9,  14, 3, '2026-05-07 08:00+07', '2026-05-08 08:00+07', NULL, NULL, 400, NULL, 300000, 0, 0, 1500000, 'confirmed', 'transfer', '2026-05-04 10:00:00+07'),
(20, 10,  9, 2, '2026-05-08 09:00+07', '2026-05-08 17:00+07', NULL, NULL, 250, NULL, 172000, 0, 0,  860000, 'confirmed', 'cod',      '2026-05-04 14:30:00+07'),
(21, 11, 20, 3, '2026-05-10 08:00+07', '2026-05-11 08:00+07', NULL, NULL, 400, NULL, 700000, 0, 0, 3500000, 'confirmed', 'transfer', '2026-05-05 09:00:00+07'),
(22, 12, 16, 3, '2026-05-12 09:00+07', '2026-05-13 09:00+07', NULL, NULL, 400, NULL, 500000, 0, 0, 2500000, 'confirmed', 'transfer', '2026-05-05 10:00:00+07'),

-- ── active (đang thuê) ─────────────────────────────────────
(23, 2,  8, 3, '2026-05-05 08:00+07', '2026-05-06 08:00+07', '2026-05-05 08:05+07', NULL, 400, NULL, 230000, 0, 0, 1150000, 'active', 'transfer', '2026-05-04 18:00:00+07'),
(24, 3, 15, 3, '2026-05-05 09:00+07', '2026-05-06 09:00+07', '2026-05-05 09:10+07', NULL, 400, NULL, 300000, 0, 0, 1500000, 'active', 'cod',      '2026-05-04 20:00:00+07'),

-- ── pending (chờ xác nhận) ─────────────────────────────────
(25, 4,  6, 2, '2026-05-09 10:00+07', '2026-05-09 18:00+07', NULL, NULL, 250, NULL, 164000, 0, 0,  820000, 'pending', 'transfer', '2026-05-05 07:30:00+07'),
(26, 5, 12, 3, '2026-05-10 08:00+07', '2026-05-11 08:00+07', NULL, NULL, 400, NULL, 260000, 0, 0, 1300000, 'pending', 'cod',      '2026-05-05 08:00:00+07'),
(27, 6,  5, 1, '2026-05-08 14:00+07', '2026-05-08 18:00+07', NULL, NULL, 150, NULL, 110000, 0, 0,  550000, 'pending', 'transfer', '2026-05-05 09:15:00+07'),

-- ── cancelled (đã hủy) ─────────────────────────────────────
(28, 7, 14, 3, '2026-03-20 08:00+07', '2026-03-21 08:00+07', NULL, NULL, 400, NULL, 300000, 0, 0, 1500000, 'cancelled', 'transfer', '2026-03-18 10:00:00+07'),
(29, 8,  3, 2, '2026-04-01 09:00+07', '2026-04-01 17:00+07', NULL, NULL, 250, NULL, 120000, 0, 0,  600000, 'cancelled', 'cod',      '2026-03-30 14:00:00+07'),
(30, 9, 18, 1, '2026-04-10 14:00+07', '2026-04-10 18:00+07', NULL, NULL, 150, NULL, 200000, 0, 0, 1000000, 'cancelled', 'transfer', '2026-04-09 11:00:00+07')

ON CONFLICT DO NOTHING;

SELECT setval('bookings_booking_id_seq', 30);

-- ────────────────────────────────────────────────────────────
-- 13. PAYMENTS (cho các booking đã completed/confirmed/active)
-- ────────────────────────────────────────────────────────────
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, paid_at) OVERRIDING SYSTEM VALUE VALUES
  (1,  1,  1500000, 'momo',          'completed', '2026-01-30 15:25:00+07'),
  (2,  2,  1100000, 'vnpay',         'completed', '2026-02-02 11:05:00+07'),
  (3,  3,   932500, 'bank_transfer', 'completed', '2026-02-04 09:35:00+07'),
  (4,  4,  2650000, 'momo',          'completed', '2026-02-07 14:10:00+07'),
  (5,  5,   780000, 'cash',          'completed', '2026-02-10 14:00:00+07'),
  (6,  6,  1500000, 'vnpay',         'completed', '2026-02-11 16:05:00+07'),
  (7,  7,  3550000, 'bank_transfer', 'completed', '2026-02-14 10:10:00+07'),
  (8,  8,   900000, 'momo',          'completed', '2026-02-17 20:05:00+07'),
  (9,  9,  1300000, 'vnpay',         'completed', '2026-02-19 08:10:00+07'),
  (10, 10, 2036000, 'momo',          'completed', '2026-02-21 11:10:00+07'),
  (11, 11,  430000, 'cash',          'completed', '2026-02-25 13:00:00+07'),
  (12, 12, 1025000, 'vnpay',         'completed', '2026-02-26 14:05:00+07'),
  (13, 13, 3354000, 'bank_transfer', 'completed', '2026-02-28 10:10:00+07'),
  (14, 14,  780000, 'momo',          'completed', '2026-03-04 09:05:00+07'),
  (15, 15, 2800000, 'bank_transfer', 'completed', '2026-03-07 12:05:00+07'),
  (16, 16,  820000, 'cash',          'completed', '2026-03-09 18:05:00+07'),
  (17, 17,  650000, 'momo',          'completed', '2026-03-12 10:05:00+07'),
  (18, 18, 1803000, 'vnpay',         'completed', '2026-03-14 11:05:00+07'),
  -- confirmed/active — đặt cọc trước
  (19, 19,  300000, 'momo',          'completed', '2026-05-04 10:05:00+07'),
  (20, 20,  172000, 'vnpay',         'completed', '2026-05-04 14:35:00+07'),
  (21, 21,  700000, 'bank_transfer', 'completed', '2026-05-05 09:05:00+07'),
  (22, 22,  500000, 'momo',          'completed', '2026-05-05 10:05:00+07'),
  (23, 23,  230000, 'vnpay',         'completed', '2026-05-04 18:05:00+07'),
  (24, 24,  300000, 'momo',          'completed', '2026-05-04 20:05:00+07'),
  -- cancelled — hoàn tiền
  (25, 28,  300000, 'momo',          'refunded',  '2026-03-18 10:05:00+07'),
  (26, 29,  120000, 'vnpay',         'refunded',  '2026-03-30 14:05:00+07')
ON CONFLICT DO NOTHING;

SELECT setval('payments_payment_id_seq', 26);

-- ────────────────────────────────────────────────────────────
-- 14. REVIEWS (chỉ booking đã completed, booking_id 1–18)
-- ────────────────────────────────────────────────────────────
INSERT INTO reviews (review_id, user_id, vehicle_model_id, booking_id, rating, comment, created_at) OVERRIDING SYSTEM VALUE VALUES
  (1,  2,  8, 1,  5, 'Tesla Model 3 tuyệt vời, êm ái và tiết kiệm. Nhân viên giao xe đúng giờ, xe sạc đầy 100%. Chắc chắn sẽ thuê lại!',                     '2026-02-02 10:00:00+07'),
  (2,  3,  5, 2,  5, 'IONIQ 5 rộng rãi, công nghệ hiện đại. Sạc nhanh DC cực tiện. Rất ổn cho chuyến đi gia đình.',                                         '2026-02-04 11:00:00+07'),
  (3,  4,  3, 3,  4, 'VW ID.4 lái khá tốt, nội thất rộng. Chỉ tiếc phí giờ vượt hơi cao. Dịch vụ hỗ trợ nhiệt tình.',                                       '2026-02-05 20:00:00+07'),
  (4,  5,  9, 4,  5, 'Tesla Model S sang trọng đỉnh cao. Autopilot hoạt động cực tốt. Xứng đáng với giá tiền. Trải nghiệm không thể quên!',                   '2026-02-09 09:00:00+07'),
  (5,  6,  2, 5,  4, 'Accent EV phù hợp cho việc đi lại trong thành phố. Gọn, dễ đỗ xe. Giá hợp lý.',                                                       '2026-02-10 19:00:00+07'),
  (6,  7,  8, 6,  5, 'Model 3 lái cực sướng, vào cua rất chuẩn. Màn hình 15" siêu đẹp. Sẽ giới thiệu cho bạn bè.',                                          '2026-02-13 09:00:00+07'),
  (7,  8, 13, 7,  5, 'Lucid Air Pure — chiếc xe đẹp nhất tôi từng lái. Yên tĩnh tuyệt đối, nội thất sang trọng. Chắc chắn thuê lại dịp đặc biệt.',           '2026-02-16 10:00:00+07'),
  (8,  9,  4, 8,  4, 'Ford Mach-E mạnh và ổn định. Thiếu điểm vì hệ thống SYNC đôi lúc lag. Nhưng tổng thể rất tốt.',                                       '2026-02-18 17:00:00+07'),
  (9,  10, 7, 9,  5, 'VF 8 rộng rãi, chở được nhiều người. Giá tốt nhất trong tầm phổ thông. Hài lòng 100%.',                                                '2026-02-21 08:00:00+07'),
  (10, 11, 11,10, 5, 'Polestar 2 thiết kế đẹp xuất sắc, âm thanh Harman Kardon cực hay. Xe Thụy Điển chất lượng Châu Âu thực sự.',                          '2026-02-23 11:00:00+07'),
  (11, 12, 1, 11, 4, 'VF e34 tiện cho đường phố Hà Nội, dễ lái. Pin 42kWh đủ dùng nửa ngày. Giao diện hơi khó dùng.',                                        '2026-02-25 18:00:00+07'),
  (12, 2,  6, 12, 5, 'IONIQ 6 đẹp như máy bay, rất khí động học. Phạm vi 614km là vô địch phân khúc. Thuê lại ngay!',                                        '2026-02-27 18:00:00+07'),
  (13, 3, 12, 13, 5, 'Audi e-tron GT — đỉnh nhất. Khoang hành khách cao cấp như xe sang Đức. Khẳng định đẳng cấp khi đi đón đối tác.',                       '2026-03-02 09:00:00+07'),
  (14, 4,  2, 14, 3, 'Accent EV ổn cho ngân sách. Xe còn mới nhưng cabin ồn khi chạy cao tốc. Phù hợp đi nội đô.',                                           '2026-03-06 09:00:00+07'),
  (15, 5, 10, 15, 5, 'Tesla Model X cửa cánh chim cực ngầu. 7 chỗ rộng rãi, phù hợp đưa cả gia đình đi du lịch. Tuyệt vời!',                               '2026-03-09 10:00:00+07'),
  (16, 6,  3, 16, 4, 'ID.4 lái thoải mái, cảm giác lái tốt. Giao diện Volkswagen hơi phức tạp lúc đầu nhưng quen rồi ổn.',                                   '2026-03-10 19:00:00+07'),
  (17, 7,  7, 17, 5, 'VF 8 7 chỗ rất tiện cho cả nhóm bạn. Lái mượt, màn hình lớn, cảm biến đủ cả. Giá tốt, nên thử!',                                      '2026-03-12 18:30:00+07'),
  (18, 8, 15, 18, 4, 'VF 9 rộng rãi cho 7 người, phù hợp đi Hạ Long. Phạm vi 438km đủ cho chuyến đi ngày. Dịch vụ tốt.', '2026-03-16 09:00:00+07')
ON CONFLICT (booking_id) DO NOTHING;

SELECT setval('reviews_review_id_seq', 18);

-- ────────────────────────────────────────────────────────────
-- DONE ✓
-- ────────────────────────────────────────────────────────────
