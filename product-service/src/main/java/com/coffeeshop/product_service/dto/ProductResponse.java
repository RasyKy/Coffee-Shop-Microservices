package com.coffeeshop.product_service.dto;

import java.math.BigDecimal;

public record ProductResponse(
        String id,
        String name,
        String description,
        BigDecimal price,
        String category,
        String imageUrl,
        Boolean active
) {
}