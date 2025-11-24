import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class Menu implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  products: any[] = [];
  isLoading = true;
  orderStatus: { message: string; type: 'success' | 'error' } | null = null;

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    // Gateway routing to Product Service
    this.http.get<any[]>('http://localhost:8080/api/products').subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load menu', err);
        this.isLoading = false;
      },
    });
  }

  quickOrder(product: any) {
    const user = this.authService.currentUser();

    // 1. Guard: If not logged in, go to login
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Prepare Order Request
    // Adjust fields based on your exact Java OrderRequest DTO
    const orderRequest = {
      userId: user.id || user.email, // Use whatever ID your backend expects
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
    };

    // 3. Call Service
    this.orderService.placeOrder(orderRequest).subscribe({
      next: (response) => {
        this.showNotification(`Ordered ${product.name} successfully!`, 'success');
      },
      error: (err) => {
        console.error('Order failed', err);
        this.showNotification('Failed to place order. Try again.', 'error');
      },
    });
  }

  // Simple temporary notification helper
  showNotification(message: string, type: 'success' | 'error') {
    this.orderStatus = { message, type };
    setTimeout(() => (this.orderStatus = null), 3000); // Hide after 3 seconds
  }
}
