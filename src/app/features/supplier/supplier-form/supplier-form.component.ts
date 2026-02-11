import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatInputModule, MatButtonModule, MatSelectModule, 
    MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(SupplierService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isEditMode = false;
  supplierId?: number;

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      document: ['', [Validators.required, Validators.minLength(11)]], // Máscaras seriam ideais aqui
      email: ['', [Validators.required, Validators.email]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      rg: [''],
      birthDate: ['']
    });

    // Reage a mudanças no documento para exibir campos de PF
    this.form.get('document')?.valueChanges.subscribe(val => this.updateValidators(val));
  }

  // Lógica simples: Se tem 11 dígitos (numericos), é PF. Se mais, PJ.
  // Em produção, usar um RadioButton "Tipo Pessoa" é mais seguro.
  get isIndividual(): boolean {
    const doc = this.form.get('document')?.value || '';
    return doc.replace(/\D/g, '').length === 11;
  }

  private updateValidators(document: string) {
    const cleanDoc = document.replace(/\D/g, '');
    const rgControl = this.form.get('rg');
    const birthControl = this.form.get('birthDate');

    if (cleanDoc.length === 11) {
      rgControl?.setValidators([Validators.required]);
      birthControl?.setValidators([Validators.required]);
    } else {
      rgControl?.clearValidators();
      birthControl?.clearValidators();
    }
    rgControl?.updateValueAndValidity();
    birthControl?.updateValueAndValidity();
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.supplierId = +id;
      this.service.getById(this.supplierId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const supplier: Supplier = this.form.value;
    
    // Tratamento de data se necessário (para LocalDate do Java)
    
    const request = this.isEditMode 
      ? this.service.update(this.supplierId!, supplier)
      : this.service.create(supplier);

    request.subscribe({
      next: () => {
        this.snackBar.open('Salvo com sucesso!', 'Ok', { duration: 3000 });
        this.router.navigate(['/suppliers']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Erro ao salvar.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      }
    });
  }

  // Validação de CEP simplificada (gatilho de blur)
  validateZip() {
    const cep = this.form.get('zipCode')?.value;
    if (cep && cep.length >= 8) {
      // Aqui chamaria o serviço para validar se o CEP existe
      // Para este exemplo, confiamos na validação do Backend ao salvar
    }
  }
}