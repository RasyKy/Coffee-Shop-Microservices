import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for ngClass
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class Menu implements OnInit {
  private http = inject(HttpClient);
  private cartService = inject(CartService);

  allProducts: any[] = [];
  filteredProducts: any[] = [];
  isLoading = true;

  // Filters
  searchQuery: string = '';
  selectedCategory: string = 'All';
  categories: string[] = ['All', 'Drink', 'Pastry', 'Food']; // Added 'Food' as example

  // Toast State (Replaces Alert)
  toast = { show: false, message: '' };

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<any[]>('http://localhost:8080/api/products').subscribe({
      next: (data) => {
        this.allProducts = data;
        this.filteredProducts = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      },
    });
  }

  // --- Filtering Logic ---
  onFilterChange(): void {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredProducts = this.allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(query);
      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category?.toLowerCase() === this.selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }

  // Helper to switch category via Pills
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.onFilterChange();
  }

  addToCart(product: any): void {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });

    // Show Custom Toast
    this.showToast(`${product.name} added to cart`);
  }

  private showToast(message: string) {
    this.toast = { show: true, message };
    setTimeout(() => {
      this.toast.show = false;
    }, 3000); // Hide after 3 seconds
  }
}
