import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  // Check if user exists AND is Admin
  if (user && user.role === 'ADMIN') {
    return true; // Allow access
  }

  // If not, kick them out
  alert('Access Denied: Admins Only');
  router.navigate(['/login']);
  return false;
};
