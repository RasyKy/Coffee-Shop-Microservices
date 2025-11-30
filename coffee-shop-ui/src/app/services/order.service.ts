import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/order';

  placeOrder(orderRequest: any): Observable<string> {
    return this.http.post<string>(this.apiUrl, orderRequest);
  }

  getOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/${userId}`);
  }

  getAllOrdersAdmin(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/admin/all`);
  }
}

// --- FLEXIBLE INTERFACE ---
export interface Order {
  id?: string;
  orderNumber: string;
  userId: string;
  createdDate: string;
  // We make both optional so TypeScript doesn't complain
  orderLineItems?: OrderLineItem[]; // Correct DTO name
  orderLineItemsList?: OrderLineItem[]; // Old Entity name (fallback)
}

export interface OrderLineItem {
  id?: string;
  skuCode: string;
  price: number;
  quantity: number;
}
