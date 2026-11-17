package org.example.loan_risk.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** Supplementary borrower facts. Loan and profile-owned values are loaded server-side. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAssessmentRequest {
    @NotNull @Min(18) @Max(100)
    private Integer age;

    @NotNull @DecimalMin("300.0") @DecimalMax("850.0")
    private BigDecimal creditScore;

    @NotNull @PositiveOrZero
    private BigDecimal monthlyDebt;

    @NotNull @PositiveOrZero
    private BigDecimal monthlyExpenses;

    @NotNull @DecimalMin("0.0") @DecimalMax("82.0")
    private BigDecimal employmentYears;

    @NotNull @DecimalMin("0.0") @DecimalMax("100.0")
    private BigDecimal bankAccountAgeYears;

    @NotNull @Min(0) @Max(50)
    private Integer numCreditCards;

    @NotNull @Min(0) @Max(50)
    private Integer missedPaymentsLastYear;

    @NotNull @Min(0) @Max(20)
    private Integer previousDefaults;

    @NotNull @DecimalMin("0.0") @DecimalMax("100.0")
    private BigDecimal creditUtilization;

    @NotNull @PositiveOrZero
    private BigDecimal savingsBalance;

    @NotNull @DecimalMin("0.0") @DecimalMax("100.0")
    private BigDecimal transactionFrequency;
}
