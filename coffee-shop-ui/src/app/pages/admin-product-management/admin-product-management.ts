import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-admin-product-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-product-management.html',
  styleUrls: ['./admin-product-management.css'],
})
export class AdminProductManagementComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  constructor(private productService: ProductService, private router: Router) {}

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

  navigateToAddProduct(): void {
    // FIX: Changed from '/admin-add-product' to '/admin/add-product'
    this.router.navigate(['/admin/add-product']);
  }

  editProduct(productId: string): void {
    // FIX: Changed from '/admin-edit-product' to '/admin/edit-product'
    this.router.navigate(['/admin/edit-product', productId]);
  }

  deleteProduct(productId: string, productName: string): void {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        },
      });
    }
  }
}
