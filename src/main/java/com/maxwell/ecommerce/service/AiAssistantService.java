package com.maxwell.ecommerce.service;

import com.maxwell.ecommerce.dto.request.AiChatRequest;
import com.maxwell.ecommerce.dto.response.AiChatResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class AiAssistantService {

    private static final String SYSTEM_PROMPT = """
            You are a helpful AI assistant for an e-commerce store.
            You help customers find products, check availability, compare prices, and make informed purchasing decisions.
            You have access to the following tools:
            - searchProducts: search for products by keyword
            - getProductDetails: get full details of a product by its ID

            Always be concise, friendly, and accurate. If a product is out of stock, mention it clearly.
            Format prices with a dollar sign. If you cannot find relevant products, suggest related alternatives.
            """;

    private final ChatClient chatClient;

    public AiAssistantService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
                .defaultSystem(SYSTEM_PROMPT)
                .build();
    }

    @CircuitBreaker(name = "aiService", fallbackMethod = "fallbackChat")
    public AiChatResponse chat(AiChatRequest request) {
        log.info("AI chat request: sessionId={}", request.getSessionId());

        String response = chatClient.prompt()
                .user(request.getMessage())
                .functions("searchProducts", "getProductDetails")
                .call()
                .content();

        String sessionId = request.getSessionId() != null
                ? request.getSessionId()
                : UUID.randomUUID().toString();

        return AiChatResponse.of(response, sessionId);
    }

    public AiChatResponse fallbackChat(AiChatRequest request, Throwable ex) {
        log.warn("AI service unavailable, using fallback. Error: {}", ex.getMessage());
        return AiChatResponse.of(
                "I'm having trouble connecting to my AI service right now. " +
                "You can browse our products at /api/products or search with /api/products/search?keyword=...",
                request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString()
        );
    }
}
