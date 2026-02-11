import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../models/company.model';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    MatInputModule, 
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss'
})
export class CompanyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(CompanyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isEditMode = false;
  companyId?: number;

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  private initForm() {
    this.form = this.fb.group({
      tradeName: ['', Validators.required],
      // CNPJ: 14 dígitos
      document: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]], 
      // CEP: Formato 12345-678 ou 12345678
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]]
    });
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.companyId = +id;
      this.service.getById(this.companyId).subscribe({
        next: (data) => this.form.patchValue(data),
        error: () => {
          this.snackBar.open('Erro ao carregar empresa.', 'Fechar');
          this.router.navigate(['/companies']);
        }
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const company: Company = this.form.value;
    const request$ = this.isEditMode 
      ? this.service.update(this.companyId!, company) 
      : this.service.create(company);

    request$.subscribe({
      next: () => {
        this.snackBar.open('Empresa salva com sucesso!', 'Ok', { duration: 3000 });
        this.router.navigate(['/companies']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Erro ao processar solicitação.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      }
    });
  }
}