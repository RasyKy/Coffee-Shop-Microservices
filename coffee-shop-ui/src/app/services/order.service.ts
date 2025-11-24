import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/order';

  placeOrder(orderRequest: any): Observable<any> {
    // ... (Keep existing placeOrder logic) ...
    return this.http.post(this.apiUrl, orderRequest);
  }

  // --- NEW METHOD ---
  getOrders(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }
}
