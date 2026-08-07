package org.example.loan_risk.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.loan_risk.enums.RiskLevel;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAssessmentResponse {
    
    private Integer riskScore;
    private RiskLevel riskLevel;
    private String recommendation;
    private LocalDateTime calculatedAt;

}
