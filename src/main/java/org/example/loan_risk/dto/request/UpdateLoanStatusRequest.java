package org.example.loan_risk.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.loan_risk.enums.LoanStatus;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateLoanStatusRequest {

    @NotNull(message = "Loan status is required")
    private LoanStatus status;

    private BigDecimal interestRate;

    private String remarks;
}
