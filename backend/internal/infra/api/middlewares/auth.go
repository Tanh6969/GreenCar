package middlewares

import (
	"context"
	"net/http"
	"strings"

	"greencar/internal/infra/api/response"
	"greencar/internal/token"
)

type contextKey string

const (
	ctxKeyPayload contextKey = "token_payload"
)

// Authenticator verifies the bearer token and stores the payload in the request context.
func Authenticator(maker token.Maker) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			auth := r.Header.Get("Authorization")
			if auth == "" {
				response.WriteError(w, http.StatusUnauthorized, "missing authorization header")
				return
			}

			parts := strings.Fields(auth)
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				response.WriteError(w, http.StatusUnauthorized, "invalid authorization header")
				return
			}

			tokenStr := parts[1]
			payload, err := maker.VerifyToken(tokenStr, token.TokenTypeAccessToken)
			if err != nil {
				response.WriteError(w, http.StatusUnauthorized, "invalid or expired token")
				return
			}

			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ctxKeyPayload, payload)))
		})
	}
}

// RequireRole ensures the authenticated user has one of the allowed roles.
func RequireRole(roles ...string) func(http.Handler) http.Handler {
	allowed := map[string]struct{}{}
	for _, role := range roles {
		allowed[strings.ToLower(role)] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			payload := GetPayload(r)
			if payload == nil {
				response.WriteError(w, http.StatusUnauthorized, "missing auth payload")
				return
			}
			if _, ok := allowed[strings.ToLower(payload.Role)]; !ok {
				response.WriteError(w, http.StatusForbidden, "forbidden")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

// GetPayload returns the token payload saved in context by Authenticator.
func GetPayload(r *http.Request) *token.Payload {
	p, _ := r.Context().Value(ctxKeyPayload).(*token.Payload)
	return p
}
