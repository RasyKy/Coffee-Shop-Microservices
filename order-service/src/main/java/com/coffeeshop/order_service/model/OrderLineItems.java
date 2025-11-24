package com.coffeeshop.order_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderLineItems {
    private String id;
    private String skuCode;
    private BigDecimal price;
    private Integer quantity;
}