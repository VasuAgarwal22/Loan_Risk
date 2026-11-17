import numpy as np
import pandas as pd
import os

def generate_synthetic_data(n_samples=10000, random_state=42):
    np.random.seed(random_state)

    age = np.random.randint(21, 65, size=n_samples)
    
    # Employment type (excluding STUDENT which is disallowed)
    employment_choices = ['SALARIED', 'SELF_EMPLOYED', 'BUSINESS', 'UNEMPLOYED']
    employment_probs = [0.60, 0.25, 0.10, 0.05]
    employment_type = np.random.choice(employment_choices, size=n_samples, p=employment_probs)

    # Max employment years is age - 18
    max_emp_years = np.maximum(age - 18, 0)
    employment_years = np.round(np.random.uniform(0.5, 35.0, size=n_samples), 1)
    employment_years = np.minimum(employment_years, max_emp_years)
    # If unemployed, employment_years = 0
    employment_years[employment_type == 'UNEMPLOYED'] = 0.0

    # Income based on employment
    base_income = {
        'SALARIED': np.random.lognormal(mean=13.0, sigma=0.6, size=n_samples),       # ~400k - 1.2M INR
        'SELF_EMPLOYED': np.random.lognormal(mean=13.2, sigma=0.8, size=n_samples),  # ~500k - 2M INR
        'BUSINESS': np.random.lognormal(mean=13.8, sigma=0.9, size=n_samples),       # ~800k - 3M INR
        'UNEMPLOYED': np.random.uniform(0, 50000, size=n_samples)                    # Minimal
    }
    annual_income = np.zeros(n_samples)
    for emp in employment_choices:
        mask = (employment_type == emp)
        annual_income[mask] = base_income[emp][mask]
    annual_income = np.round(np.clip(annual_income, 50000, 10000000), 2)

    # Loan amount & tenure
    loan_amount = np.round(np.random.uniform(50000, 3000000, size=n_samples), 2)
    loan_tenure_months = np.random.choice([12, 24, 36, 48, 60, 72, 84, 120], size=n_samples)

    # Credit score (300 to 850)
    credit_score = np.round(np.random.normal(loc=685, scale=75, size=n_samples), 1)
    credit_score = np.clip(credit_score, 300, 850)

    # Existing loans & cards
    existing_loans = np.random.poisson(lam=1.5, size=n_samples)
    existing_loans = np.clip(existing_loans, 0, 10)
    num_credit_cards = np.random.poisson(lam=2.2, size=n_samples)
    num_credit_cards = np.clip(num_credit_cards, 0, 15)

    # Monthly debt & expenses
    monthly_income = annual_income / 12.0
    monthly_debt = np.round(np.random.uniform(0.05, 0.4, size=n_samples) * monthly_income, 2)
    monthly_expenses = np.round(np.random.uniform(0.15, 0.5, size=n_samples) * monthly_income, 2)

    # Bank account age & savings
    bank_account_age_years = np.round(np.minimum(age - 18, np.random.exponential(scale=7, size=n_samples)), 1)
    savings_balance = np.round(np.maximum(monthly_income * np.random.uniform(0.5, 6, size=n_samples), 1000), 2)

    # Credit utilization & transaction frequency
    credit_utilization = np.round(np.random.beta(a=2, b=4, size=n_samples), 4) # 0 to 1
    transaction_frequency = np.round(np.random.poisson(lam=15, size=n_samples) + np.random.uniform(0, 1, size=n_samples), 1)

    # History of defaults and missed payments
    missed_payments_last_year = np.random.choice([0, 1, 2, 3, 4, 5], size=n_samples, p=[0.70, 0.15, 0.08, 0.04, 0.02, 0.01])
    previous_defaults = np.random.choice([0, 1, 2], size=n_samples, p=[0.85, 0.12, 0.03])

    # Calculate Default risk latent score
    lti = loan_amount / annual_income
    monthly_installment = loan_amount / loan_tenure_months
    dti = (monthly_debt + monthly_installment) / monthly_income

    risk_latent = (
        - 0.006 * (credit_score - 650)
        + 0.8 * (dti - 0.5)
        + 0.5 * (lti - 1.5)
        + 1.2 * credit_utilization
        + 0.6 * missed_payments_last_year
        + 1.8 * previous_defaults
        + 0.05 * existing_loans
        - 0.03 * employment_years
        - 0.2 * np.log1p(savings_balance / 10000.0)
    )
    # Add unemployment risk
    risk_latent[employment_type == 'UNEMPLOYED'] += 1.5

    # Probability of default via sigmoid
    prob_default = 1.0 / (1.0 + np.exp(- (risk_latent - 0.4)))
    # Generate binary default outcome (approximately 29-30% default rate as in paper)
    default = (np.random.uniform(0, 1, size=n_samples) < prob_default).astype(int)

    df = pd.DataFrame({
        'age': age,
        'employment_type': employment_type,
        'annual_income': annual_income,
        'credit_score': credit_score,
        'loan_amount': loan_amount,
        'loan_tenure_months': loan_tenure_months,
        'existing_loans': existing_loans,
        'monthly_debt': monthly_debt,
        'monthly_expenses': monthly_expenses,
        'employment_years': employment_years,
        'bank_account_age_years': bank_account_age_years,
        'num_credit_cards': num_credit_cards,
        'missed_payments_last_year': missed_payments_last_year,
        'previous_defaults': previous_defaults,
        'credit_utilization': credit_utilization,
        'savings_balance': savings_balance,
        'transaction_frequency': transaction_frequency,
        'default': default
    })

    return df

if __name__ == '__main__':
    data_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(data_dir, 'synthetic_loan_data.csv')
    print("Generating synthetic loan dataset...")
    df = generate_synthetic_data(10000)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} records saved to {output_path}")
    print(f"Default distribution: {df['default'].value_counts(normalize=True).to_dict()}")
