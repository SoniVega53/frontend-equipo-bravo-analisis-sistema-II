
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { DocumentoPersona } from '../../interface/documento-persona.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentoPersonaService extends BaseService {
  private readonly endpoint = 'console/documentos-personas';

  async getDocumentosPersonas(): Promise<DocumentoPersona[]> {
    const response: any = await this.get<any>(this.endpoint);
    return response?.data || [];
  }

  async crear(documento: DocumentoPersona): Promise<any> {
    const response: any = await this.post<any>(
      this.endpoint,
      documento
    );

    return response?.data || response;
  }

  async actualizar(documento: DocumentoPersona): Promise<any> {
    const response: any = await this.put<any>(
      `${this.endpoint}/${documento.idTipoDocumento}/${documento.idPersona}`,
      documento
    );

    return response?.data || response;
  }

  async eliminar(
    idTipoDocumento: number,
    idPersona: number
  ): Promise<any> {
    return this.delete<any>(
      `${this.endpoint}/${idTipoDocumento}/${idPersona}`
    );
  }
}
