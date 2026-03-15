package mappers

import (
	"time"

	"greencar/internal/domain/entities"
	"greencar/internal/infra/api/dto"
)

func ToBookingResponse(b *entities.Booking) *dto.BookingResponse {
	if b == nil {
		return nil
	}

	startTime := time.Time{}
	if b.StartTime != nil {
		startTime = *b.StartTime
	}

	endTime := time.Time{}
	if b.EndTime != nil {
		endTime = *b.EndTime
	}

	createdAt := time.Time{}
	if b.CreatedAt != nil {
		createdAt = *b.CreatedAt
	}

	return &dto.BookingResponse{
		ID:            b.BookingID,
		UserID:        b.UserID,
		VehicleID:     b.VehicleID,
		RentalPlanID:  b.RentalPlanID,
		StartTime:     startTime,
		EndTime:       endTime,
		ActualStart:   b.ActualStartTime,
		ActualEnd:     b.ActualEndTime,
		PlannedKM:     b.PlannedKM,
		ActualKM:      b.ActualKM,
		DepositAmount: b.DepositAmount,
		OvertimeFee:   b.OvertimeFee,
		OverKMFee:     b.OverKMFee,
		TotalPrice:    b.TotalPrice,
		Status:        b.Status,
		CreatedAt:     createdAt,
	}
}

func ToBookingResponses(bs []*entities.Booking) []*dto.BookingResponse {
	out := make([]*dto.BookingResponse, 0, len(bs))
	for _, b := range bs {
		out = append(out, ToBookingResponse(b))
	}
	return out
}

func ToBookingCreateParams(req *dto.CreateBookingRequest) (entities.Booking, error) {
	if req == nil {
		return entities.Booking{}, nil
	}

	startTime, err := time.Parse(time.RFC3339, req.StartTime)
	if err != nil {
		return entities.Booking{}, err
	}

	endTime, err := time.Parse(time.RFC3339, req.EndTime)
	if err != nil {
		return entities.Booking{}, err
	}

	return entities.Booking{
		UserID:        req.UserID,
		VehicleID:     req.VehicleID,
		RentalPlanID:  req.RentalPlanID,
		StartTime:     &startTime,
		EndTime:       &endTime,
		PlannedKM:     req.PlannedKM,
		DepositAmount: req.DepositAmount,
		TotalPrice:    req.TotalPrice,
	}, nil
}
