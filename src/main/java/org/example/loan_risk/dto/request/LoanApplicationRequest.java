package org.example.loan_risk.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplicationRequest {

    @Positive
    private BigDecimal loanAmount;
    @Positive
    private Integer tenureMonths;
    @Positive
    private BigDecimal interestRate;
    @NotBlank
    private String purpose;
}
