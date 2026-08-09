package org.example.loan_risk.service;

import lombok.RequiredArgsConstructor;
import org.example.loan_risk.entity.Transaction;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.LoanStatus;
import org.example.loan_risk.enums.TransactionType;
import org.example.loan_risk.repository.LoanApplicationRepository;
import org.example.loan_risk.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinancialAnalysisService {
    private final TransactionRepository transactionRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    public BigDecimal getMonthlyExpense(User user){
        List<Transaction> transactions = transactionRepository.findByUserAndTransactionType(user, TransactionType.DEBIT);
        LocalDateTime now = LocalDateTime.now();
        BigDecimal total = BigDecimal.ZERO;
        for(Transaction transaction : transactions){
            LocalDateTime date = transaction.getTransactionDate();
            if(date.getYear() == now.getYear() && date.getMonth() == now.getMonth()){
                total = total.add(transaction.getAmount());
            }
        }
        return total;
    }

    public BigDecimal getYearly(User user){
        List<Transaction> transactions = transactionRepository.findByUserAndTransactionType(user,TransactionType.DEBIT);
        LocalDateTime now = LocalDateTime.now();
        BigDecimal total = BigDecimal.ZERO;
        for(Transaction transaction : transactions){
            LocalDateTime date = transaction.getTransactionDate();
            if(date.getYear() == now.getYear()) total = total.add(transaction.getAmount());
        }
        return total;
    }

    public BigDecimal getAverageBalance(User user){
        List<Transaction> transactions = transactionRepository.findByUser(user);
        if(transactions.isEmpty()) return BigDecimal.ZERO;
        BigDecimal total = BigDecimal.ZERO;
        for(Transaction transaction : transactions){
            total = total.add(transaction.getAmount());
        }
        return total.divide(BigDecimal.valueOf(transactions.size()),2, RoundingMode.HALF_UP);
    }
    public long getExistingLoans(User user){
        return loanApplicationRepository.countByUserAndStatus(user, LoanStatus.APPROVED);
    }

}
