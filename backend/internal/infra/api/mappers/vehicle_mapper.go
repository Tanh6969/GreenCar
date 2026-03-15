package mappers

import (
	"greencar/internal/domain/entities"
	"greencar/internal/infra/api/dto"
)

func ToVehicleResponse(v *entities.Vehicle) *dto.VehicleResponse {
	if v == nil {
		return nil
	}
	return &dto.VehicleResponse{
		ID:            v.VehicleID,
		ModelID:       v.VehicleModelID,
		LicensePlate:  v.LicensePlate,
		Status:        v.Status,
		BatteryLevel:  v.BatteryLevel,
		BatteryHealth: v.BatteryHealth,
		LocationID:    v.LocationID,
	}
}
