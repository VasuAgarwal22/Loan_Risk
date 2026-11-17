package org.example.loan_risk.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.loan_risk.enums.EmploymentType;
import org.example.loan_risk.enums.LoanStatus;
import org.example.loan_risk.enums.RiskLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLoanResponse {

    // Loan details
    private Long id;
    private BigDecimal loanAmount;
    private Integer tenureMonths;
    private BigDecimal interestRate;
    private String purpose;
    private LoanStatus status;
    private LocalDateTime appliedAt;

    // Borrower details
    private Long borrowerId;
    private String borrowerName;
    private String borrowerEmail;
    private String borrowerPhone;
    private BigDecimal borrowerMonthlyIncome;
    private EmploymentType borrowerEmploymentType;

    // Risk Assessment details (if evaluated)
    private Boolean hasRiskAssessment;
    private Integer riskScore;
    private RiskLevel riskLevel;
    private String recommendation;
    private LocalDateTime riskCalculatedAt;
    private BigDecimal monthlyExpense;
    private BigDecimal averageBalance;
    private BigDecimal creditUtilization;
    private Integer existingLoans;
    private Integer missedPayments;
}
