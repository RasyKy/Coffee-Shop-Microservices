package com.coffeeshop.order_service.service;

import com.coffeeshop.order_service.dto.OrderLineItemsDto;
import com.coffeeshop.order_service.dto.OrderRequest;
import com.coffeeshop.order_service.dto.OrderResponse;
import com.coffeeshop.order_service.model.Order;
import com.coffeeshop.order_service.model.OrderLineItems;
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

        List<OrderLineItems> orderLineItems = orderRequest.orderLineItemsDtoList()
                .stream()
                .map(this::mapToModel)
                .toList();

        order.setOrderLineItemsList(orderLineItems);
        orderRepository.save(order);
    }

    public List<OrderResponse> getOrders(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    private OrderLineItems mapToModel(OrderLineItemsDto orderLineItemsDto) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setPrice(orderLineItemsDto.price());
        orderLineItems.setQuantity(orderLineItemsDto.quantity());
        orderLineItems.setSkuCode(orderLineItemsDto.skuCode());
        return orderLineItems;
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getUserId(),
                order.getOrderLineItemsList().stream().map(this::mapToDto).toList(),
                order.getCreatedDate());
    }

    private OrderLineItemsDto mapToDto(OrderLineItems item) {
        return new OrderLineItemsDto(
                item.getId(),
                item.getSkuCode(),
                item.getPrice(),
                item.getQuantity());
    }
}