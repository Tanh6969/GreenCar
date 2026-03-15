package adapters

import "greencar/internal/domain/entities"

// PricingRepository defines the storage interface for Pricing.
type PricingRepository interface {
	GetByID(id int) (*entities.Pricing, error)
	Create(p *entities.Pricing) error
	Update(p *entities.Pricing) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.Pricing, error)
}
