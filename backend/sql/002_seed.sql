-- Seed data for GreenCar database
-- Insert roles
INSERT INTO roles (role_name) VALUES ('admin') ON CONFLICT DO NOTHING;
INSERT INTO roles (role_name) VALUES ('customer') ON CONFLICT DO NOTHING;

-- Insert admin user (password: admin123 hashed with bcrypt)
INSERT INTO users (name, email, password, phone, license_no, role_id, created_at) 
VALUES (
  'Admin User',
  'admin@greencar.vn',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvQOm', -- bcrypt hash of 'admin123'
  '+84901234567',
  'A123456',
  1,
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert customer user (password: customer123 hashed with bcrypt)
INSERT INTO users (name, email, password, phone, license_no, role_id, created_at) 
VALUES (
  'Customer User',
  'customer@greencar.vn',
  '$2a$10$slYQmyNdGzin7olVN3p5.OPST9/PgBkqquzi.Ss8MCUgVLAqWbKFm', -- bcrypt hash of 'customer123'
  '+84902345678',
  'B456789',
  2,
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample location
INSERT INTO locations (name, address, city, latitude, longitude) 
VALUES ('Downtown Hub', '123 Main St', 'Ho Chi Minh', 10.7769, 106.6869) ON CONFLICT DO NOTHING;

-- Insert sample rental plans
INSERT INTO rental_plans (name, duration_type, max_km, overtime_price, over_km_price) 
VALUES ('Hourly', 'hour', 50, 25000, 5000) ON CONFLICT DO NOTHING;
INSERT INTO rental_plans (name, duration_type, max_km, overtime_price, over_km_price) 
VALUES ('Daily', 'day', 300, 100000, 3000) ON CONFLICT DO NOTHING;
INSERT INTO rental_plans (name, duration_type, max_km, overtime_price, over_km_price) 
VALUES ('Weekly', 'week', 2000, 400000, 2500) ON CONFLICT DO NOTHING;
