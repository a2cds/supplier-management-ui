import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'suppliers',
    loadComponent: () => import('./features/supplier/supplier-list/supplier-list.component').then(c => c.SupplierListComponent)
  },
//   {
//     path: 'suppliers/new',
//     loadComponent: () => import('./features/supplier/supplier-form/supplier-form.component').then(c => c.SupplierFormComponent)
//   },
//   {
//     path: 'suppliers/edit/:id',
//     loadComponent: () => import('./features/supplier/supplier-form/supplier-form.component').then(c => c.SupplierFormComponent)
//   },

//   {
//     path: 'companies',
//     loadComponent: () => import('./features/company/company-list/company-list.component').then(c => c.CompanyListComponent)
//   },
//   {
//     path: 'companies/new',
//     loadComponent: () => import('./features/company/company-form/company-form.component').then(c => c.CompanyFormComponent)
//   },
//   {
//     path: 'companies/edit/:id',
//     loadComponent: () => import('./features/company/company-form/company-form.component').then(c => c.CompanyFormComponent)
//   },

  { path: '', redirectTo: 'suppliers', pathMatch: 'full' }    
];
