package org.example.loan_risk.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class MlServiceConfig {
    @Bean
    RestClient mlRestClient(
            RestClient.Builder builder,
            @Value("${ml.service.base-url:http://127.0.0.1:8001}") String baseUrl) {
        return builder.baseUrl(baseUrl).build();
    }
}
