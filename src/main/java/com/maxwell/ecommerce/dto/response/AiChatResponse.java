package com.maxwell.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AiChatResponse {

    private String message;
    private String sessionId;
    private LocalDateTime timestamp;

    public static AiChatResponse of(String message, String sessionId) {
        return AiChatResponse.builder()
                .message(message)
                .sessionId(sessionId)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
