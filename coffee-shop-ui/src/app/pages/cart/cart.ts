import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent {
  public cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;

  updateQuantity(productId: string, newQuantity: number): void {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  removeItem(productId: string): void {
    if (confirm('Remove this item from cart?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  proceedToCheckout(): void {
    // 1. Validation: Is cart empty?
    if (this.cartService.getItemCount() === 0) {
      alert('Your cart is empty!');
      return;
    }

    // 2. Validation: Is user logged in?
    const user = this.authService.currentUser();
    if (!user) {
      alert('Please login to place an order.');
      this.router.navigate(['/login']);
      return;
    }

    // 3. Prepare Data for Backend
    this.isLoading = true;

    // Map Frontend Cart Items -> Backend OrderLineItemsDto
    const orderLineItems = this.cartService
      .getCartItems()()
      .map((item) => ({
        id: null, // New item, so ID is null (DB generates it)
        skuCode: item.name, // Using Name as SKU for readability
        price: item.price,
        quantity: item.quantity,
      }));

    // Create the OrderRequest object
    const orderRequest = {
      userId: user.id || user.email, // Ensure this matches your Auth User model
      orderLineItemsDtoList: orderLineItems,
    };

    // 4. Send to API
    this.orderService.placeOrder(orderRequest).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Order placed successfully! ☕');

        // Clear the cart
        this.cartService.clearCart();

        // Go to Order History
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        console.error('Checkout failed', err);
        this.isLoading = false;
        alert('Failed to place order. Is the Order Service running?');
      },
    });
  }

  continueShopping(): void {
    this.router.navigate(['/menu']);
  }
}
