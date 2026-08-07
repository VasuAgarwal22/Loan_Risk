package org.example.loan_risk.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAssessmentRequest {
    @Positive
    private BigDecimal monthlyIncome;

    @PositiveOrZero
    private BigDecimal monthlyExpense;

    @PositiveOrZero
    private BigDecimal averageBalance;

    @PositiveOrZero
    private Integer existingLoans;

    @PositiveOrZero
    private Integer missedPayments;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal creditUtilization;
    
}
