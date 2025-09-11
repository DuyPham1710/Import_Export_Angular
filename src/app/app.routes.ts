import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: 'products', loadComponent: () => import('./components/product-page/product-page.component').then(m => m.ProductPageComponent) }
];
