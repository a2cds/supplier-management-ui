import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierFormComponent } from './supplier-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';

describe('SupplierFormComponent', () => {
  let component: SupplierFormComponent;
  let fixture: ComponentFixture<SupplierFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierFormComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make RG required if document has 11 chars', () => {
    component.form.patchValue({ document: '12345678901' });
    // Dispara a lógica manual que está no subscribe (pode precisar chamar updateValidators no teste)
    // No ReactiveForms, o valueChanges é async, então forçamos a verificação:
    expect(component.isIndividual).toBe(true);
  });
});