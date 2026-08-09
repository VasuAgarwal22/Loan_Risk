package org.example.loan_risk.service;

import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.TransactionRequest;
import org.example.loan_risk.dto.response.TransactionResponse;
import org.example.loan_risk.entity.Transaction;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.TransactionType;
import org.example.loan_risk.repository.TransactionRepository;
import org.example.loan_risk.security.AuthenticationFacade;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService{
    private final TransactionRepository transactionRepository;
    private final AuthenticationFacade authenticationFacade;

    public TransactionResponse addTransaction(TransactionRequest request){
        User currentUser = authenticationFacade.getCurrentUser();
        Optional<Transaction> lastTransaction = transactionRepository
                .findTopByUserOrderByTransactionDateDescIdDesc(currentUser);

        BigDecimal previousBalance = BigDecimal.ZERO;

        if (lastTransaction.isPresent()) {
            previousBalance =
                    lastTransaction.get().getBalanceAfterTransaction();
        }

        if(request.getTransactionType() == TransactionType.DEBIT && request.getAmount().compareTo(previousBalance)>0){
            throw new RuntimeException("Insufficient Balance");
        }

        BigDecimal newBalance;
        if(request.getTransactionType() == TransactionType.CREDIT){
            newBalance = previousBalance.add(request.getAmount());
        }else{
            newBalance = previousBalance.subtract(request.getAmount());
        }

        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .transactionType(request.getTransactionType())
                .transactionCategory(request.getTransactionCategory())
                .description(request.getDescription())
                .merchant(request.getMerchant())
                .status(request.getTransactionStatus())
                .balanceAfterTransaction(newBalance)
                .user(currentUser)
                .build();
        Transaction savedTransaction =  transactionRepository.save(transaction);

        return TransactionResponse.builder()
                .id(savedTransaction.getId())
                .amount(savedTransaction.getAmount())
                .transactionType(savedTransaction.getTransactionType())
                .transactionCategory(savedTransaction.getTransactionCategory())
                .description(savedTransaction.getDescription())
                .balanceAfterTransaction(
                        savedTransaction.getBalanceAfterTransaction())
                .transactionDate(savedTransaction.getTransactionDate())
                .transactionStatus(savedTransaction.getStatus())
                .merchant(savedTransaction.getMerchant())
                .build();
    }

    public List<TransactionResponse> getMyTransaction(){
        User currentUser = authenticationFacade.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUser(currentUser);

        return transactions.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private TransactionResponse mapToResponse(Transaction transaction){
        return TransactionResponse.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .transactionType(transaction.getTransactionType())
                .transactionCategory(transaction.getTransactionCategory())
                .description(transaction.getDescription())
                .balanceAfterTransaction(transaction.getBalanceAfterTransaction())
                .transactionDate(transaction.getTransactionDate())
                .transactionStatus(transaction.getStatus())
                .merchant(transaction.getMerchant())
                .build();
    }

    public BigDecimal getTotalExpenses(User user){
        List<Transaction> transactions = transactionRepository.findByUserAndTransactionType(user,TransactionType.DEBIT);
        BigDecimal total = BigDecimal.ZERO;
        for(Transaction transaction:transactions){
            total = total.add(transaction.getAmount());
        }
        return total;
    }


}
