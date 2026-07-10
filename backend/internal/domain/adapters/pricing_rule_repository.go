package adapters

import "greencar/internal/domain/entities"

// PricingRuleRepository defines the storage interface for vehicle pricing rules.
type PricingRuleRepository interface {
	ListByVehicleID(vehicleID int) ([]*entities.PricingRule, error)
	Create(rule *entities.PricingRule) error
	Update(rule *entities.PricingRule) error
	Delete(id int) error
}
