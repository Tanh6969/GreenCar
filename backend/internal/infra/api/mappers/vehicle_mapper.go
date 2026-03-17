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

func ToVehicleDetailResponse(detail *entities.VehicleDetail) *dto.VehicleDetailResponse {
	if detail == nil {
		return nil
	}

	return &dto.VehicleDetailResponse{
		Vehicle:  ToVehicleResponse(detail.Vehicle),
		Model:    toVehicleModelResponse(detail.Model),
		Location: toLocationResponse(detail.Location),
		Images:   toVehicleImageResponses(detail.Images),
		Specs:    toVehicleSpecResponses(detail.Specs),
		Pricing:  toVehiclePricingResponses(detail.Pricing),
		Reviews:  toReviewResponses(detail.Reviews),
	}
}

func toVehicleModelResponse(m *entities.VehicleModel) *dto.VehicleModelResponse {
	if m == nil {
		return nil
	}
	return &dto.VehicleModelResponse{
		ID:            m.VehicleModelID,
		Name:          m.Name,
		Brand:         m.Brand,
		Seats:         m.Seats,
		Horsepower:    m.Horsepower,
		RangeKM:       m.RangeKM,
		TrunkCapacity: m.TrunkCapacity,
		Airbags:       m.Airbags,
		VehicleType:   m.VehicleType,
		Transmission:  m.Transmission,
	}
}

func toLocationResponse(l *entities.Location) *dto.LocationResponse {
	if l == nil {
		return nil
	}
	return &dto.LocationResponse{
		ID:        l.LocationID,
		Name:      l.Name,
		Address:   l.Address,
		City:      l.City,
		Latitude:  l.Latitude,
		Longitude: l.Longitude,
	}
}

func toVehicleImageResponses(images []*entities.VehicleImage) []*dto.VehicleImageResponse {
	if images == nil {
		return nil
	}
	out := make([]*dto.VehicleImageResponse, 0, len(images))
	for _, img := range images {
		out = append(out, &dto.VehicleImageResponse{
			ID:      img.ImageID,
			ModelID: img.VehicleModelID,
			URL:     img.ImageURL,
		})
	}
	return out
}

func toVehicleSpecResponses(specs []*entities.VehicleSpec) []*dto.VehicleSpecResponse {
	if specs == nil {
		return nil
	}
	out := make([]*dto.VehicleSpecResponse, 0, len(specs))
	for _, s := range specs {
		out = append(out, &dto.VehicleSpecResponse{
			ID:      s.SpecID,
			ModelID: s.VehicleModelID,
			Name:    s.SpecName,
			Value:   s.SpecValue,
		})
	}
	return out
}

func toVehiclePricingResponses(pricing []*entities.VehiclePricing) []*dto.VehiclePricingResponse {
	if pricing == nil {
		return nil
	}
	out := make([]*dto.VehiclePricingResponse, 0, len(pricing))
	for _, p := range pricing {
		out = append(out, &dto.VehiclePricingResponse{
			Pricing:    toPricingResponse(p.Pricing),
			RentalPlan: toRentalPlanResponse(p.RentalPlan),
		})
	}
	return out
}

func toPricingResponse(p *entities.Pricing) *dto.PricingResponse {
	if p == nil {
		return nil
	}
	return &dto.PricingResponse{
		ID:           p.PricingID,
		ModelID:      p.VehicleModelID,
		RentalPlanID: p.RentalPlanID,
		Price:        p.Price,
	}
}

func toRentalPlanResponse(r *entities.RentalPlan) *dto.RentalPlanResponse {
	if r == nil {
		return nil
	}
	return &dto.RentalPlanResponse{
		ID:            r.RentalPlanID,
		Name:          r.Name,
		DurationType:  r.DurationType,
		MaxKM:         r.MaxKM,
		OvertimePrice: r.OvertimePrice,
		OverKMPrice:   r.OverKMPrice,
	}
}

func toReviewResponses(reviews []*entities.Review) []*dto.ReviewResponse {
	if reviews == nil {
		return nil
	}
	out := make([]*dto.ReviewResponse, 0, len(reviews))
	for _, r := range reviews {
		created := ""
		if r.CreatedAt != nil {
			created = r.CreatedAt.Format("2006-01-02T15:04:05Z07:00")
		}
		out = append(out, &dto.ReviewResponse{
			ID:        r.ReviewID,
			UserID:    r.UserID,
			ModelID:   r.VehicleModelID,
			BookingID: r.BookingID,
			Rating:    r.Rating,
			Comment:   r.Comment,
			CreatedAt: created,
		})
	}
	return out
}
