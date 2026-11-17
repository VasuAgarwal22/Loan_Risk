
package org.example.loan_risk.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import org.example.loan_risk.dto.ml.MlPredictionRequest;
import org.example.loan_risk.dto.ml.MlPredictionResponse;
import org.example.loan_risk.dto.request.RiskAssessmentRequest;
import org.example.loan_risk.dto.response.RiskAssessmentResponse;

import org.example.loan_risk.entity.LoanApplication;
import org.example.loan_risk.entity.RiskAssessment;
import org.example.loan_risk.entity.User;

import org.example.loan_risk.enums.EmploymentType;
import org.example.loan_risk.enums.LoanStatus;
import org.example.loan_risk.enums.RiskLevel;

import org.example.loan_risk.exception.MlServiceUnavailableException;

import org.example.loan_risk.repository.LoanApplicationRepository;
import org.example.loan_risk.repository.RiskAssessmentRepository;

import org.example.loan_risk.security.AuthenticationFacade;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RiskAssessmentService {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final FinancialAnalysisService financialAnalysisService;
    private final AuthenticationFacade authenticationFacade;
    private final ObjectMapper objectMapper;

    @Value("${ml.service.base-url:http://127.0.0.1:8001}")
    private String mlServiceBaseUrl;

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
        .version(HttpClient.Version.HTTP_1_1)
        .connectTimeout(Duration.ofSeconds(5))
        .build();


    public RiskAssessmentResponse calculateRisk(
            Long loanId,
            RiskAssessmentRequest request) {

        // Get authenticated user
        User user = authenticationFacade.getCurrentUser();

        // Find the selected loan
        LoanApplication loan = loanApplicationRepository.findById(loanId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Loan not found"));

        // Verify loan ownership
        if (!loan.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You are not allowed to access this loan");
        }

        // Student employment is not supported by the trained model
        if (user.getEmploymentType() == EmploymentType.STUDENT) {
            throw new IllegalArgumentException(
                    "The current ML model does not support STUDENT employment.");
        }

        // Validate employment duration against age
        if (request.getEmploymentYears().compareTo(
                BigDecimal.valueOf(request.getAge() - 18L)) > 0) {

            throw new IllegalArgumentException(
                    "Employment duration cannot exceed the number of years since age 18.");
        }

        // Validate loan tenure
        if (loan.getTenureMonths() == null
                || loan.getTenureMonths() < 1
                || loan.getTenureMonths() > 600) {

            throw new IllegalArgumentException(
                    "Loan tenure must be between 1 and 600 months for this model.");
        }

        // Get existing approved loans
        long approvedLoans =
                financialAnalysisService.getExistingLoans(user);

        if (loan.getStatus() == LoanStatus.APPROVED) {
            approvedLoans = Math.max(0, approvedLoans - 1);
        }

        if (approvedLoans > 50) {
            throw new IllegalArgumentException(
                    "The current ML model supports at most 50 existing loans.");
        }

        // Get financial information
        BigDecimal monthlyIncome = user.getMonthlyIncome();

        BigDecimal annualIncome = monthlyIncome.multiply(
                BigDecimal.valueOf(12));

        BigDecimal monthlyExpenses = request.getMonthlyExpenses();
        BigDecimal monthlyDebt = request.getMonthlyDebt();

        // Convert credit utilization percentage (0-100)
        // to model fraction (0-1)
        BigDecimal utilizationFraction =
                request.getCreditUtilization().divide(
                        BigDecimal.valueOf(100),
                        8,
                        RoundingMode.HALF_UP
                );

        // Map employment type to the model's accepted values
        String employmentType = switch (user.getEmploymentType()) {
            case SALARIED -> "Salaried";
            case SELF_EMPLOYED -> "Self-Employed";
            case BUSINESS -> "Business";
            case UNEMPLOYED -> "Unemployed";
            case STUDENT -> throw new IllegalArgumentException(
                    "STUDENT is not supported by the trained model");
        };

        // Build the 17 features expected by FastAPI
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
                .bankAccountAgeYears(
                        request.getBankAccountAgeYears().doubleValue())
                .numCreditCards(request.getNumCreditCards())
                .missedPaymentsLastYear(
                        request.getMissedPaymentsLastYear())
                .previousDefaults(request.getPreviousDefaults())
                .creditUtilization(utilizationFraction.doubleValue())
                .savingsBalance(request.getSavingsBalance().doubleValue())
                .transactionFrequency(
                        request.getTransactionFrequency().doubleValue())
                .build();


        // ----------------------------------------------------
        // SERIALIZE ML REQUEST
        // ----------------------------------------------------

        String mlRequestJson;

        try {
            mlRequestJson =
                    objectMapper.writeValueAsString(mlRequest);

            if (mlRequestJson.isBlank()) {
                throw new IllegalStateException(
                        "ML prediction request JSON is empty");
            }

            int bodySize = mlRequestJson
                    .getBytes(StandardCharsets.UTF_8).length;

            System.out.println(
                    "ML request body size: " + bodySize + " bytes");

        } catch (JsonProcessingException ex) {
            throw new IllegalStateException(
                    "Could not serialize ML prediction request", ex);
        }


        // ----------------------------------------------------
        // SEND REQUEST TO FASTAPI USING JAVA HTTP CLIENT
        // ----------------------------------------------------

        MlPredictionResponse prediction;

        try {

            String endpoint =
                    mlServiceBaseUrl.replaceAll("/+$", "")
                            + "/predict";

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(
                            HttpRequest.BodyPublishers.ofString(
                                    mlRequestJson,
                                    StandardCharsets.UTF_8
                            )
                    )
                    .build();

            HttpResponse<String> httpResponse =
                    HTTP_CLIENT.send(
                            httpRequest,
                            HttpResponse.BodyHandlers.ofString(
                                    StandardCharsets.UTF_8
                            )
                    );

            int statusCode = httpResponse.statusCode();

            System.out.println(
                    "FastAPI HTTP status: " + statusCode);

            // Check whether FastAPI accepted the request
            if (statusCode < 200 || statusCode >= 300) {

                System.err.println(
                        "FastAPI error response: "
                                + httpResponse.body());

                throw new MlServiceUnavailableException(
                        "ML service rejected the request. HTTP status: "
                                + statusCode,
                        new IllegalStateException(httpResponse.body())
                );
            }

            // Convert FastAPI JSON response to Java DTO
            prediction = objectMapper.readValue(
                    httpResponse.body(),
                    MlPredictionResponse.class
            );

        } catch (InterruptedException ex) {

            Thread.currentThread().interrupt();

            throw new MlServiceUnavailableException(
                    "ML prediction request was interrupted.", ex);

        } catch (IOException ex) {

            System.err.println(
                    "ML HTTP communication or response parsing failed: "
                            + ex.getMessage());

            throw new MlServiceUnavailableException(
                    "Could not communicate with the ML prediction service.",
                    ex);
        }


        // ----------------------------------------------------
        // VALIDATE MODEL RESPONSE
        // ----------------------------------------------------

        validatePrediction(prediction);


        // ----------------------------------------------------
        // MAP ML RISK LEVEL
        // ----------------------------------------------------

        RiskLevel riskLevel = switch (prediction.getRiskLevel()) {
            case "Low Risk" -> RiskLevel.LOW;
            case "Moderate Risk" -> RiskLevel.MEDIUM;
            case "High Risk" -> RiskLevel.HIGH;

            default -> throw new IllegalStateException(
                    "Unsupported ML risk level: "
                            + prediction.getRiskLevel());
        };


        // ----------------------------------------------------
        // GENERATE RECOMMENDATION
        // ----------------------------------------------------

        String recommendation = switch (riskLevel) {

            case LOW ->
                    "Lower estimated default risk — continue with standard underwriting review.";

            case MEDIUM ->
                    "Moderate estimated default risk — conduct additional underwriting review.";

            case HIGH ->
                    "Higher estimated default risk — manual underwriting review is strongly recommended.";
        };


        // Convert default probability into an inverse score (0-100)
        int inverseProbabilityScore = (int) Math.round(
                (1.0 - prediction.getDefaultProbability()) * 100.0
        );


        // ----------------------------------------------------
        // SAVE RISK ASSESSMENT
        // ----------------------------------------------------

        RiskAssessment assessment =
                riskAssessmentRepository.findByLoanApplication(loan)
                        .orElseGet(RiskAssessment::new);

        assessment.setMonthlyIncome(monthlyIncome);
        assessment.setMonthlyExpense(monthlyExpenses);
        assessment.setAverageBalance(request.getSavingsBalance());

        assessment.setExistingLoans(
                Math.toIntExact(approvedLoans));

        assessment.setMissedPayments(
                request.getMissedPaymentsLastYear());

        assessment.setCreditUtilization(
                request.getCreditUtilization());

        assessment.setRiskScore(inverseProbabilityScore);
        assessment.setRiskLevel(riskLevel);
        assessment.setRecommendation(recommendation);

        // Save actual ML prediction
        assessment.setPrediction(prediction.getPrediction());

        assessment.setPredictionLabel(
                prediction.getPredictionLabel());

        assessment.setDefaultProbability(
                BigDecimal.valueOf(
                        prediction.getDefaultProbability()));

        assessment.setLoanToIncomeRatio(
                BigDecimal.valueOf(
                        prediction.getLoanToIncomeRatio()));

        assessment.setDebtToIncomeRatio(
                BigDecimal.valueOf(
                        prediction.getDebtToIncomeRatio()));

        // Save the exact input features used by the model
        try {
            assessment.setFeatureSnapshot(
                    objectMapper.writeValueAsString(mlRequest));

        } catch (JsonProcessingException ex) {
            throw new IllegalStateException(
                    "Could not serialize model feature snapshot", ex);
        }

        assessment.setLoanApplication(loan);

        RiskAssessment saved =
                riskAssessmentRepository.save(assessment);


        // ----------------------------------------------------
        // RETURN RESULT TO FRONTEND
        // ----------------------------------------------------

        return RiskAssessmentResponse.builder()
                .riskScore(saved.getRiskScore())
                .prediction(saved.getPrediction())
                .predictionLabel(saved.getPredictionLabel())
                .defaultProbability(
                        saved.getDefaultProbability())
                .riskLevel(saved.getRiskLevel())
                .loanToIncomeRatio(
                        saved.getLoanToIncomeRatio())
                .debtToIncomeRatio(
                        saved.getDebtToIncomeRatio())
                .recommendation(saved.getRecommendation())
                .calculatedAt(saved.getCalculatedAt())
                .build();
    }


    // --------------------------------------------------------
    // VALIDATE FASTAPI RESPONSE
    // --------------------------------------------------------

    private void validatePrediction(
            MlPredictionResponse response) {

        if (response == null
                || response.getPrediction() == null
                || (response.getPrediction() != 0
                    && response.getPrediction() != 1)

                || response.getDefaultProbability() == null
                || !Double.isFinite(
                        response.getDefaultProbability())

                || response.getDefaultProbability() < 0
                || response.getDefaultProbability() > 1

                || response.getRiskLevel() == null

                || response.getLoanToIncomeRatio() == null
                || !Double.isFinite(
                        response.getLoanToIncomeRatio())

                || response.getDebtToIncomeRatio() == null
                || !Double.isFinite(
                        response.getDebtToIncomeRatio())

                || response.getPredictionLabel() == null) {

            throw new IllegalStateException(
                    "ML service returned an invalid prediction response");
        }
    }
}
