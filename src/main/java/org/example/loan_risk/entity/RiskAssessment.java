package org.example.loan_risk.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.loan_risk.enums.RiskLevel;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_assessments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal monthlyIncome;

    @Column(nullable = false)
    private BigDecimal monthlyExpense;

    @Column(nullable = false)
    private Integer existingLoans;

    @Column(nullable = false)
    private Integer missedPayments;

    @Column(nullable = false)
    private BigDecimal creditUtilization;

    @Column(nullable = false)
    private Integer riskScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel riskLevel;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime calculatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_application_id",nullable = false,unique = true)
    private LoanApplication loanApplication;

}
