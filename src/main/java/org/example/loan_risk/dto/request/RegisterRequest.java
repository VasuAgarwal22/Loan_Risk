package org.example.loan_risk.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.loan_risk.enums.EmploymentType;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Full Name is Required")
    private String fullName;

    @Email(message = "Invalid Email")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 8,message = "Password must be atLeast 8 characters")
    private String password;

    @Pattern(regexp = "^[6-9]\\d{9}$",message = "Invalid Phone Number ")
    private String phoneNumber;


    @Positive(message = "Monthly Income should be Positive")
    private BigDecimal monthlyIncome;
    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;
    
}
