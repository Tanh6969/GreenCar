package handlers

import (
	"net/http"

	"greencar/internal/infra/api/response"
)

// HealthHandler returns a simple status check handler.
func HealthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, _ *http.Request) {
		response.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	}
}
