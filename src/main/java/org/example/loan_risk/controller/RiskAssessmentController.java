package org.example.loan_risk.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.RiskAssessmentRequest;
import org.example.loan_risk.dto.response.RiskAssessmentResponse;
import org.example.loan_risk.repository.RiskAssessmentRepository;
import org.example.loan_risk.service.RiskAssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
public class RiskAssessmentController {
    private final RiskAssessmentService riskAssessmentService;

    @PostMapping("/{loanId}")
    public ResponseEntity<RiskAssessmentResponse> calculateRisk(@PathVariable Long loanId, @Valid @RequestBody RiskAssessmentRequest request){
        RiskAssessmentResponse response = riskAssessmentService.calculateRisk(loanId,request);
        return ResponseEntity.ok(response);
    }
}
