import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SucursalService } from '../../../core/services/sucursal.service';
import { EmpresaService } from '../../../core/services/empresa.service';
import { Empresa } from '../../../interface/empresa.interface';
import { Sucursal } from '../../../interface/sucursal.interface';


@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sucursal.component.html', 
  styleUrls: ['./sucursal.component.css']
})
export class SucursalComponent implements OnInit {
  sucursales: Sucursal[] = [];
  empresas: Empresa[] = [];

  sucursalActual: Sucursal = {
    nombre: '',
    direccion: '',
    idEmpresa: undefined,
    empresa: { idEmpresa: undefined, nombre: '', direccion: '', nit: '' } as unknown as Empresa
  };

  modoEdicion: boolean = false;

  constructor(
    private sucursalService: SucursalService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    this.cargarSucursales();
    this.cargarEmpresas();
  }

  cargarSucursales(): void {
    this.sucursalService.listarTodas().subscribe({
      next: (data: Sucursal[]) => (this.sucursales = data),
      error: (err: unknown) => console.error('Error al cargar sucursales:', err)
    });
  }

  cargarEmpresas(): void {
    this.empresaService.listarTodas().subscribe({
      next: (data: Empresa[]) => (this.empresas = data),
      error: (err: unknown) => console.error('Error al cargar empresas:', err)
    });
  }

  guardar(): void {
    // Mapear el ID de la empresa seleccionada y campos auditables
    const idEmpresaSeleccionada = this.sucursalActual.empresa?.idEmpresa || this.sucursalActual.idEmpresa;

    const payload: Sucursal = {
      ...this.sucursalActual,
      idEmpresa: idEmpresaSeleccionada,
      usuarioCreacion: this.sucursalActual.usuarioCreacion || 'system',
      fechaCreacion: this.sucursalActual.fechaCreacion || new Date().toISOString()
    };

    if (this.modoEdicion && this.sucursalActual.idSucursal) {
      this.sucursalService.actualizar(this.sucursalActual.idSucursal, payload).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarSucursales();
        },
        error: (err: unknown) => console.error('Error al actualizar sucursal:', err)
      });
    } else {
      this.sucursalService.crear(payload).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarSucursales();
        },
        error: (err: unknown) => console.error('Error al crear sucursal:', err)
      });
    }
  }

  editar(sucursal: Sucursal): void {
    this.modoEdicion = true;
    this.sucursalActual = { ...sucursal };
  }

  eliminar(id?: number): void {
    if (id && confirm('¿Desea eliminar esta sucursal?')) {
      this.sucursalService.eliminar(id).subscribe({
        next: () => this.cargarSucursales(),
        error: (err: unknown) => console.error('Error al eliminar sucursal:', err)
      });
    }
  }

  limpiarFormulario(): void {
    this.modoEdicion = false;
    this.sucursalActual = {
      nombre: '',
      direccion: '',
      idEmpresa: undefined,
      empresa: { idEmpresa: undefined, nombre: '', direccion: '', nit: '' } as unknown as Empresa
    };
  }

  compararEmpresas(e1: Empresa, e2: Empresa): boolean {
    return e1 && e2 ? e1.idEmpresa === e2.idEmpresa : e1 === e2;
  }
}