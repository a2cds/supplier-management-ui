import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatTableModule, MatButtonModule, 
    MatIconModule, MatInputModule, MatFormFieldModule
  ],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent implements OnInit {
  private service = inject(SupplierService);
  private snackBar = inject(MatSnackBar);

  suppliers = signal<Supplier[]>([]);
  displayedColumns = ['name', 'document', 'email', 'actions'];

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers(filter = '') {
    this.service.getAll(filter).subscribe({
      next: (data) => this.suppliers.set(data),
      error: () => this.showError('Erro ao carregar fornecedores.')
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.loadSuppliers(value);
  }

  delete(id: number) {
    if(confirm('Deseja realmente excluir este fornecedor?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.loadSuppliers();
          this.showError('Fornecedor removido!', 'Ok'); // Reusing snackbar logic
        },
        error: () => this.showError('Erro ao excluir.')
      });
    }
  }

  private showError(msg: string, action = 'Fechar') {
    this.snackBar.open(msg, action, { duration: 3000 });
  }
}