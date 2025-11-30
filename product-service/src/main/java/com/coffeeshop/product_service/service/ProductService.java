package com.coffeeshop.product_service.service;

import com.coffeeshop.product_service.dto.ProductRequest;
import com.coffeeshop.product_service.dto.ProductResponse;
import com.coffeeshop.product_service.model.Product;
import com.coffeeshop.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    // FIX 4: Use the Docker volume path
    private final String UPLOAD_DIR = "/app/images/";

    public ProductResponse createProduct(ProductRequest productRequest) {
        // 1. Handle Image Upload
        String imageUrl = saveImage(productRequest.getImage());

        // 2. Map DTO to Entity
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .category(productRequest.getCategory())
                .imageUrl(imageUrl)
                .active(productRequest.getActive() != null ? productRequest.getActive() : true)
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
        return mapToProductResponse(product);
    }

    public ProductResponse updateProduct(String id, ProductRequest productRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // 1. Update fields
        existingProduct.setName(productRequest.getName());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setPrice(productRequest.getPrice());
        existingProduct.setCategory(productRequest.getCategory());
        existingProduct.setActive(productRequest.getActive());

        // 2. Handle Image Update logic
        if (productRequest.getImage() != null && !productRequest.getImage().isEmpty()) {
            String newImageUrl = saveImage(productRequest.getImage());
            existingProduct.setImageUrl(newImageUrl);
        }

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

    // --- Helper to Save File to Disk ---
    private String saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // Ensure directory exists
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // FIX 5: Return relative path for NGINX
            return "images/" + filename;

        } catch (IOException e) {
            log.error("Could not save image file", e);
            throw new RuntimeException("Could not save image file");
        }
    }

    private ProductResponse mapToProductResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getImageUrl(),
                product.getActive());
    }
}