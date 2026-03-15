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

func ToVehicleResponses(vehicles []*entities.Vehicle) []*dto.VehicleResponse {
	if vehicles == nil {
		return nil
	}
	out := make([]*dto.VehicleResponse, 0, len(vehicles))
	for _, v := range vehicles {
		out = append(out, ToVehicleResponse(v))
	}
	return out
}

func ToVehicleCreateParams(req *dto.CreateVehicleRequest) entities.Vehicle {
	if req == nil {
		return entities.Vehicle{}
	}
	return entities.Vehicle{
		VehicleModelID: req.ModelID,
		LicensePlate:   req.LicensePlate,
		Status:         req.Status,
		BatteryLevel:   req.BatteryLevel,
		BatteryHealth:  req.BatteryHealth,
		LocationID:     req.LocationID,
	}
}

func ToVehicleUpdateParams(id int, req *dto.UpdateVehicleRequest) entities.Vehicle {
	if req == nil {
		return entities.Vehicle{VehicleID: id}
	}
	return entities.Vehicle{
		VehicleID:      id,
		VehicleModelID: req.ModelID,
		LicensePlate:   req.LicensePlate,
		Status:         req.Status,
		BatteryLevel:   req.BatteryLevel,
		BatteryHealth:  req.BatteryHealth,
		LocationID:     req.LocationID,
	}
}
