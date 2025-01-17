import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { VisionComponent } from './components/about-us/vision/vision.component';
import { ValuesComponent } from './components/about-us/values/values.component';
import { DetailsComponent } from './components/details/details.component';
import { LoginComponent } from './components/account/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AddProductComponent } from './components/add-product/add-product.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { OrderComponent } from './components/order/order.component';
import { RegisterComponent } from './components/account/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'order', component: OrderComponent },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/products.component').then(
        (obj) => obj.ProductsComponent
      ),
    canActivate: [authGuard],
  },
  { path: 'details/:id/:name', component: DetailsComponent },
  {
    path: 'about',
    component: AboutUsComponent,
    children: [
      { path: '', redirectTo: 'vision', pathMatch: 'full' },
      { path: 'vision', component: VisionComponent },
      { path: 'values', component: ValuesComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'add-product',
    component: AddProductComponent,
    canActivate: [authGuard],
  },
  { path: 'update-product/:id/:name', component: UpdateProductComponent },
  { path: '**', component: NotFoundComponent },
];
