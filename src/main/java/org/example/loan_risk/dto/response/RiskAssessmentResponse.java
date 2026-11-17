package org.example.loan_risk.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.loan_risk.enums.RiskLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAssessmentResponse {
    private Integer riskScore;
    private Integer prediction;
    private String predictionLabel;
    private BigDecimal defaultProbability;
    private RiskLevel riskLevel;
    private BigDecimal loanToIncomeRatio;
    private BigDecimal debtToIncomeRatio;
    private String recommendation;
    private LocalDateTime calculatedAt;
}
