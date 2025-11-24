import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class Orders implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  orders: any[] = [];
  isLoading = true;

  ngOnInit() {
    const user = this.authService.currentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Use the ID (or email if that's what you used for ID)
    const userId = user.id || user.email;

    this.orderService.getOrders(userId).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.isLoading = false;
      }
    });
  }
}