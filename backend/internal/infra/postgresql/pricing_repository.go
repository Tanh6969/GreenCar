package repository

import (
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// PricingRepository defines operations on pricing.
type PricingRepository interface {
	GetByID(id int) (*entities.Pricing, error)
	Create(p *entities.Pricing) error
}

type pricingRepository struct {
	db *database.DB
}

// NewPricingRepository creates a new pricing repository.
func NewPricingRepository(db *database.DB) PricingRepository {
	return &pricingRepository{db: db}
}

func (r *pricingRepository) GetByID(id int) (*entities.Pricing, error) {
	var p entities.Pricing
	err := r.db.QueryRow(`SELECT pricing_id, vehicle_model_id, rental_plan_id, price FROM pricing WHERE pricing_id = $1`, id).
		Scan(&p.PricingID, &p.VehicleModelID, &p.RentalPlanID, &p.Price)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *pricingRepository) Create(p *entities.Pricing) error {
	return r.db.QueryRow(`INSERT INTO pricing (vehicle_model_id, rental_plan_id, price) VALUES ($1, $2, $3) RETURNING pricing_id`,
		p.VehicleModelID, p.RentalPlanID, p.Price).Scan(&p.PricingID)
}
