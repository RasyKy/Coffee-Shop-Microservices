package com.coffeeshop.order_service.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    String id,
    String orderNumber,
    String userId,
    List<OrderLineItemsDto> orderLineItems,
    LocalDateTime createdDate
) {}