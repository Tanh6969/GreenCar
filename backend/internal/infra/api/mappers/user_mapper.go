package mappers

import (
	"time"

	"greencar/internal/domain/entities"
	"greencar/internal/infra/api/dto"
)

func ToUserResponse(u *entities.User) *dto.UserResponse {
	if u == nil {
		return nil
	}

	createdAt := time.Time{}
	if u.CreatedAt != nil {
		createdAt = *u.CreatedAt
	}

	return &dto.UserResponse{
		ID:        u.UserID,
		Name:      u.Name,
		Email:     u.Email,
		Phone:     u.Phone,
		LicenseNo: u.LicenseNo,
		RoleID:    u.RoleID,
		CreatedAt: createdAt,
	}
}
