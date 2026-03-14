package utils

import (
	"crypto/rand"
	"math/big"
)

// RandomString returns a random string of length n (base62).
func RandomString(n int) string {
	const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	b := make([]byte, n)
	for i := range b {
		idx, _ := rand.Int(rand.Reader, big.NewInt(int64(len(letters))))
		b[i] = letters[idx.Int64()]
	}
	return string(b)
}

// RandomInt returns a random int in [min, max].
func RandomInt(min, max int64) int64 {
	if min >= max {
		return min
	}
	n, _ := rand.Int(rand.Reader, big.NewInt(max-min+1))
	return min + n.Int64()
}
