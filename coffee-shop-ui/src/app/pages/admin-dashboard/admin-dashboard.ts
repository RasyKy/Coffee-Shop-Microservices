import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service'; // <--- 1. Import this

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService); // <--- 2. Inject it

  orders: any[] = [];
  products: any[] = []; // Store products to lookup names
  productMap: { [key: string]: string } = {}; // ID -> Name map

  isLoading = true;

  // Stats
  totalRevenue = 0;
  totalOrders = 0;
  popularProduct = 'N/A';

  ngOnInit() {
    // 3. Load BOTH Orders and Products
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // We need products first to map the names correctly
    this.productService.getAllProducts().subscribe({
      next: (prods) => {
        this.products = prods;

        // Create a quick lookup map: { "65abc...": "Caramel Macchiato" }
        this.products.forEach((p) => {
          this.productMap[p.id] = p.name;
          // Also map names to themselves in case skuCode IS already a name
          this.productMap[p.name] = p.name;
        });

        // Now fetch orders
        this.fetchOrders();
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.fetchOrders(); // Try to load orders anyway
      },
    });
  }

  fetchOrders() {
    this.orderService.getAllOrdersAdmin().subscribe({
      next: (data) => {
        this.orders = data;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load admin orders', err);
        this.isLoading = false;
      },
    });
  }

  calculateStats() {
    let revenue = 0;
    const productFrequency: { [key: string]: number } = {};

    this.orders.forEach((order) => {
      if (order.orderLineItemsList) {
        order.orderLineItemsList.forEach((item: any) => {
          revenue += item.price * item.quantity;

          // Get the ID or Name stored in the order
          const rawSku = item.skuCode || 'Unknown';
          const resolvedName = this.productMap[rawSku] || rawSku;

          // Count it
          productFrequency[resolvedName] = (productFrequency[resolvedName] || 0) + item.quantity;
        });
      }
    });

    this.totalRevenue = revenue;
    this.totalOrders = this.orders.length;

    // Find Max
    const topProdEntry = Object.entries(productFrequency).sort((a, b) => b[1] - a[1])[0];

    if (topProdEntry) {
      const id = topProdEntry[0];
      const count = topProdEntry[1];

      // 4. LOOKUP THE NAME HERE
      // If ID exists in our map, use the name. Otherwise use the ID.
      const realName = this.productMap[id] || id;

      this.popularProduct = `${realName}`;
    } else {
      this.popularProduct = 'N/A';
    }
  }

  getProductName(skuCode: string): string {
    return this.productMap[skuCode] || skuCode || 'Unknown';
  }

  // ... keep getOrderTotal helper ...
  getOrderTotal(order: any): number {
    return (
      order.orderLineItemsList?.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0) || 0
    );
  }
}
