import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";
import * as XLSX from 'xlsx';

export interface TableColumn {
  header: string;
  field: string;
  type?: 'text' | 'audit'; 
  userField?: string;      
  dateField?: string;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() isLoading: boolean = false;

  @Input() showExport: boolean = true;
  @Input() showPrint: boolean = true;
  @Input() hiddenAccion: boolean = false;
  @Input() reportName: string = 'Reporte';

  @Output() actionSelect = new EventEmitter<any>();

  @ViewChild('printZone') printZone!: ElementRef;

  onSelect(item: any) {
    this.scrollToTop();
    this.actionSelect.emit(item);
  }

  scrollToTop() {
    const mainContainer = document.querySelector('.main-content');
    
    if (mainContainer) {
      mainContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  exportarExcel() {
    if (!this.data || this.data.length === 0) return;

    const exportData = this.data.map(row => {
      const rowData: any = {};
      
      this.columns.forEach(col => {
        if (col.type === 'audit') {
          const user = row[col.userField!] || 'N/A';
          const date = row[col.dateField!] ? new Date(row[col.dateField!]).toLocaleDateString() : '-';
          rowData[col.header] = `${user} (${date})`;
        } else {
          rowData[col.header] = row[col.field];
        }
      });
      
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    XLSX.writeFile(workbook, `${this.reportName}.xlsx`);
  }

  imprimir() {
    if (!this.printZone) return;

    const printContents = this.printZone.nativeElement.innerHTML;
    
    const printWindow = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${this.reportName}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                color: #333;
              }
              h2 { text-align: center; margin-bottom: 20px; }
              table { 
                width: 100%; 
                border-collapse: collapse; 
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 10px; 
                text-align: left; 
                font-size: 14px;
              }
              th { 
                background-color: #f8f9fa; 
                font-weight: bold; 
              }
              /* Ocultar la columna de acciones al imprimir */
              .no-print { 
                display: none !important; 
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <h2>${this.reportName}</h2>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}