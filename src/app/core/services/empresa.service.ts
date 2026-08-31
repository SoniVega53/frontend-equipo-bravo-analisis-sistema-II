import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../../interface/empresa.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:8080/api/empresas';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    // Recupera el token guardado tras el login (ajusta 'token' si usas otra clave como 'jwt' o 'auth_token')
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarTodas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}