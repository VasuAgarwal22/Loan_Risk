package org.example.loan_risk.repository;

import org.example.loan_risk.entity.LoanApplication;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByUser(User user);

    Long countByUserAndStatus(User user, LoanStatus status);

    @Query("SELECT l FROM LoanApplication l LEFT JOIN FETCH l.user LEFT JOIN FETCH l.riskAssessment ORDER BY l.appliedAt DESC")
    List<LoanApplication> findAllWithDetails();
}
