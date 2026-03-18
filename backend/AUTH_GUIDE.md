# GreenCar Authentication & Authorization Implementation

## Overview
Complete MVP authentication and authorization system with role-based access control (RBAC) for admin and customer users.

## Structure

### 1) **Authentication (`auth_service.go`)**
- Login with email/password
- Token generation (access + refresh)
- Password hashing with bcrypt
- Located: `internal/service/auth_service.go`

### 2) **Token & Payload**
- JWT token implementation
- Payload includes: `UserId`, `Role`, token type
- Located: `internal/token/`

### 3) **Middleware (`middlewares/auth.go`)**
- **`Authenticator`**: Verifies JWT, stores payload in context
- **`RequireRole`**: Enforces role-based access (admin/customer)
- **`GetPayload`**: Retrieves payload from request context

### 4) **Routes Structure**

```
/health                              (PUBLIC)
/auth/login                          (PUBLIC - POST)

/vehicles                            (PUBLIC - list only)
/vehicles/{id}                       (PUBLIC - get only)
/vehicles/{id}/detail                (PUBLIC - get only)

/customers/me/bookings               (CUSTOMER - requires auth)

/admin/*                             (ADMIN ONLY - requires auth + admin role)
  /admin/users                       (CRUD users)
  /admin/vehicles                    (CRUD vehicles)
  /admin/bookings                    (CRUD bookings)

/users                               (CUSTOMER - requires auth)
/bookings                            (CUSTOMER - requires auth)
```

## Database Setup

1. **Create schema** (run first):
   ```bash
   psql -U postgres -d greencar -f sql/001_schema.sql
   ```

2. **Seed data** (admin + customer users, roles, locations, rental plans):
   ```bash
   psql -U postgres -d greencar -f sql/002_seed.sql
   ```

### Test Credentials

- **Admin**: 
  - Email: `admin@greencar.vn`
  - Password: `admin123`

- **Customer**: 
  - Email: `customer@greencar.vn`
  - Password: `customer123`

## API Usage Examples

### 1) Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@greencar.vn",
    "password": "admin123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2026-03-18T15:30:00Z",
  "role": "admin",
  "user_id": 1
}
```

### 2) Access Protected Resource (with token)
```bash
curl -X GET http://localhost:8080/customers/me/bookings \
  -H "Authorization: Bearer <access_token>"
```

### 3) Admin-only Endpoint
```bash
curl -X GET http://localhost:8080/admin/users \
  -H "Authorization: Bearer <admin_access_token>"
```

Without admin token → `403 Forbidden`

## File Locations

| Component | Location |
|-----------|----------|
| Auth Service | `internal/service/auth_service.go` |
| Auth Handler (Login) | `internal/infra/api/handlers/auth_handler.go` |
| Auth Middleware | `internal/infra/api/middlewares/auth.go` |
| Auth DTO | `internal/infra/api/dto/auth_dto.go` |
| Router with Routes | `internal/infra/api/router.go` |
| Main Entry | `cmd/api/main.go` |
| Seed Data | `sql/002_seed.sql` |

## Key Features

✅ **JWT-based authentication** with configurable secret key  
✅ **Role-based access control** (admin/customer separate routes)  
✅ **Password hashing** with bcrypt  
✅ **Token middleware** for protected endpoints  
✅ **Customer can view own bookings** (`/customers/me/bookings`)  
✅ **Admin has full CRUD** on users/vehicles/bookings  
✅ **Seed data** with 2 test users (admin + customer)  
✅ **Public vehicle browsing** (no auth needed)

## Environment Variables

```bash
# JWT secret key (min 32 characters)
JWT_SECRET_KEY=your-secret-key-min-32-characters-long-please-change-in-production

# Database DSN
DB_DSN=host=localhost port=5432 user=postgres password=postgres dbname=greencar sslmode=disable

# HTTP server address
HTTP_ADDR=:8080
```

## Next Steps

- [ ] Add token refresh endpoint
- [ ] Add logout/blacklist functionality
- [ ] Add customer registration
- [ ] Add password change/reset
- [ ] Add request logging/audit trail
- [ ] Add rate limiting on login
- [ ] Add 2FA (optional)
