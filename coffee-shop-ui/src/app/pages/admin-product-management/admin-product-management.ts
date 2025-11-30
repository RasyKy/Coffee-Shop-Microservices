import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormModal } from '../product-form-modal/product-form-modal'; // Ensure path is correct
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-admin-product-management',
  standalone: true,
  imports: [CommonModule, ProductFormModal],
  templateUrl: './admin-product-management.html',
  styleUrls: ['./admin-product-management.css'],
})
export class AdminProductManagement implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  isLoading = true;

  // Modal State
  showModal = false;
  selectedProduct: Product | null = null;

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

  openModal(product: Product | null): void {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
  }

  // --- THE SAVING LOGIC ---
  handleSave(productData: any) {
    this.isLoading = true;

    const formData = new FormData();

    // 1. Basic Fields
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('category', productData.category);

    // 2. Status: Convert boolean to string for backend
    formData.append('active', String(productData.active));

    // 3. Image: Only append if it's a new File object
    // If it's null (no change) or a string (existing URL), skip it.
    if (productData.image && productData.image instanceof File) {
      formData.append('image', productData.image);
    }

    // 4. Send Request
    if (productData.id) {
      // Update
      this.productService.updateProduct(productData.id, formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Update failed', err);
          this.isLoading = false;
        },
      });
    } else {
      // Create
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Create failed', err);
          this.isLoading = false;
        },
      });
    }
  }

  deleteProduct(productId: string, productName: string): void {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Failed to delete product.'),
      });
    }
  }
}
