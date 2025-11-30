import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { OrderService, Order } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

// --- FIX: Manual Registration to prevent "category is not a registered scale" ---
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
Chart.register(...registerables); 
// -------------------------------------------------------------------------------

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  providers: [DatePipe],
  templateUrl: './admin-dashboard.html',
  styles: [`
    .icon-square { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
    .fs-7 { font-size: 0.75rem; letter-spacing: 0.5px; }
  `]
})
export class AdminDashboard implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private datePipe = inject(DatePipe);

  orders: Order[] = [];
  products: any[] = [];
  productMap: { [key: string]: string } = {};

  isLoading = true;
  totalRevenue = 0;
  totalOrders = 0;
  popularProduct = 'N/A';

  public barChartLegend = false;
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Sales' }],
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { 
        type: 'category', // Explicitly state type
        grid: { display: false }, 
        ticks: { font: { family: 'system-ui', size: 11 } } 
      },
      y: { 
        beginAtZero: true, 
        grid: { color: '#f1f5f9' }, 
        border: { display: false } 
      },
    },
    elements: {
      bar: { backgroundColor: '#3b82f6', borderRadius: 4, hoverBackgroundColor: '#2563eb' },
    },
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (prods) => {
        this.products = prods;
        prods.forEach((p) => {
          if (p.id) this.productMap[p.id] = p.name;
          this.productMap[p.name] = p.name;
        });
        this.fetchOrders();
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.fetchOrders();
      },
    });
  }

  fetchOrders() {
    this.orderService.getAllOrdersAdmin().subscribe({
      next: (data) => {
        this.orders = data;
        
        // Debug Log
        console.log('Orders Loaded:', this.orders.length);
        
        this.calculateStats();
        this.processChartData();
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
      const items = order.orderLineItems || order.orderLineItemsList || [];
      items.forEach((item) => {
        revenue += item.price * item.quantity;
        const name = this.getProductName(item.skuCode);
        productFrequency[name] = (productFrequency[name] || 0) + item.quantity;
      });
    });

    this.totalRevenue = revenue;
    this.totalOrders = this.orders.length;

    const topProdEntry = Object.entries(productFrequency).sort((a, b) => b[1] - a[1])[0];
    this.popularProduct = topProdEntry ? topProdEntry[0] : 'N/A';
  }

  processChartData() {
    const salesByDate: { [key: string]: number } = {};

    this.orders.forEach((order) => {
      if (!order.createdDate) return;

      try {
        const dateStr = String(order.createdDate);
        // Handle ISO String "2025-11-30T..."
        const dateKey = dateStr.split('T')[0];

        const items = order.orderLineItems || order.orderLineItemsList || [];
        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        salesByDate[dateKey] = (salesByDate[dateKey] || 0) + total;
      } catch (e) {
        console.warn('Chart date error', e);
      }
    });

    const sortedDates = Object.keys(salesByDate).sort();
    const labels = sortedDates.map((date) => this.datePipe.transform(date, 'MMM d') || date);
    const data = sortedDates.map((date) => salesByDate[date]);

    this.barChartData = {
      labels: labels,
      datasets: [{ data: data, label: 'Revenue', barThickness: 40, maxBarThickness: 60 }],
    };
  }

  getProductName(skuCode: string): string {
    return this.productMap[skuCode] || skuCode || 'Unknown';
  }

  getOrderTotal(order: Order): number {
    const items = order.orderLineItems || order.orderLineItemsList || [];
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}