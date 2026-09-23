import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

export interface TableColumnPdf {
  header: string;
  field: string;
}

export interface GenericPdfRequest {
  titulo: string;
  columnas: TableColumnPdf[];
  datos: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PdfExportService extends BaseService {
  private readonly endpoint = 'console/reportes-genericos';

  async generarPdfTabla(request: GenericPdfRequest): Promise<Blob> {
    return this.toPromise<Blob>(
      this.http.post(`${this.apiUrl}/${this.endpoint}/generar-pdf`, request, {
        responseType: 'blob'
      })
    );
  }
}