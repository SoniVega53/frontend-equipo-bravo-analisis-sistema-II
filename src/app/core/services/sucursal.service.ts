import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursal } from '../../interface/sucursal.interface';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private apiUrl = 'http://localhost:8080/api/sucursales';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.apiUrl}/${id}`);
  }

  crear(sucursal: Sucursal): Observable<Sucursal> {
    const payload = this.prepararPayload(sucursal);
    return this.http.post<Sucursal>(this.apiUrl, payload);
  }

  actualizar(id: number, sucursal: Sucursal): Observable<Sucursal> {
    const payload = this.prepararPayload(sucursal);
    return this.http.put<Sucursal>(`${this.apiUrl}/${id}`, payload);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private prepararPayload(sucursal: Sucursal): Sucursal {
    return {
      ...sucursal,
      idEmpresa: sucursal.empresa?.idEmpresa || sucursal.idEmpresa,
      usuarioCreacion: sucursal.usuarioCreacion || 'system',
      fechaCreacion: sucursal.fechaCreacion || new Date().toISOString()
    };
  }
}