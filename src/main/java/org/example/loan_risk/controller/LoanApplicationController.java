package org.example.loan_risk.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.LoanApplicationRequest;
import org.example.loan_risk.dto.response.LoanApplicationResponse;
import org.example.loan_risk.entity.LoanApplication;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.service.LoanApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;

    @PostMapping
    public ResponseEntity<LoanApplicationResponse> applyForLoan(@Valid @RequestBody LoanApplicationRequest request){
        LoanApplicationResponse response = loanApplicationService.applyForLoan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<LoanApplicationResponse>> getMyLoans(){
        List<LoanApplicationResponse> response = loanApplicationService.getMyLoans();
        return ResponseEntity.ok(response);
    }

}
