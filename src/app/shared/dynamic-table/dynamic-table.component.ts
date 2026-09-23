import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";
import * as XLSX from 'xlsx';
import { GenericPdfRequest, PdfExportService } from '../../core/services/pdf-export.service';
import Swal from 'sweetalert2';

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
  private pdfExportService = inject(PdfExportService);

  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() isLoading: boolean = false;

  @Input() showExport: boolean = true;
  @Input() showPrint: boolean = true;
  @Input() hiddenAccion: boolean = false;
  @Input() scrollTop: boolean = true;
  @Input() reportName: string = 'Reporte';
  @Input() pageSize: number = 8;

  @Output() actionSelect = new EventEmitter<any>();

  @ViewChild('printZone') printZone!: ElementRef;

  @Input() currentPage: number = 1;

  @Output() currentPageChange = new EventEmitter<number>();

  isExporting: boolean = false;
  isPrinting: boolean = false;

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(startIndex, startIndex + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.currentPageChange.emit(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.currentPageChange.emit(this.currentPage);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.currentPageChange.emit(this.currentPage);
  }

  onSelect(item: any) {
    this.scrollToTop();
    this.actionSelect.emit(item);
  }

  scrollToTop() {
   if (!this.scrollTop) return;
   const mainContainer = document.querySelector('.main-content');
    
    if (mainContainer) {
      mainContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private buildPdfRequest(): GenericPdfRequest {
    const exportData = this.data.map(row => {
      const rowData: any = {};
      this.columns.forEach(col => {
        if (col.type === 'audit') {
          const user = row[col.userField!] || 'N/A';
          const date = row[col.dateField!] ? new Date(row[col.dateField!]).toLocaleDateString() : '-';
          rowData[col.field] = `${user} (${date})`;
        } else {
          rowData[col.field] = String(row[col.field] || '');
        }
      });
      return rowData;
    });

    return {
      titulo: this.reportName,
      columnas: this.columns.map(c => ({ header: c.header, field: c.field })),
      datos: exportData
    };
  }

  async exportarPdf() {
    if (!this.data || this.data.length === 0) return;

    this.isExporting = true;
    const request = this.buildPdfRequest();

    try {
      const blob = await this.pdfExportService.generarPdfTabla(request);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.reportName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al generar el PDF de la tabla.',
      });
    } finally {
      this.isExporting = false;
    }
  }

  async imprimir() {
    if (!this.data || this.data.length === 0) return;

    this.isPrinting = true;
    const request = this.buildPdfRequest();

    try {
      const blob = await this.pdfExportService.generarPdfTabla(request);
      const url = window.URL.createObjectURL(blob);
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        iframe.contentWindow?.print();
      };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al preparar el documento para impresión.',
      });
    } finally {
      this.isPrinting = false;
    }
  }
}