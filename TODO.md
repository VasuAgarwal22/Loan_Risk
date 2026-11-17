# Loan Risk System - Run Steps TODO

## Backend
- [x] 1. Verify PostgreSQL is running on localhost:5432 with `loan_risk_db`
- [x] 2. Run backend: `./mvnw spring-boot:run` (port 8080)

## Frontend
- [x] 3. Install deps: `npm install` in `frontend/`
- [x] 4. Run frontend: `npm run dev` (port 5173)

## Verify
- [x] 5. Backend reachable at http://localhost:8080 (403 on root = protected by Spring Security, server up)
- [x] 6. Frontend reachable at http://localhost:5173

## Bug Fix
- [x] 7. Fixed GlobalExceptHandler missing @ExceptionHandler(RuntimeException.class) annotation
- [x] 8. Restart backend to apply fix
- [x] 9. Verify register error handling (duplicate email now returns 400 instead of 403)
- [x] 10. Fixed JwtAuthenticationFilter missing try-catch around JWT parsing (expired token was breaking register)
- [x] 11. Restart backend to apply JWT filter fix
- [x] 12. Verify register works with expired token in localStorage (register succeeded despite expired JWT in header)
