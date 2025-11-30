import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service'; // <--- Import this
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './order.html', // Ensure this matches your file name
  styleUrls: ['./order.css'],
})
export class Orders implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private productService = inject(ProductService); // <--- Inject ProductService
  private router = inject(Router);

  orders: any[] = [];
  productMap: { [key: string]: string } = {}; // <--- The Dictionary
  isLoading = true;

  ngOnInit() {
    const user = this.authService.currentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // 1. FETCH PRODUCTS FIRST (To get the names)
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Build the dictionary: { "product_id_123": "Cappuccino" }
        products.forEach((p) => {
          if (p.id) this.productMap[p.id] = p.name;
        });

        // 2. FETCH ORDERS AFTER
        this.loadOrders(user.id || user.email);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        // Load orders anyway, even if names fail
        this.loadOrders(user.id || user.email);
      },
    });
  }

  loadOrders(userId: string) {
    this.orderService.getOrders(userId).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.isLoading = false;
      },
    });
  }

  // <--- Helper to translate ID to Name
  getProductName(skuCode: string): string {
    // Try to find the name in our map, otherwise show the ID
    return this.productMap[skuCode] || skuCode || 'Unknown Item';
  }

  // <--- Helper to calculate total price
  getOrderTotal(order: any): number {
    const items = order.orderLineItems || order.orderLineItemsList || [];
    return items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  }
}
