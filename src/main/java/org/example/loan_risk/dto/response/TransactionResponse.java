package org.example.loan_risk.dto.response;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.loan_risk.enums.TransactionCategory;
import org.example.loan_risk.enums.TransactionStatus;
import org.example.loan_risk.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long id;
    private BigDecimal amount;
    private TransactionType transactionType;
    private TransactionCategory transactionCategory;
    private String description;
    private BigDecimal balanceAfterTransaction;
    private LocalDateTime transactionDate;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus transactionStatus;
    private String merchant;
}
