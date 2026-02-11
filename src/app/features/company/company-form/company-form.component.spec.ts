import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyFormComponent } from './company-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CompanyFormComponent', () => {
  let component: CompanyFormComponent;
  let fixture: ComponentFixture<CompanyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyFormComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should validate CNPJ length', () => {
    const docControl = component.form.get('document');
    
    docControl?.setValue('123');
    expect(docControl?.valid).toBe(false); // Curto demais

    docControl?.setValue('12345678901234');
    expect(docControl?.valid).toBe(true); // 14 dígitos (formato válido de input, backend valida a matemática)
  });
});