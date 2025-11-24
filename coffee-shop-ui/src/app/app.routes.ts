import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { Login } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { Orders } from './pages/order/order';
import { AdminAddProduct } from './pages/admin-add-product/admin-add-product';
import { AdminProductManagementComponent } from './pages/admin-product-management/admin-product-management';
import { AdminEditProduct } from './pages/admin-edit-product/admin-edit-product';
import { CartComponent } from './pages/cart/cart';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: Menu },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'my-orders', component: Orders },
  { path: 'admin-add-product', component: AdminAddProduct },
  { path: 'admin', component: AdminProductManagementComponent },
  { path: 'admin-edit-product/:id', component: AdminEditProduct },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' },
];
