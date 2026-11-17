import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, 'models', 'model.joblib')

app = FastAPI(
    title="Loan Default Risk Prediction API",
    description="ML service providing credit risk predictions for loan underwriting",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None

def get_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_FILE):
            from train import train_and_evaluate
            print("Model artifact not found. Training model now...")
            train_and_evaluate()
        model = joblib.load(MODEL_FILE)
    return model

@app.on_event("startup")
def startup_event():
    get_model()

class LoanPredictionRequest(BaseModel):
    age: int = Field(..., ge=18, le=100)
    employment_type: str
    annual_income: float = Field(..., gt=0)
    credit_score: float = Field(..., ge=300, le=850)
    loan_amount: float = Field(..., gt=0)
    loan_tenure_months: int = Field(..., gt=0)
    existing_loans: int = Field(..., ge=0)
    monthly_debt: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)
    employment_years: float = Field(..., ge=0)
    bank_account_age_years: float = Field(..., ge=0)
    num_credit_cards: int = Field(..., ge=0)
    missed_payments_last_year: int = Field(..., ge=0)
    previous_defaults: int = Field(..., ge=0)
    credit_utilization: float = Field(..., ge=0)
    savings_balance: float = Field(..., ge=0)
    transaction_frequency: float = Field(..., ge=0)

class LoanPredictionResponse(BaseModel):
    prediction: int
    prediction_label: str
    default_probability: float
    risk_level: str
    loan_to_income_ratio: float
    debt_to_income_ratio: float

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None or os.path.exists(MODEL_FILE)}

@app.post("/predict", response_model=LoanPredictionResponse)
def predict_loan_risk(req: LoanPredictionRequest):
    # Reject student employment as specified in system design
    if req.employment_type.upper() == "STUDENT":
        raise HTTPException(
            status_code=400,
            detail="The current ML model does not support STUDENT employment."
        )

    pipeline = get_model()

    input_data = pd.DataFrame([{
        'age': req.age,
        'employment_type': req.employment_type.upper(),
        'annual_income': float(req.annual_income),
        'credit_score': float(req.credit_score),
        'loan_amount': float(req.loan_amount),
        'loan_tenure_months': int(req.loan_tenure_months),
        'existing_loans': int(req.existing_loans),
        'monthly_debt': float(req.monthly_debt),
        'monthly_expenses': float(req.monthly_expenses),
        'employment_years': float(req.employment_years),
        'bank_account_age_years': float(req.bank_account_age_years),
        'num_credit_cards': int(req.num_credit_cards),
        'missed_payments_last_year': int(req.missed_payments_last_year),
        'previous_defaults': int(req.previous_defaults),
        'credit_utilization': float(req.credit_utilization),
        'savings_balance': float(req.savings_balance),
        'transaction_frequency': float(req.transaction_frequency)
    }])

    try:
        prob = pipeline.predict_proba(input_data)[0][1]
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(ex)}")

    default_prob = float(prob)

    # Calculate financial ratios
    annual_inc = max(req.annual_income, 1.0)
    lti = float(req.loan_amount / annual_inc)
    monthly_installment = req.loan_amount / max(req.loan_tenure_months, 1)
    monthly_inc = annual_inc / 12.0
    dti = float((req.monthly_debt + monthly_installment) / monthly_inc)

    # Risk level categorization conforming to Spring Boot expectations:
    # "Low Risk", "Moderate Risk", "High Risk"
    if default_prob < 0.35:
        risk_level = "Low Risk"
        prediction = 0
        prediction_label = "Low Risk"
    elif default_prob < 0.60:
        risk_level = "Moderate Risk"
        prediction = 0 if default_prob < 0.50 else 1
        prediction_label = "Moderate Risk"
    else:
        risk_level = "High Risk"
        prediction = 1
        prediction_label = "High Risk"

    return LoanPredictionResponse(
        prediction=prediction,
        prediction_label=prediction_label,
        default_probability=round(default_prob, 4),
        risk_level=risk_level,
        loan_to_income_ratio=round(lti, 4),
        debt_to_income_ratio=round(dti, 4)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=True)
