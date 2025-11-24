package com.coffeeshop.order_service.service;

import com.coffeeshop.order_service.dto.OrderRequest;
import com.coffeeshop.order_service.dto.OrderLineItemsDto; // The Record
import com.coffeeshop.order_service.model.Order;
import com.coffeeshop.order_service.model.OrderLineItems;   // The Class
import com.coffeeshop.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;

    public void placeOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setUserId(orderRequest.userId());

        // Map the List of DTOs -> List of Models
        List<OrderLineItems> orderLineItems = orderRequest.orderLineItemsDtoList()
                .stream()
                .map(this::mapToModel) // Helper method below
                .toList();

        order.setOrderLineItemsList(orderLineItems);
        orderRepository.save(order);
    }

    // New method to fetch history
    public List<Order> getOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }

    // Helper: Converts DTO (Input) to Model (Database)
    private OrderLineItems mapToModel(OrderLineItemsDto orderLineItemsDto) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setPrice(orderLineItemsDto.price());
        orderLineItems.setQuantity(orderLineItemsDto.quantity());
        orderLineItems.setSkuCode(orderLineItemsDto.skuCode());
        return orderLineItems;
    }
}