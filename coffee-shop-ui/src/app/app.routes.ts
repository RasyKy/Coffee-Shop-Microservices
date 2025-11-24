import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { Login } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { Orders } from './pages/order/order'; // User's My Orders
import { CartComponent } from './pages/cart/cart';

// Admin Components
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminProductManagementComponent } from './pages/admin-product-management/admin-product-management';
import { AdminAddProduct } from './pages/admin-add-product/admin-add-product';
import { AdminEditProduct } from './pages/admin-edit-product/admin-edit-product';

// Guard
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // --- PUBLIC ROUTES ---
  { path: '', component: HomeComponent },
  { path: 'menu', component: Menu },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },

  // --- USER ROUTES ---
  { path: 'cart', component: CartComponent },
  { path: 'my-orders', component: Orders },

  // --- ADMIN PROTECTED ROUTES ---
  // The Guard will block non-admins from entering ANY of these
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/products', // Changed from 'admin' to 'admin/products' to separate Dashboard from List
    component: AdminProductManagementComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/add-product',
    component: AdminAddProduct,
    canActivate: [adminGuard],
  },
  {
    path: 'admin/edit-product/:id',
    component: AdminEditProduct,
    canActivate: [adminGuard],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
