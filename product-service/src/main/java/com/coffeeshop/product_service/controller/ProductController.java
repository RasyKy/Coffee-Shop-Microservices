package com.coffeeshop.product_service.controller;

import com.coffeeshop.product_service.dto.ProductRequest;
import com.coffeeshop.product_service.dto.ProductResponse;
import com.coffeeshop.product_service.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor // 1. Uses Constructor Injection (Better than @Autowired)
public class ProductController {

    private final ProductService productService; // 2. Calls the Service, not the Repo

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(@RequestBody @Valid ProductRequest productRequest) {
        // 3. Converts JSON -> DTO -> Entity -> Saves -> Returns DTO
        return productService.createProduct(productRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }
}