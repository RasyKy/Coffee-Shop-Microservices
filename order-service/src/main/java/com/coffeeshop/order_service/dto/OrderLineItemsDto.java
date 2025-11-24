package com.coffeeshop.order_service.dto;

import java.math.BigDecimal;

public record OrderLineItemsDto(
        String id,
        String skuCode,
        BigDecimal price,
        Integer quantity) {
}