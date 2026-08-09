package org.example.loan_risk.repository;

import org.example.loan_risk.entity.Transaction;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    List<Transaction> findByUser(User user);

    Optional<Transaction> findTopByUserOrderByTransactionDateDescIdDesc(User currentUser);
    List<Transaction> findByUserAndTransactionType(User user, TransactionType transactionType);
}
