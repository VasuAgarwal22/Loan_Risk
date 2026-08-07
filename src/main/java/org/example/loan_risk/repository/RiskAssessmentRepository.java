package org.example.loan_risk.repository;

import org.example.loan_risk.entity.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment,Long> {


 }
