package org.example.loan_risk.service;

import lombok.RequiredArgsConstructor;
import org.example.loan_risk.dto.request.LoginRequest;
import org.example.loan_risk.dto.request.RegisterRequest;
import org.example.loan_risk.dto.response.LoginResponse;
import org.example.loan_risk.dto.response.UserResponse;
import org.example.loan_risk.entity.User;
import org.example.loan_risk.enums.Role;
import org.example.loan_risk.repository.UserRepository;
import org.example.loan_risk.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .monthlyIncome(request.getMonthlyIncome())
                .employmentType(request.getEmploymentType())
                .role(Role.CUSTOMER)
                .build();
        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .monthlyIncome(user.getMonthlyIncome())
                .employmentType(user.getEmploymentType())
                .role(user.getRole())
                .build();
    }

    public LoginResponse login(LoginRequest request){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));

        String token = jwtService.generateToken(request.getEmail());

        return LoginResponse.builder()
                .token(token).tokenType("Bearer").message("Login Successful").build();
    }

}
