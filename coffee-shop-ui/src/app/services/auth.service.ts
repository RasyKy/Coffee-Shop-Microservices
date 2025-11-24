import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Gateway URL
  private apiUrl = 'http://localhost:8080/api/user';

  // SIGNAL: Tracks if user is logged in (Reactive state)
  currentUser = signal<any | null>(this.getUserFromStorage());

  constructor() {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Assuming backend returns { token: '...', user: {...} }
        // Adjust 'response.user' based on your actual Java response structure
        const user = response.user || { email: credentials.email };

        localStorage.setItem('user_session', JSON.stringify(user));
        this.currentUser.set(user); // Update the signal
      })
    );
  }

  logout() {
    localStorage.removeItem('user_session');
    this.currentUser.set(null); // Clear signal
    this.router.navigate(['/login']);
  }

  private getUserFromStorage() {
    const user = localStorage.getItem('user_session');
    return user ? JSON.parse(user) : null;
  }
}
