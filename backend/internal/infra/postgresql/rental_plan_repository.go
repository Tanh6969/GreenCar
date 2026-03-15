package repository

import (
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// RentalPlanRepository defines operations on rental_plans.
type RentalPlanRepository interface {
	GetByID(id int) (*entities.RentalPlan, error)
	Create(p *entities.RentalPlan) error
}

type rentalPlanRepository struct {
	db *database.DB
}

// NewRentalPlanRepository creates a new rental plan repository.
func NewRentalPlanRepository(db *database.DB) RentalPlanRepository {
	return &rentalPlanRepository{db: db}
}

func (r *rentalPlanRepository) GetByID(id int) (*entities.RentalPlan, error) {
	var p domain.RentalPlan
	err := r.db.QueryRow(`SELECT rental_plan_id, name, duration_type, max_km, overtime_price, over_km_price FROM rental_plans WHERE rental_plan_id = $1`, id).
		Scan(&p.RentalPlanID, &p.Name, &p.DurationType, &p.MaxKM, &p.OvertimePrice, &p.OverKMPrice)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *rentalPlanRepository) Create(p *entities.RentalPlan) error {
	return r.db.QueryRow(`INSERT INTO rental_plans (name, duration_type, max_km, overtime_price, over_km_price) VALUES ($1, $2, $3, $4, $5) RETURNING rental_plan_id`,
		p.Name, p.DurationType, p.MaxKM, p.OvertimePrice, p.OverKMPrice).Scan(&p.RentalPlanID)
}
