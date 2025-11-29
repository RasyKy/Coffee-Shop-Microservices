package com.coffeeshop.product_service.repository;

import com.coffeeshop.product_service.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
    // Spring Data MongoDB will automatically create methods like
    // findAll(), findById(), save(), etc.
}
