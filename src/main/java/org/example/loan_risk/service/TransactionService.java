package org.example.loan_risk.service;

import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.TransactionRequest;
import org.example.loan_risk.dto.response.TransactionResponse;
import org.example.loan_risk.entity.Transaction;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.repository.TransactionRepository;
import org.example.loan_risk.security.AuthenticationFacade;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService{
    private final TransactionRepository transactionRepository;
    private final AuthenticationFacade authenticationFacade;

    public TransactionResponse addTransaction(TransactionRequest request){
        User currentUser = authenticationFacade.getCurrentUser();
        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .transactionType(request.getTransactionType())
                .transactionCategory(request.getTransactionCategory())
                .description(request.getDescription())
                .balanceAfterTransaction(request.getBalanceAfterTransaction())
                .merchant(request.getMerchant())
                .status(request.getTransactionStatus())
                .user(currentUser)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);

        return TransactionResponse.builder()
                .id(savedTransaction.getId())
                .amount(savedTransaction.getAmount())
                .transactionType(savedTransaction.getTransactionType())
                .transactionCategory(savedTransaction.getTransactionCategory())
                .description(savedTransaction.getDescription())
                .balanceAfterTransaction(savedTransaction.getBalanceAfterTransaction())
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

}
