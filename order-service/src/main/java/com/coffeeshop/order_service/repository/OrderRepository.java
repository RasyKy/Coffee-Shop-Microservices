package com.coffeeshop.order_service.repository;

import com.coffeeshop.order_service.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    // New method to find orders by User ID
    List<Order> findByUserId(String userId);
}