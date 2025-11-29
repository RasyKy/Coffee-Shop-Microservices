import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Remove Router, Import the Modal
import { ProductFormModal } from '../product-form-modal/product-form-modal';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-admin-product-management',
  standalone: true,
  // 2. Add the Modal to imports
  imports: [CommonModule, ProductFormModal],
  templateUrl: './admin-product-management.html',
  styleUrls: ['./admin-product-management.css'],
})
export class AdminProductManagement implements OnInit {
  products: Product[] = [];
  isLoading = true;

  // 3. New State variables for the Modal
  showModal = false;
  selectedProduct: Product | null = null;

  // 4. Removed Router from constructor
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      },
    });
  }

  // 5. Open Modal Logic
  // If product is passed, we are Editing. If null, we are Adding.
  openModal(product: Product | null): void {
    this.selectedProduct = product;
    this.showModal = true;
  }

  // 6. Close Modal Logic
  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
  }

  // 7. Handle the Save event from the Modal
  handleSave(productData: any): void {
    // If we have an ID, we are updating
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: () => {
          this.loadProducts(); // Refresh list
          this.closeModal();
          alert('Product updated successfully');
        },
        error: (err) => alert('Failed to update product'),
      });
    } else {
      // If no ID, we are creating
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts(); // Refresh list
          this.closeModal();
          alert('Product created successfully');
        },
        error: (err) => alert('Failed to create product'),
      });
    }
  }

  deleteProduct(productId: string, productName: string): void {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product.');
        },
      });
    }
  }
}
