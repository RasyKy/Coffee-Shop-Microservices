import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { Login } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: Menu },
  { path: 'login', component: Login },       // Add Login
  { path: 'register', component: RegisterComponent }, // Add Register
  { path: '**', redirectTo: '' }
];