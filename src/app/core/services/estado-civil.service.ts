import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoCivil } from '../../interface/estado-civil.interface';
@Injectable({
  providedIn: 'root'
})
export class EstadoCivilService {
  private apiUrl = 'http://localhost:8080/api/estados-civiles';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<EstadoCivil[]> {
    return this.http.get<EstadoCivil[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<EstadoCivil> {
    return this.http.get<EstadoCivil>(`${this.apiUrl}/${id}`);
  }

  crear(estadoCivil: EstadoCivil): Observable<EstadoCivil> {
    return this.http.post<EstadoCivil>(this.apiUrl, estadoCivil);
  }

  actualizar(id: number, estadoCivil: EstadoCivil): Observable<EstadoCivil> {
    return this.http.put<EstadoCivil>(`${this.apiUrl}/${id}`, estadoCivil);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}