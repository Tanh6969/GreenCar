package mocks

import (
	"errors"
	"sync"

	"greencar/internal/domain/entities"
)

// BookingRepositoryMock is a simple in-memory mock for testing the usecase.
type BookingRepositoryMock struct {
	mu       sync.RWMutex
	byID     map[int]*entities.Booking
	nextID   int
	failNext bool
}

func NewBookingRepositoryMock() *BookingRepositoryMock {
	return &BookingRepositoryMock{
		byID:   make(map[int]*entities.Booking),
		nextID: 1,
	}
}

func (m *BookingRepositoryMock) SetFailNext(v bool) {
	m.failNext = v
}

func (m *BookingRepositoryMock) GetByID(id int) (*entities.Booking, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if m.failNext {
		m.failNext = false
		return nil, errors.New("forced error")
	}
	b, ok := m.byID[id]
	if !ok {
		return nil, errors.New("not found")
	}
	return b, nil
}

func (m *BookingRepositoryMock) Create(b *entities.Booking) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.failNext {
		m.failNext = false
		return errors.New("forced error")
	}
	if b.BookingID == 0 {
		b.BookingID = m.nextID
		m.nextID++
	}
	cp := *b
	m.byID[b.BookingID] = &cp
	return nil
}
