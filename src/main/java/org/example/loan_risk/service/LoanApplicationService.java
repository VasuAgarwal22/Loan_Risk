package org.example.loan_risk.service;

import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.LoanApplicationRequest;
import org.example.loan_risk.dto.response.LoanApplicationResponse;
import org.example.loan_risk.entity.LoanApplication;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.LoanStatus;
import org.example.loan_risk.repository.LoanApplicationRepository;
import org.example.loan_risk.security.AuthenticationFacade;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final AuthenticationFacade authenticationFacade;

    public LoanApplicationResponse applyForLoan(LoanApplicationRequest request){

        User currentUser = authenticationFacade.getCurrentUser();

        LoanApplication loan = new LoanApplication();

        loan.setLoanAmount(request.getLoanAmount());
        loan.setTenureMonths(request.getTenureMonths());
        loan.setPurpose(request.getPurpose());
        loan.setStatus(LoanStatus.PENDING);
        loan.setUser(currentUser);
        loan.setInterestRate(BigDecimal.ZERO);

        LoanApplication savedLoan = loanApplicationRepository.save(loan);

        LoanApplicationResponse response = new LoanApplicationResponse();

        response.setId(savedLoan.getId());
        response.setLoanAmount(savedLoan.getLoanAmount());
        response.setTenureMonths(savedLoan.getTenureMonths());
        response.setPurpose(savedLoan.getPurpose());
        response.setStatus(savedLoan.getStatus());
        response.setAppliedAt(savedLoan.getAppliedAt());
        response.setInterestRate(savedLoan.getInterestRate());
        return response;

    }

    public List<LoanApplicationResponse> getMyLoans(){
        User currentUser = authenticationFacade.getCurrentUser();
        List<LoanApplication> loans = loanApplicationRepository.findByUser(currentUser);
        List<LoanApplicationResponse> responseList = new ArrayList<>();
        for(LoanApplication loan : loans){
            LoanApplicationResponse response = new LoanApplicationResponse();
            response.setId(loan.getId());
            response.setLoanAmount(loan.getLoanAmount());
            response.setTenureMonths(loan.getTenureMonths());
            response.setInterestRate(loan.getInterestRate());
            response.setPurpose(loan.getPurpose());
            response.setStatus(loan.getStatus());
            response.setAppliedAt(loan.getAppliedAt());
            responseList.add(response);
        }
        return responseList;

    }
}
