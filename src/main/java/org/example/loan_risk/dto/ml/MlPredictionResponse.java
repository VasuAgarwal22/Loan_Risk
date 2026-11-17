package org.example.loan_risk.dto.ml;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MlPredictionResponse {
    private Integer prediction;
    @JsonProperty("prediction_label") private String predictionLabel;
    @JsonProperty("default_probability") private Double defaultProbability;
    @JsonProperty("risk_level") private String riskLevel;
    @JsonProperty("loan_to_income_ratio") private Double loanToIncomeRatio;
    @JsonProperty("debt_to_income_ratio") private Double debtToIncomeRatio;
}
