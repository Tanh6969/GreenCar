-- Migration: Update Pricing Rules for Promotional Dates
-- Run this against your PostgreSQL database

ALTER TABLE vehicle_pricing_rules ADD COLUMN IF NOT EXISTS promo_start_date DATE;
ALTER TABLE vehicle_pricing_rules ADD COLUMN IF NOT EXISTS promo_end_date DATE;
