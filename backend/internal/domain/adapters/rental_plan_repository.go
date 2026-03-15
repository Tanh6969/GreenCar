package adapters

import "greencar/internal/domain/entities"

// RentalPlanRepository defines the storage interface for RentalPlan.
type RentalPlanRepository interface {
	GetByID(id int) (*entities.RentalPlan, error)
	Create(rp *entities.RentalPlan) error
	Update(rp *entities.RentalPlan) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.RentalPlan, error)
}
