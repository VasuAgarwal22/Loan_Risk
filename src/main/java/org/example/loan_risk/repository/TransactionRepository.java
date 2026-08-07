package org.example.loan_risk.repository;

import org.example.loan_risk.entity.Transaction;
import org.example.loan_risk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    List<Transaction> findByUser(User user);

}
