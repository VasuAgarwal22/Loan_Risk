package org.example.loan_risk.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.TransactionRequest;
import org.example.loan_risk.dto.response.TransactionResponse;
import org.example.loan_risk.entity.Transaction;
import org.example.loan_risk.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
private final TransactionService transactionService;

    @PostMapping()
    public ResponseEntity<TransactionResponse> addTransaction(@Valid @RequestBody TransactionRequest request){
        TransactionResponse response = transactionService.addTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getMyTransactions(){
        List<TransactionResponse> responses = transactionService.getMyTransaction();
        return ResponseEntity.ok(responses);
    }


}
