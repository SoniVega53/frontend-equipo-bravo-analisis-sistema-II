import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { RoleOpcionTabla } from '../../interface/rolo-opciones.interface';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-role-opcion-table',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './role-opcion-table.component.html',
  styleUrls: ['./role-opcion-table.component.css'],
})
export class RoleOpcionTableComponent {
  @Input() data: RoleOpcionTabla[] = [];
  @Input() isLoading: boolean = false;
  @Input() showExport: boolean = true;
  @Input() showPrint: boolean = true;
  @Input() reportName: string = 'Reporte_Permisos';

  @Output() dataChange = new EventEmitter<RoleOpcionTabla[]>();
  @Output() onClickActions = new EventEmitter<void>();

  dataUpdate: RoleOpcionTabla[] = [];

  @ViewChild('printZone') printZone!: ElementRef;

  onToggle(row: RoleOpcionTabla, field: keyof RoleOpcionTabla, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    (row[field] as any) = isChecked ? 1 : 0;

    const findUpdate = this.dataUpdate.some(
      (res) => res.idRole == row.idRole && res.idOpcion == row.idOpcion,
    );
    if (!findUpdate) {
      this.dataUpdate.push(row);
    }
    this.dataChange.emit(this.dataUpdate);
  }

  clearDataUpdate() {
    this.dataUpdate = [];
  }

  exportarExcel() {
    if (this.dataUpdate.length > 0) {
      this.onClickActions.emit();
      return;
    }
    if (!this.data || this.data.length === 0) return;

    const exportData = this.data.map((row) => ({
      Opción: row.nombreOpcion,
      Consultar: row.consultar === 1 ? 'Sí' : 'No',
      Alta: row.alta === 1 ? 'Sí' : 'No',
      Baja: row.baja === 1 ? 'Sí' : 'No',
      Cambio: row.cambio === 1 ? 'Sí' : 'No',
      Imprimir: row.imprimir === 1 ? 'Sí' : 'No',
      Exportar: row.exportar === 1 ? 'Sí' : 'No',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Permisos');

    XLSX.writeFile(workbook, `${this.reportName}.xlsx`);
  }

  imprimir() {
    if (this.dataUpdate.length > 0) {
      this.onClickActions.emit();
      return;
    }
    if (!this.data || this.data.length === 0) return;

    let filasTabla = '';
    this.data.forEach((row) => {
      filasTabla += `
        <tr>
          <td>${row.nombreOpcion}</td>
          <td><input type="checkbox" ${row.consultar === 1 ? 'checked="checked"' : ''}></td>
          <td><input type="checkbox" ${row.alta === 1 ? 'checked="checked"' : ''}></td>
          <td><input type="checkbox" ${row.baja === 1 ? 'checked="checked"' : ''}></td>
          <td><input type="checkbox" ${row.cambio === 1 ? 'checked="checked"' : ''}></td>
          <td><input type="checkbox" ${row.imprimir === 1 ? 'checked="checked"' : ''}></td>
          <td><input type="checkbox" ${row.exportar === 1 ? 'checked="checked"' : ''}></td>
        </tr>
      `;
    });

    const printWindow = window.open(
      '',
      '_blank',
      'top=0,left=0,height=100%,width=auto',
    );

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${this.reportName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
              h2 { text-align: center; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px; }
              th:first-child, td:first-child { text-align: left; }
              th { background-color: #f8f9fa; font-weight: bold; }
              input[type="checkbox"] { transform: scale(1.2); pointer-events: none; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <h2>${this.reportName}</h2>
            <table>
              <thead>
                <tr>
                  <th>Opción</th>
                  <th>Consultar</th>
                  <th>Alta</th>
                  <th>Baja</th>
                  <th>Cambio</th>
                  <th>Imprimir</th>
                  <th>Exportar</th>
                </tr>
              </thead>
              <tbody>
                ${filasTabla}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}
