package org.example.loan_risk.repository;

import org.example.loan_risk.entity.LoanApplication;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication,Long> {
    List<LoanApplication> findByUser(User user);
    Long countByUserAndStatus(User user, LoanStatus status);

}
