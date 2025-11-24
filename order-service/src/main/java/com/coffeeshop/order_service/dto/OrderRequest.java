package com.coffeeshop.order_service.dto;

import java.util.List;

public record OrderRequest(
    String userId, // <--- ADD THIS FIELD
    List<OrderLineItemsDto> orderLineItemsDtoList
) {}