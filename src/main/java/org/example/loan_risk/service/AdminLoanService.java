package org.example.loan_risk.service;

import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.UpdateLoanStatusRequest;
import org.example.loan_risk.dto.response.AdminLoanResponse;
import org.example.loan_risk.entity.LoanApplication;
import org.example.loan_risk.entity.RiskAssessment;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.Role;
import org.example.loan_risk.repository.LoanApplicationRepository;
import org.example.loan_risk.security.AuthenticationFacade;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminLoanService {

    public static final String DESIGNATED_OFFICER_EMAIL = "ujjawal@gmail.com";

    private final LoanApplicationRepository loanApplicationRepository;
    private final AuthenticationFacade authenticationFacade;

    @Transactional(readOnly = true)
    public List<AdminLoanResponse> getAllLoans() {
        validateOfficerOrAdminAccess();
        List<LoanApplication> loans = loanApplicationRepository.findAllWithDetails();
        return loans.stream().map(this::mapToAdminResponse).toList();
    }

    @Transactional
    public AdminLoanResponse updateLoanStatus(Long loanId, UpdateLoanStatusRequest request) {
        validateOfficerOrAdminAccess();

        LoanApplication loan = loanApplicationRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan application not found with ID: " + loanId));

        loan.setStatus(request.getStatus());

        if (request.getInterestRate() != null) {
            loan.setInterestRate(request.getInterestRate());
        }

        LoanApplication updatedLoan = loanApplicationRepository.save(loan);
        return mapToAdminResponse(updatedLoan);
    }

    private void validateOfficerOrAdminAccess() {
        User currentUser = authenticationFacade.getCurrentUser();
        boolean isDesignatedOfficer = DESIGNATED_OFFICER_EMAIL.equalsIgnoreCase(currentUser.getEmail())
                && (currentUser.getRole() == Role.BANK_OFFICER || currentUser.getRole() == Role.ADMIN);

        if (!isDesignatedOfficer) {
            throw new RuntimeException("Access denied. The Admin / Officer portal is strictly restricted to designated officer: " + DESIGNATED_OFFICER_EMAIL);
        }
    }

    private AdminLoanResponse mapToAdminResponse(LoanApplication loan) {
        User user = loan.getUser();
        RiskAssessment risk = loan.getRiskAssessment();

        AdminLoanResponse.AdminLoanResponseBuilder builder = AdminLoanResponse.builder()
                .id(loan.getId())
                .loanAmount(loan.getLoanAmount())
                .tenureMonths(loan.getTenureMonths())
                .interestRate(loan.getInterestRate())
                .purpose(loan.getPurpose())
                .status(loan.getStatus())
                .appliedAt(loan.getAppliedAt());

        if (user != null) {
            builder.borrowerId(user.getId())
                    .borrowerName(user.getFullName())
                    .borrowerEmail(user.getEmail())
                    .borrowerPhone(user.getPhoneNumber())
                    .borrowerMonthlyIncome(user.getMonthlyIncome())
                    .borrowerEmploymentType(user.getEmploymentType());
        }

        if (risk != null) {
            builder.hasRiskAssessment(true)
                    .riskScore(risk.getRiskScore())
                    .riskLevel(risk.getRiskLevel())
                    .recommendation(risk.getRecommendation())
                    .riskCalculatedAt(risk.getCalculatedAt())
                    .monthlyExpense(risk.getMonthlyExpense())
                    .averageBalance(risk.getAverageBalance())
                    .creditUtilization(risk.getCreditUtilization())
                    .existingLoans(risk.getExistingLoans())
                    .missedPayments(risk.getMissedPayments());
        } else {
            builder.hasRiskAssessment(false);
        }

        return builder.build();
    }
}
