package org.example.loan_risk.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.ml.MlPredictionRequest;
import org.example.loan_risk.dto.ml.MlPredictionResponse;
import org.example.loan_risk.dto.request.RiskAssessmentRequest;
import org.example.loan_risk.dto.response.RiskAssessmentResponse;
import org.example.loan_risk.entity.LoanApplication;
import org.example.loan_risk.exception.MlServiceUnavailableException;
import org.example.loan_risk.entity.RiskAssessment;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.EmploymentType;
import org.example.loan_risk.enums.LoanStatus;
import org.example.loan_risk.enums.RiskLevel;
import org.example.loan_risk.repository.LoanApplicationRepository;
import org.example.loan_risk.repository.RiskAssessmentRepository;
import org.example.loan_risk.security.AuthenticationFacade;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class RiskAssessmentService {
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final FinancialAnalysisService financialAnalysisService;
    private final AuthenticationFacade authenticationFacade;
    private final RestClient mlRestClient;
    private final ObjectMapper objectMapper;

    public RiskAssessmentResponse calculateRisk(Long loanId, RiskAssessmentRequest request) {
        User user = authenticationFacade.getCurrentUser();
        LoanApplication loan = loanApplicationRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));

        if (!loan.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You are not allowed to access this loan");
        }
        if (user.getEmploymentType() == EmploymentType.STUDENT) {
            throw new IllegalArgumentException("The current ML model does not support STUDENT employment.");
        }
        if (request.getEmploymentYears().compareTo(BigDecimal.valueOf(request.getAge() - 18L)) > 0) {
            throw new IllegalArgumentException("Employment duration cannot exceed the number of years since age 18.");
        }

        if (loan.getTenureMonths() == null || loan.getTenureMonths() < 1 || loan.getTenureMonths() > 600) {
            throw new IllegalArgumentException("Loan tenure must be between 1 and 600 months for this model.");
        }

        long approvedLoans = financialAnalysisService.getExistingLoans(user);
        if (loan.getStatus() == LoanStatus.APPROVED) approvedLoans = Math.max(0, approvedLoans - 1);
        if (approvedLoans > 50) {
            throw new IllegalArgumentException("The current ML model supports at most 50 existing loans.");
        }

        BigDecimal monthlyIncome = user.getMonthlyIncome();
        BigDecimal annualIncome = monthlyIncome.multiply(BigDecimal.valueOf(12));
        BigDecimal monthlyExpenses = request.getMonthlyExpenses();
        BigDecimal monthlyDebt = request.getMonthlyDebt();
        BigDecimal utilizationFraction = request.getCreditUtilization()
                .divide(BigDecimal.valueOf(100), 8, RoundingMode.HALF_UP);

        String employmentType = switch (user.getEmploymentType()) {
            case SALARIED -> "Salaried";
            case SELF_EMPLOYED -> "Self-Employed";
            case BUSINESS -> "Business";
            case UNEMPLOYED -> "Unemployed";
            case STUDENT -> throw new IllegalArgumentException("STUDENT is not supported by the trained model");
        };

        MlPredictionRequest mlRequest = MlPredictionRequest.builder()
                .age(request.getAge())
                .employmentType(employmentType)
                .annualIncome(annualIncome.doubleValue())
                .creditScore(request.getCreditScore().doubleValue())
                .loanAmount(loan.getLoanAmount().doubleValue())
                .loanTenureMonths(loan.getTenureMonths())
                .existingLoans(Math.toIntExact(approvedLoans))
                .monthlyDebt(monthlyDebt.doubleValue())
                .monthlyExpenses(monthlyExpenses.doubleValue())
                .employmentYears(request.getEmploymentYears().doubleValue())
                .bankAccountAgeYears(request.getBankAccountAgeYears().doubleValue())
                .numCreditCards(request.getNumCreditCards())
                .missedPaymentsLastYear(request.getMissedPaymentsLastYear())
                .previousDefaults(request.getPreviousDefaults())
                .creditUtilization(utilizationFraction.doubleValue())
                .savingsBalance(request.getSavingsBalance().doubleValue())
                .transactionFrequency(request.getTransactionFrequency().doubleValue())
                .build();

        MlPredictionResponse prediction;
        try {
            prediction = mlRestClient.post().uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON).body(mlRequest)
                    .retrieve().body(MlPredictionResponse.class);
        } catch (RestClientException ex) {
            throw new MlServiceUnavailableException("ML prediction service is unavailable or rejected the request", ex);
        }

        validatePrediction(prediction);
        RiskLevel riskLevel = switch (prediction.getRiskLevel()) {
            case "Low Risk" -> RiskLevel.LOW;
            case "Moderate Risk" -> RiskLevel.MEDIUM;
            case "High Risk" -> RiskLevel.HIGH;
            default -> throw new IllegalStateException("Unsupported ML risk level: " + prediction.getRiskLevel());
        };
        String recommendation = switch (riskLevel) {
            case LOW -> "Lower estimated default risk — continue with standard underwriting review.";
            case MEDIUM -> "Moderate estimated default risk — conduct additional underwriting review.";
            case HIGH -> "Higher estimated default risk — manual underwriting review is strongly recommended.";
        };
        int inverseProbabilityScore = (int) Math.round((1.0 - prediction.getDefaultProbability()) * 100.0);

        RiskAssessment assessment = riskAssessmentRepository.findByLoanApplication(loan)
                .orElseGet(RiskAssessment::new);
        assessment.setMonthlyIncome(monthlyIncome);
        assessment.setMonthlyExpense(monthlyExpenses);
        assessment.setAverageBalance(request.getSavingsBalance());
        assessment.setExistingLoans(Math.toIntExact(approvedLoans));
        assessment.setMissedPayments(request.getMissedPaymentsLastYear());
        assessment.setCreditUtilization(request.getCreditUtilization());
        assessment.setRiskScore(inverseProbabilityScore);
        assessment.setRiskLevel(riskLevel);
        assessment.setRecommendation(recommendation);
        assessment.setPrediction(prediction.getPrediction());
        assessment.setPredictionLabel(prediction.getPredictionLabel());
        assessment.setDefaultProbability(BigDecimal.valueOf(prediction.getDefaultProbability()));
        assessment.setLoanToIncomeRatio(BigDecimal.valueOf(prediction.getLoanToIncomeRatio()));
        assessment.setDebtToIncomeRatio(BigDecimal.valueOf(prediction.getDebtToIncomeRatio()));
        try {
            assessment.setFeatureSnapshot(objectMapper.writeValueAsString(mlRequest));
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Could not serialize model feature snapshot", ex);
        }
        assessment.setLoanApplication(loan);

        RiskAssessment saved = riskAssessmentRepository.save(assessment);
        return RiskAssessmentResponse.builder()
                .riskScore(saved.getRiskScore())
                .prediction(saved.getPrediction())
                .predictionLabel(saved.getPredictionLabel())
                .defaultProbability(saved.getDefaultProbability())
                .riskLevel(saved.getRiskLevel())
                .loanToIncomeRatio(saved.getLoanToIncomeRatio())
                .debtToIncomeRatio(saved.getDebtToIncomeRatio())
                .recommendation(saved.getRecommendation())
                .calculatedAt(saved.getCalculatedAt())
                .build();
    }

    private void validatePrediction(MlPredictionResponse response) {
        if (response == null || response.getPrediction() == null ||
                (response.getPrediction() != 0 && response.getPrediction() != 1) ||
                response.getDefaultProbability() == null ||
                !Double.isFinite(response.getDefaultProbability()) ||
                response.getDefaultProbability() < 0 || response.getDefaultProbability() > 1 ||
                response.getRiskLevel() == null ||
                response.getLoanToIncomeRatio() == null || !Double.isFinite(response.getLoanToIncomeRatio()) ||
                response.getDebtToIncomeRatio() == null || !Double.isFinite(response.getDebtToIncomeRatio()) ||
                response.getPredictionLabel() == null) {
            throw new IllegalStateException("ML service returned an invalid prediction response");
        }
    }
}
