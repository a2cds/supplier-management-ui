import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../../models/company.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/companies`;

  getAll(filter = ''): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl, { params: { filter } });
  }

  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  create(supplier: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, supplier);
  }

  update(id: number, supplier: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, supplier);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}