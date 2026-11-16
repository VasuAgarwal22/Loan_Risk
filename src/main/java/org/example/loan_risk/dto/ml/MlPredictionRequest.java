package org.example.loan_risk.dto.ml;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MlPredictionRequest {
    Integer age;
    @JsonProperty("employment_type") String employmentType;
    @JsonProperty("annual_income") double annualIncome;
    @JsonProperty("credit_score") double creditScore;
    @JsonProperty("loan_amount") double loanAmount;
    @JsonProperty("loan_tenure_months") Integer loanTenureMonths;
    @JsonProperty("existing_loans") Integer existingLoans;
    @JsonProperty("monthly_debt") double monthlyDebt;
    @JsonProperty("monthly_expenses") double monthlyExpenses;
    @JsonProperty("employment_years") double employmentYears;
    @JsonProperty("bank_account_age_years") double bankAccountAgeYears;
    @JsonProperty("num_credit_cards") Integer numCreditCards;
    @JsonProperty("missed_payments_last_year") Integer missedPaymentsLastYear;
    @JsonProperty("previous_defaults") Integer previousDefaults;
    @JsonProperty("credit_utilization") double creditUtilization;
    @JsonProperty("savings_balance") double savingsBalance;
    @JsonProperty("transaction_frequency") double transactionFrequency;
}
