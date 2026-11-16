# Loan Risk ML integration

## Architecture

The browser continues to call the authenticated Spring endpoint:

`POST /api/risk/{loanId}`

Spring Boot loads the authenticated user and the selected loan, constructs the 17-field request, and calls the private FastAPI service at `POST /predict`. The browser never calls FastAPI directly.

## Run locally

1. Start the FastAPI application using the Python environment and model files that have already been verified with the trained artifact. The service should listen on `127.0.0.1:8001`.
2. Set the database environment variables before starting Spring Boot:
   - `DB_URL` (defaults to `jdbc:postgresql://localhost:5432/loan_risk_db`)
   - `DB_USERNAME` (defaults to `postgres`)
   - `DB_PASSWORD` (required; no password is committed in this branch)
3. Set `ML_SERVICE_BASE_URL` when FastAPI is not at the default `http://127.0.0.1:8001`.
4. Start the Spring Boot application on port 8080 and the Vite frontend on port 5173.

Example (PowerShell):

```powershell
$env:DB_PASSWORD = "your-local-database-password"
$env:ML_SERVICE_BASE_URL = "http://127.0.0.1:8001"
.`mvnw.cmd` test
cd frontend
npm ci
npm run build
```

## Feature mapping

Server-derived features:
- `employment_type`: maps the authenticated user's enum. `STUDENT` is rejected because the current model schema does not accept it.
- `annual_income`: authenticated monthly profile income multiplied by 12.
- `loan_amount` and `loan_tenure_months`: taken from the selected loan owned by the authenticated user.
- `existing_loans`: count of the user's approved loans, excluding the selected loan if it is already approved.

Borrower-declared fields, which must be verified independently for underwriting:
- age
- credit score
- monthly debt
- monthly expenses
- employment duration
- bank-account age
- number of credit cards
- missed payments during the previous 12 months
- previous defaults
- credit utilization
- savings balance
- transactions per month

All monetary fields are INR. Credit utilization is entered as a percentage (0–100) and converted server-side to the model's fraction (0–1). The React form describes transaction frequency as transactions per month.

## Persistence and compatibility

New model-output columns are nullable to preserve readability of existing assessment rows. The legacy non-null columns are retained and populated during new assessments. A serialized feature snapshot is saved for traceability. The existing one-assessment-per-loan relationship is preserved by updating an assessment if one already exists for that loan.

Hibernate `ddl-auto=update` adds the new nullable fields during local development. Production deployment should use a reviewed database migration.

The risk score retained for compatibility is an inverse-probability score (`round((1 - default_probability) * 100)`). The UI prominently displays the model's actual default probability and prediction label.

## Safety and operational notes

- Treat user-entered borrower data as declarations, not verified facts.
- Do not use the prediction as an automatic loan approval or rejection.
- Rotate the database password previously committed in repository history; removing it from the current configuration does not erase it from older commits.
- FastAPI should remain private on loopback or a trusted internal network; do not expose the inference service directly to the browser.
