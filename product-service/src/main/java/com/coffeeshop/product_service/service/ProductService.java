package com.coffeeshop.product_service.service;

import com.coffeeshop.product_service.dto.ProductRequest;
import com.coffeeshop.product_service.dto.ProductResponse;
import com.coffeeshop.product_service.model.Product;
import com.coffeeshop.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;

    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = Product.builder()
                .name(productRequest.name())
                .description(productRequest.description())
                .price(productRequest.price())
                .category(productRequest.category())
                .imageUrl(productRequest.imageUrl())
                .status(productRequest.status() != null ? productRequest.status() : "Available")
                .build();

        productRepository.save(product);
        log.info("Product {} is saved", product.getId());
        return mapToProductResponse(product);
    }

    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        log.info("Product {} retrieved", id);
        return mapToProductResponse(product);
    }

    public ProductResponse updateProduct(String id, ProductRequest productRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existingProduct.setName(productRequest.name());
        existingProduct.setDescription(productRequest.description());
        existingProduct.setPrice(productRequest.price());
        existingProduct.setCategory(productRequest.category());
        existingProduct.setImageUrl(productRequest.imageUrl());
        existingProduct.setStatus(productRequest.status() != null ? productRequest.status() : "Available");

        productRepository.save(existingProduct);
        log.info("Product {} updated", id);
        return mapToProductResponse(existingProduct);
    }

    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
        log.info("Product {} deleted", id);
    }

    private ProductResponse mapToProductResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getImageUrl(),
                product.getStatus()
        );
    }
}