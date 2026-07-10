-- Migration: Flexible Pricing Rules + Owner Approval Flow
-- Run this against your PostgreSQL database

-- 1. Pricing rules table for each vehicle
CREATE TABLE IF NOT EXISTS vehicle_pricing_rules (
    id              SERIAL PRIMARY KEY,
    vehicle_id      INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    rule_type       VARCHAR(50) NOT NULL, -- 'weekend', 'multi_day'
    discount_percent NUMERIC(5,2) DEFAULT 0,  -- % giảm giá (dương = giảm, âm = tăng)
    extra_percent   NUMERIC(5,2) DEFAULT 0,   -- % tăng giá (cuối tuần)
    min_days        INT DEFAULT 0,            -- áp dụng từ bao nhiêu ngày (cho multi_day)
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add owner_note to bookings for rejection reason
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS owner_note TEXT;

-- Example seed data (optional)
-- INSERT INTO vehicle_pricing_rules (vehicle_id, rule_type, extra_percent, min_days) VALUES (1, 'weekend', 15, 0);
-- INSERT INTO vehicle_pricing_rules (vehicle_id, rule_type, discount_percent, min_days) VALUES (1, 'multi_day', 10, 3);
