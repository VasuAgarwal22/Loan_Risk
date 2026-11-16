package org.example.loan_risk.repository;

import org.example.loan_risk.entity.LoanApplication;
import org.example.loan_risk.entity.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {
    Optional<RiskAssessment> findByLoanApplication(LoanApplication loanApplication);
}
