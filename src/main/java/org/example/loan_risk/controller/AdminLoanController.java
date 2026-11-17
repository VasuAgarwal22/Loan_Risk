package org.example.loan_risk.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.UpdateLoanStatusRequest;
import org.example.loan_risk.dto.response.AdminLoanResponse;
import org.example.loan_risk.service.AdminLoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/loans")
@RequiredArgsConstructor
public class AdminLoanController {

    private final AdminLoanService adminLoanService;

    @GetMapping
    public ResponseEntity<List<AdminLoanResponse>> getAllLoans() {
        List<AdminLoanResponse> loans = adminLoanService.getAllLoans();
        return ResponseEntity.ok(loans);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AdminLoanResponse> updateLoanStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLoanStatusRequest request) {
        AdminLoanResponse response = adminLoanService.updateLoanStatus(id, request);
        return ResponseEntity.ok(response);
    }
}
