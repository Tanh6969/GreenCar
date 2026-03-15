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

func ToUserResponses(users []*entities.User) []*dto.UserResponse {
	if users == nil {
		return nil
	}

	out := make([]*dto.UserResponse, 0, len(users))
	for _, u := range users {
		out = append(out, ToUserResponse(u))
	}
	return out
}

func ToUserCreateParams(req *dto.CreateUserRequest) entities.User {
	if req == nil {
		return entities.User{}
	}
	return entities.User{
		Name:      req.Name,
		Email:     req.Email,
		Password:  req.Password,
		Phone:     req.Phone,
		LicenseNo: req.LicenseNo,
		RoleID:    req.RoleID,
	}
}

func ToUserUpdateParams(id int, req *dto.UpdateUserRequest) entities.User {
	if req == nil {
		return entities.User{UserID: id}
	}
	return entities.User{
		UserID:    id,
		Name:      req.Name,
		Email:     req.Email,
		Phone:     req.Phone,
		LicenseNo: req.LicenseNo,
		RoleID:    req.RoleID,
	}
}
