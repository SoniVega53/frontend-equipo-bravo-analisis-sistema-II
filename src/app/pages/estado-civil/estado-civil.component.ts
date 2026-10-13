import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoCivil } from '../../interface/estado-civil.interface';
import { EstadoCivilService } from '../../core/services/estado-civil.service';

@Component({
  selector: 'app-estado-civil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estado-civil.component.html',
  styleUrls: ['./estado-civil.component.css']
})
export class EstadoCivilComponent implements OnInit {
  listaEstados: EstadoCivil[] = [];
  estadoActual: EstadoCivil = { nombre: '', estado: true };
  modoEdicion: boolean = false;

  constructor(private estadoCivilService: EstadoCivilService) {}

  ngOnInit(): void {
    this.cargarEstados();
  }

  cargarEstados(): void {
    this.estadoCivilService.obtenerTodos().subscribe({
      next: (data: EstadoCivil[]) => (this.listaEstados = data),
      error: (err: any) => console.error('Error al obtener estados civiles:', err)
    });
  }

  guardar(): void {
    if (!this.estadoActual.nombre.trim()) return;

    if (this.modoEdicion && this.estadoActual.idEstadoCivil !== undefined) {
      this.estadoCivilService.actualizar(this.estadoActual.idEstadoCivil, this.estadoActual).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarEstados();
        },
        error: (err: any) => console.error('Error al actualizar:', err)
      });
    } else {
      this.estadoCivilService.crear(this.estadoActual).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarEstados();
        },
        error: (err: any) => console.error('Error al guardar:', err)
      });
    }
  }

  editar(item: EstadoCivil): void {
    this.estadoActual = { ...item };
    this.modoEdicion = true;
  }

  eliminar(id?: number): void {
    if (id === undefined) return;
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.estadoCivilService.eliminar(id).subscribe({
        next: () => this.cargarEstados(),
        error: (err: any) => console.error('Error al eliminar:', err)
      });
    }
  }

  limpiarFormulario(): void {
    this.estadoActual = { nombre: '', estado: true };
    this.modoEdicion = false;
  }
}