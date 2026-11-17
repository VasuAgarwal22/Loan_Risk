import json
import urllib.request

def test_prediction():
    url = "http://127.0.0.1:8001/predict"
    payload = {
        "age": 32,
        "employment_type": "SALARIED",
        "annual_income": 850000.0,
        "credit_score": 740.0,
        "loan_amount": 250000.0,
        "loan_tenure_months": 24,
        "existing_loans": 1,
        "monthly_debt": 6000.0,
        "monthly_expenses": 18000.0,
        "employment_years": 6.5,
        "bank_account_age_years": 8.0,
        "num_credit_cards": 2,
        "missed_payments_last_year": 0,
        "previous_defaults": 0,
        "credit_utilization": 0.22,
        "savings_balance": 150000.0,
        "transaction_frequency": 20.0
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("Response Status:", response.status)
            print("Response Body:\n", json.dumps(result, indent=2))
    except Exception as e:
        print("Test failed:", e)

if __name__ == "__main__":
    test_prediction()
