package response

import (
	"encoding/json"
	"net/http"
	"strconv"
)

// ErrorResponse is a standard error response payload.
type ErrorResponse struct {
	Error string `json:"error"`
}

// WriteError writes a JSON error response.
func WriteError(w http.ResponseWriter, status int, message string) {
	WriteJSON(w, status, ErrorResponse{Error: message})
}

// WriteJSON writes a JSON response.
func WriteJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// PaginationMetadata represents pagination information.
type PaginationMetadata struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"total_pages"`
}

// PaginatedResponse wraps a response with pagination metadata.
type PaginatedResponse struct {
	Data       any                `json:"data"`
	Pagination PaginationMetadata `json:"pagination"`
}

// ParsePagination parses page, limit, and offset from query parameters.
func ParsePagination(r *http.Request, defaultLimit int) (page, limit, offset int) {
	page = 1
	limit = defaultLimit
	q := r.URL.Query()

	if p := q.Get("page"); p != "" {
		if v, err := strconv.Atoi(p); err == nil && v > 0 {
			page = v
		}
	}

	if l := q.Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 {
			limit = v
		}
	}

	if o := q.Get("offset"); o != "" {
		if v, err := strconv.Atoi(o); err == nil && v >= 0 {
			offset = v
			if limit > 0 {
				page = (offset / limit) + 1
			}
			return
		}
	}

	offset = (page - 1) * limit
	return
}

// WritePaginatedJSON writes a JSON response with pagination metadata.
func WritePaginatedJSON(w http.ResponseWriter, status int, data any, page, limit, total int) {
	totalPages := 0
	if limit > 0 {
		totalPages = (total + limit - 1) / limit
	}
	WriteJSON(w, status, PaginatedResponse{
		Data: data,
		Pagination: PaginationMetadata{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

