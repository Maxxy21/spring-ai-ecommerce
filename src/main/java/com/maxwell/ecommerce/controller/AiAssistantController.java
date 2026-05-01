package com.maxwell.ecommerce.controller;

import com.maxwell.ecommerce.dto.request.AiChatRequest;
import com.maxwell.ecommerce.dto.response.AiChatResponse;
import com.maxwell.ecommerce.service.AiAssistantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Assistant", description = "Spring AI powered product assistant with function calling")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/chat")
    @Operation(
            summary = "Chat with the AI product assistant",
            description = "Send a message and get an AI response. The assistant can search products and retrieve details using function calling."
    )
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiAssistantService.chat(request));
    }
}
