package middlewares

import (
	"fmt"
	"net/http"
	"time"

	"greencar/pkg/logger"
)

func LoggingMiddleware(l *logger.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// Wrap responseWriter to capture status code and response size
			wrapped := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

			next.ServeHTTP(wrapped, r)

			duration := time.Since(start).Milliseconds()

			// Get user ID from context if available
			userID := "anonymous"
			if payload := GetPayload(r); payload != nil {
				userID = fmt.Sprintf("%d", payload.UserId)
			}

			// Log the request
			l.Info("HTTP Request - method: %s, path: %s, status: %d, user_id: %s, duration_ms: %d, response_size: %d",
				r.Method,
				r.RequestURI,
				wrapped.statusCode,
				userID,
				duration,
				wrapped.bytesWritten,
			)
		})
	}
}

type responseWriter struct {
	http.ResponseWriter
	statusCode   int
	bytesWritten int
}

func (w *responseWriter) WriteHeader(code int) {
	w.statusCode = code
	w.ResponseWriter.WriteHeader(code)
}

func (w *responseWriter) Write(b []byte) (int, error) {
	n, err := w.ResponseWriter.Write(b)
	w.bytesWritten += n
	return n, err
}
