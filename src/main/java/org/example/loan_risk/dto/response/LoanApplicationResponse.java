package org.example.loan_risk.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.loan_risk.enums.LoanStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplicationResponse {

    private Long id;
    private BigDecimal loanAmount;
    private Integer tenureMonths;
    private BigDecimal interestRate;
    private String purpose;
    private LoanStatus status;
    private LocalDateTime appliedAt;


}
