package service

import (
	"time"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

// PricingRuleService handles flexible pricing logic.
type PricingRuleService struct {
	repo adapters.PricingRuleRepository
}

func NewPricingRuleService(repo adapters.PricingRuleRepository) *PricingRuleService {
	return &PricingRuleService{repo: repo}
}

func (s *PricingRuleService) ListRules(vehicleID int) ([]*entities.PricingRule, error) {
	return s.repo.ListByVehicleID(vehicleID)
}

func (s *PricingRuleService) CreateRule(rule *entities.PricingRule) error {
	return s.repo.Create(rule)
}

func (s *PricingRuleService) UpdateRule(rule *entities.PricingRule) error {
	return s.repo.Update(rule)
}

func (s *PricingRuleService) DeleteRule(id int) error {
	return s.repo.Delete(id)
}

// CalculateAdjustedPrice applies pricing rules to a base price.
// basePrice is the full rental price before adjustments.
// Returns the final adjusted price.
func (s *PricingRuleService) CalculateAdjustedPrice(vehicleID int, basePrice float64, start, end time.Time) (float64, []string, error) {
	rules, err := s.repo.ListByVehicleID(vehicleID)
	if err != nil {
		return basePrice, nil, err
	}

	days := int(end.Sub(start).Hours()/24) + 1
	finalPrice := basePrice
	var appliedRules []string

	for _, rule := range rules {
		if !rule.IsActive {
			continue
		}
		switch rule.RuleType {
		case "weekend":
			// Count weekend days in the rental period
			weekendDays := countWeekendDays(start, end)
			weekdayDays := days - weekendDays
			if weekendDays > 0 && rule.ExtraPercent > 0 {
				// Recalculate: split price by day, charge extra on weekends
				pricePerDay := basePrice / float64(days)
				weekdayTotal := pricePerDay * float64(weekdayDays)
				weekendTotal := pricePerDay * float64(weekendDays) * (1 + rule.ExtraPercent/100)
				finalPrice = weekdayTotal + weekendTotal
				appliedRules = append(appliedRules, "Giá cuối tuần")
			}
		case "multi_day", "promo":
			if rule.PromoStartDate != nil && rule.PromoEndDate != nil && rule.DiscountPercent > 0 {
				// Check if the rental period overlaps with the promo period
				promoStart := *rule.PromoStartDate
				promoEnd := *rule.PromoEndDate
				// Add 23:59:59 to promoEnd to include the whole day
				promoEnd = promoEnd.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

				// Calculate overlapping days
				overlapStart := start
				if promoStart.After(overlapStart) {
					overlapStart = promoStart
				}
				overlapEnd := end
				if promoEnd.Before(overlapEnd) {
					overlapEnd = promoEnd
				}

				if !overlapStart.After(overlapEnd) {
					// There is an overlap
					overlapDays := int(overlapEnd.Sub(overlapStart).Hours()/24) + 1
					if overlapDays > 0 {
						pricePerDay := finalPrice / float64(days)
						promoTotal := pricePerDay * float64(overlapDays) * (1 - rule.DiscountPercent/100)
						normalTotal := pricePerDay * float64(days-overlapDays)
						finalPrice = normalTotal + promoTotal
						appliedRules = append(appliedRules, "Khuyến mãi theo khung giờ")
					}
				}
			} else if days >= rule.MinDays && rule.DiscountPercent > 0 && rule.MinDays > 0 {
				finalPrice = finalPrice * (1 - rule.DiscountPercent/100)
				appliedRules = append(appliedRules, "Giảm giá thuê nhiều ngày")
			}
		}
	}

	return finalPrice, appliedRules, nil
}

// countWeekendDays counts Saturday and Sunday between start and end (inclusive).
func countWeekendDays(start, end time.Time) int {
	count := 0
	cur := start.Truncate(24 * time.Hour)
	endDay := end.Truncate(24 * time.Hour)
	for !cur.After(endDay) {
		wd := cur.Weekday()
		if wd == time.Saturday || wd == time.Sunday {
			count++
		}
		cur = cur.Add(24 * time.Hour)
	}
	return count
}
