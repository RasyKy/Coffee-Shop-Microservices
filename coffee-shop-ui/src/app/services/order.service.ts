import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  // Gateway URL routing to Order Service
  private apiUrl = 'http://localhost:8080/api/order';

  placeOrder(orderRequest: any): Observable<any> {
    // We don't need to manually set Authorization headers if you handle that in a global interceptor,
    // but for now, we just send the payload.
    return this.http.post(this.apiUrl, orderRequest);
  }
}
