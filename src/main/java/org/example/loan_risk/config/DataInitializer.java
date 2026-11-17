package org.example.loan_risk.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.EmploymentType;
import org.example.loan_risk.enums.Role;
import org.example.loan_risk.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String officerEmail = "ujjawal@gmail.com";
        String officerPassword = "passwordEncoder.encode(\"12345678\")";

        Optional<User> existingUser = userRepository.findByEmail(officerEmail);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setPassword(passwordEncoder.encode("12345678"));
            user.setRole(Role.BANK_OFFICER);
            userRepository.save(user);
            log.info("Initialized Bank Officer account: {} with role: {}", officerEmail, Role.BANK_OFFICER);
        } else {
            User officer = User.builder()
                    .fullName("Ujjawal")
                    .email(officerEmail)
                    .password(passwordEncoder.encode("12345678"))
                    .phoneNumber("9876543210")
                    .monthlyIncome(BigDecimal.valueOf(100000))
                    .employmentType(EmploymentType.SALARIED)
                    .role(Role.BANK_OFFICER)
                    .build();
            userRepository.save(officer);
            log.info("Created Bank Officer account: {} with role: {}", officerEmail, Role.BANK_OFFICER);
        }
    }
}
