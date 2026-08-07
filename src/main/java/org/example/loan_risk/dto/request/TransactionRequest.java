package org.example.loan_risk.dto.request;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.loan_risk.enums.TransactionCategory;
import org.example.loan_risk.enums.TransactionStatus;
import org.example.loan_risk.enums.TransactionType;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequest {

    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;


    private TransactionType transactionType;

    private TransactionCategory transactionCategory;

    private String description;

    @Positive(message = "Balance must be greater than zero")
    private BigDecimal balanceAfterTransaction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus transactionStatus;
    private String merchant;
}
