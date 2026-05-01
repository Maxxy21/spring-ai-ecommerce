package com.maxwell.ecommerce.service;

import com.maxwell.ecommerce.ai.ProductFunctions.ProductDetailRequest;
import com.maxwell.ecommerce.ai.ProductFunctions.ProductSearchRequest;
import com.maxwell.ecommerce.ai.ProductFunctions.ProductSummary;
import com.maxwell.ecommerce.dto.request.AiChatRequest;
import com.maxwell.ecommerce.dto.response.AiChatResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.function.FunctionToolCallback;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.function.Function;

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
    private final Function<ProductSearchRequest, List<ProductSummary>> searchProducts;
    private final Function<ProductDetailRequest, Object> getProductDetails;

    public AiAssistantService(
            ChatClient.Builder chatClientBuilder,
            Function<ProductSearchRequest, List<ProductSummary>> searchProducts,
            Function<ProductDetailRequest, Object> getProductDetails) {
        this.chatClient = chatClientBuilder
                .defaultSystem(SYSTEM_PROMPT)
                .build();
        this.searchProducts = searchProducts;
        this.getProductDetails = getProductDetails;
    }

    @CircuitBreaker(name = "aiService", fallbackMethod = "fallbackChat")
    public AiChatResponse chat(AiChatRequest request) {
        log.info("AI chat request: sessionId={}", request.getSessionId());

        String response = chatClient.prompt()
                .user(request.getMessage())
                .toolCallbacks(
                    FunctionToolCallback.builder("searchProducts", searchProducts)
                        .description("Search for products by keyword. Returns a list of matching products with name, price, and availability.")
                        .inputType(ProductSearchRequest.class)
                        .build(),
                    FunctionToolCallback.builder("getProductDetails", getProductDetails)
                        .description("Get detailed information about a specific product by its ID.")
                        .inputType(ProductDetailRequest.class)
                        .build()
                )
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
