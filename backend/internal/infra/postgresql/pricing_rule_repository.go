package repository

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type pricingRuleRepository struct {
	db *database.DB
}

func NewPricingRuleRepository(db *database.DB) adapters.PricingRuleRepository {
	return &pricingRuleRepository{db: db}
}

func (r *pricingRuleRepository) ListByVehicleID(vehicleID int) ([]*entities.PricingRule, error) {
	rows, err := r.db.Query(
		`SELECT id, vehicle_id, rule_type, discount_percent, extra_percent, min_days, is_active, promo_start_date, promo_end_date
		 FROM vehicle_pricing_rules WHERE vehicle_id = $1 ORDER BY id`,
		vehicleID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rules []*entities.PricingRule
	for rows.Next() {
		var rule entities.PricingRule
		if err := rows.Scan(&rule.ID, &rule.VehicleID, &rule.RuleType, &rule.DiscountPercent, &rule.ExtraPercent, &rule.MinDays, &rule.IsActive, &rule.PromoStartDate, &rule.PromoEndDate); err != nil {
			return nil, err
		}
		rules = append(rules, &rule)
	}
	return rules, nil
}

func (r *pricingRuleRepository) Create(rule *entities.PricingRule) error {
	return r.db.QueryRow(
		`INSERT INTO vehicle_pricing_rules (vehicle_id, rule_type, discount_percent, extra_percent, min_days, is_active, promo_start_date, promo_end_date)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
		rule.VehicleID, rule.RuleType, rule.DiscountPercent, rule.ExtraPercent, rule.MinDays, rule.IsActive, rule.PromoStartDate, rule.PromoEndDate,
	).Scan(&rule.ID)
}

func (r *pricingRuleRepository) Update(rule *entities.PricingRule) error {
	_, err := r.db.Exec(
		`UPDATE vehicle_pricing_rules SET rule_type=$1, discount_percent=$2, extra_percent=$3, min_days=$4, is_active=$5, promo_start_date=$6, promo_end_date=$7 WHERE id=$8`,
		rule.RuleType, rule.DiscountPercent, rule.ExtraPercent, rule.MinDays, rule.IsActive, rule.PromoStartDate, rule.PromoEndDate, rule.ID,
	)
	return err
}

func (r *pricingRuleRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM vehicle_pricing_rules WHERE id = $1`, id)
	return err
}
