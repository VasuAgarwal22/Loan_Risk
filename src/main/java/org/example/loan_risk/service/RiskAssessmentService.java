package org.example.loan_risk.service;

import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.RiskAssessmentRequest;
import org.example.loan_risk.dto.response.RiskAssessmentResponse;
import org.example.loan_risk.entity.LoanApplication;
import org.example.loan_risk.entity.RiskAssessment;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.RiskLevel;
import org.example.loan_risk.repository.LoanApplicationRepository;
import org.example.loan_risk.repository.RiskAssessmentRepository;
import org.example.loan_risk.security.AuthenticationFacade;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class RiskAssessmentService {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final FinancialAnalysisService financialAnalysisService;
    private final AuthenticationFacade authenticationFacade;
    public RiskAssessmentResponse calculateRisk(Long loanId, RiskAssessmentRequest request) {
        User user = authenticationFacade.getCurrentUser();
        LoanApplication loan = loanApplicationRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Loan not found"));

        if(!loan.getUser().getId().equals(user.getId())){

            throw new RuntimeException("You are not llowed to access the loan . It belong to the different user ");

        }
        BigDecimal monthlyIncome = user.getMonthlyIncome();
        BigDecimal monthlyExpenses = financialAnalysisService.getMonthlyExpense(user);
        BigDecimal averageBalance = financialAnalysisService.getAverageBalance(user);

        long existingLoans = financialAnalysisService.getExistingLoans(user);

        request.setMonthlyIncome(monthlyIncome);
        request.setMonthlyExpense(monthlyExpenses);
        request.setAverageBalance(averageBalance);
        request.setExistingLoans((int) existingLoans);

//         ye abhi bnega
        Integer missedPayments = request.getMissedPayments();
        BigDecimal creditUtilization =
                request.getCreditUtilization();
        int score = calculateScore(request);
        RiskLevel riskLevel;
        if (score >= 70) {
            riskLevel = RiskLevel.LOW;
        } else if (score >= 40) {
            riskLevel = RiskLevel.MEDIUM;
        } else {
            riskLevel = RiskLevel.HIGH;
        }
        String recommendation;
        if(riskLevel == RiskLevel.LOW){
            recommendation = "Loan can be considered for approval";
        }else if(riskLevel == RiskLevel.MEDIUM){
            recommendation = "Loan requires further review";
        }else{
            recommendation = "High risk - loan approval is not recommended";
        }
        RiskAssessment assessment = new RiskAssessment();
        assessment.setMonthlyIncome(request.getMonthlyIncome());
        assessment.setMonthlyExpense(request.getMonthlyExpense());
        assessment.setAverageBalance(request.getAverageBalance());
        assessment.setExistingLoans(request.getExistingLoans());
        assessment.setMissedPayments(request.getMissedPayments());
        assessment.setCreditUtilization(request.getCreditUtilization());

        assessment.setRiskScore(score);
        assessment.setRiskLevel(riskLevel);
        assessment.setRecommendation(recommendation);

        assessment.setLoanApplication(loan);

        RiskAssessment savedAssessment = riskAssessmentRepository.save(assessment);
        RiskAssessmentResponse response = new RiskAssessmentResponse();
        response.setRiskScore(savedAssessment.getRiskScore());
        response.setRecommendation(savedAssessment.getRecommendation());
        response.setCalculatedAt(savedAssessment.getCalculatedAt());
        response.setRiskLevel(savedAssessment.getRiskLevel());

        return response;
    }

//    <<<<<<<<<<<----------------------------------ML code ---------------------------------------------->>>>>>>

    private int calculateScore(RiskAssessmentRequest request) {
        int score = 100;
        double expenseRatio = (request.getMonthlyExpense().doubleValue())/(request.getMonthlyIncome().doubleValue());

        if(expenseRatio>0.8){
            score-=30;

        }else if(expenseRatio>0.6){
            score-=15;
        }

        score -= request.getExistingLoans()*5;
        score-=request.getMissedPayments()*10;
        if(request.getCreditUtilization().doubleValue()>80){
            score-=20;
        }else if(request.getCreditUtilization().doubleValue()>50){
            score-=10;
        }
        if(request.getAverageBalance().compareTo(request.getMonthlyIncome())>=0){
            score +=5;
        }
        if(score<0){
            score = 0;
        }
        if(score>100){
            score = 100;
        }
        return score;
    }
//    <<<<<<<<<<<----------------------------------ML code ---------------------------------------------->>>>>>>
}
