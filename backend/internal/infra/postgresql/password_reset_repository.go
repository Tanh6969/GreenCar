package repository

import (
	"database/sql"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type PasswordResetRepository struct {
	db *database.DB
}

func NewPasswordResetRepository(db *database.DB) *PasswordResetRepository {
	return &PasswordResetRepository{db: db}
}

func (r *PasswordResetRepository) Create(pr *entities.PasswordReset) error {
	query := `
		INSERT INTO password_resets (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)
		RETURNING id, used, created_at`
	return r.db.QueryRow(query, pr.UserID, pr.TokenHash, pr.ExpiresAt).Scan(&pr.ID, &pr.Used, &pr.CreatedAt)
}

func (r *PasswordResetRepository) GetByTokenHash(hash string) (*entities.PasswordReset, error) {
	query := `SELECT id, user_id, token_hash, expires_at, used, created_at FROM password_resets WHERE token_hash = $1`
	pr := &entities.PasswordReset{}
	err := r.db.QueryRow(query, hash).Scan(&pr.ID, &pr.UserID, &pr.TokenHash, &pr.ExpiresAt, &pr.Used, &pr.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return pr, nil
}

func (r *PasswordResetRepository) MarkAsUsed(id int) error {
	_, err := r.db.Exec(`UPDATE password_resets SET used = TRUE WHERE id = $1`, id)
	return err
}
