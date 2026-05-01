package com.maxwell.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class CartNotFoundException extends RuntimeException {

    public CartNotFoundException(String userId) {
        super("Cart not found for user: " + userId);
    }
}
