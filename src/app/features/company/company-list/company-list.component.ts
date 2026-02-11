import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent implements OnInit {
  private service = inject(CompanyService);
  private snackBar = inject(MatSnackBar);

  // Uso de Signals para reatividade performática
  companies = signal<Company[]>([]);
  displayedColumns = ['tradeName', 'document', 'zipCode', 'actions'];

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.service.getAll().subscribe({
      next: (data) => this.companies.set(data),
      error: () => this.showFeedback('Erro ao carregar empresas.')
    });
  }

  delete(id: number) {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.showFeedback('Empresa excluída com sucesso!');
          this.loadCompanies();
        },
        error: (err) => this.showFeedback(`Erro: ${err.error?.message || 'Falha ao excluir'}`)
      });
    }
  }

  private showFeedback(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }
}