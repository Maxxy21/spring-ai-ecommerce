package com.maxwell.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public infrastructure
                        .requestMatchers("/actuator/health", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // Public read-only product & category browsing
                        .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**").permitAll()
                        // AI chat is public
                        .requestMatchers("/api/ai/**").permitAll()
                        // Cart & orders require authentication
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers("/api/orders/**").authenticated()
                        // Product/category write operations require authentication
                        .requestMatchers(HttpMethod.POST, "/api/products/**", "/api/categories/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/products/**", "/api/categories/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/products/**", "/api/categories/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**", "/api/categories/**").authenticated()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
