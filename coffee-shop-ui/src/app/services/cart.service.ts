import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';
import { signal } from '@angular/core';


export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartItems = signal<CartItem[]>([]);

  constructor() {
    // Load cart from localStorage on init
    this.loadCartFromStorage();
  }

  // Get all cart items
  getCartItems() {
    return this.cartItems.asReadonly();
  }

  // Get total item count
  getItemCount(): number {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  }

  // Get total price
  getTotalPrice(): number {
    return this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Add item to cart
  addToCart(product: { id: string; name: string; price: number; imageUrl: string }): void {
    const items = this.cartItems();
    const existingItem = items.find(item => item.productId === product.id);

    if (existingItem) {
      // Increase quantity
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // Add new item
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl
      };
      this.cartItems.set([...items, newItem]);
      this.saveCartToStorage();
    }
  }

  // Update quantity
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.cartItems();
    const updatedItems = items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  // Remove item from cart
  removeFromCart(productId: string): void {
    const items = this.cartItems();
    const updatedItems = items.filter(item => item.productId !== productId);
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  // Clear entire cart
  clearCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }

  // Save cart to localStorage
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.set(JSON.parse(savedCart));
    }
  }
}