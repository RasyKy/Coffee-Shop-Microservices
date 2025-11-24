import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <--- IMPORT THIS
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- ADD HERE
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class Menu implements OnInit {
  // Data containers
  allProducts: any[] = []; // The master list from DB
  filteredProducts: any[] = []; // The list currently displayed

  isLoading = true;
  orderStatus: { type: 'success' | 'error'; message: string } | null = null;

  // Filter controls
  searchQuery: string = '';
  selectedCategory: string = 'All';
  categories: string[] = ['All', 'Drink', 'Pastry'];

  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<any[]>('http://localhost:8080/api/products').subscribe({
      next: (data) => {
        this.allProducts = data;
        this.filteredProducts = data; // Show all initially
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
      // 1. Check Name Search
      const matchesSearch = product.name.toLowerCase().includes(query);

      // 2. Check Category (Case insensitive comparison)
      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category?.toLowerCase() === this.selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }

  addToCart(product: any): void {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    // Optional: Use a toast instead of alert for better UX
    alert(`${product.name} added to cart!`);
  }
}
