package com.coffeeshop.order_service.controller;

import com.coffeeshop.order_service.dto.OrderRequest;
import com.coffeeshop.order_service.model.Order; // Returning Entity for simplicity
import com.coffeeshop.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*; // Includes GetMapping

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> placeOrder(@RequestBody OrderRequest orderRequest) {
        orderService.placeOrder(orderRequest);
        return Collections.singletonMap("message", "Order Placed Successfully");
    }

    @GetMapping("/admin/all")
    @ResponseStatus(HttpStatus.OK)
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // --- NEW ENDPOINT ---
    @GetMapping("/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<Order> getOrders(@PathVariable String userId) {
        return orderService.getOrders(userId);
    }
}