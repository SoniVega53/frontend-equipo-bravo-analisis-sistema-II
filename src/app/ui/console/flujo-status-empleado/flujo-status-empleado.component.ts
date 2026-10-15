import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlujoStatusEmpleado, StatusEmpleado } from '../../../interface/flujo-status-empleado.interface';
import { FlujoStatusEmpleadoService } from '../../../core/services/flujo-status-empleado.service';
 
@Component({
  selector: 'app-flujo-status-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flujo-status-empleado.component.html',
  styleUrl: './flujo-status-empleado.component.css'
})
export class FlujoStatusEmpleadoComponent implements OnInit {
  private service = inject(FlujoStatusEmpleadoService);
 
  statuses: StatusEmpleado[] = [];
  flujos: FlujoStatusEmpleado[] = [];
  actual: number | null = null;
  nuevo: number | null = null;
  nombreEvento = '';
  editando = false;
  cargando = false;
  mensaje = '';
  tipoMensaje = '';
 
  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }
 
  async cargarDatos(): Promise<void> {
    this.cargando = true;
    try {
      const resultados = await Promise.all([
        this.service.listarStatus(),
        this.service.listarFlujos()
      ]);
      this.statuses = resultados[0].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
      this.flujos = resultados[1].sort(
        (a, b) =>
          this.nombreStatus(a.idStatusActual).localeCompare(this.nombreStatus(b.idStatusActual), 'es') ||
          this.nombreStatus(a.idStatusNuevo).localeCompare(this.nombreStatus(b.idStatusNuevo), 'es')
      );
    } catch (e: any) {
      this.mostrar(e?.error?.mensaje || e?.message || 'No se pudieron cargar los datos.', 'error');
    } finally {
      this.cargando = false;
    }
  }
 
  nombreStatus(id: number): string {
    return this.statuses.find(s => s.idStatusEmpleado === id)?.nombre ?? `Estado ${id}`;
  }
 
  async guardar(): Promise<void> {
    if (this.actual == null || this.nuevo == null) {
      this.mostrar('Selecciona el estado actual y el estado nuevo.', 'error');
      return;
    }
    if (this.actual === this.nuevo) {
      this.mostrar('El estado actual y el nuevo deben ser diferentes.', 'error');
      return;
    }
 
    const flujo: FlujoStatusEmpleado = {
      idStatusActual: this.actual,
      idStatusNuevo: this.nuevo,
      nombreEvento: this.nombreEvento.trim() || undefined
    };
 
    this.cargando = true;
    try {
      await this.service.guardar(flujo, this.editando);
      this.mostrar(this.editando ? 'Transición actualizada correctamente.' : 'Transición registrada correctamente.', 'exito');
      this.limpiar();
      await this.cargarDatos();
    } catch (e: any) {
      this.mostrar(e?.error?.mensaje || e?.message || 'No se pudo guardar la transición.', 'error');
    } finally {
      this.cargando = false;
    }
  }
 
  editar(flujo: FlujoStatusEmpleado): void {
    this.actual = flujo.idStatusActual;
    this.nuevo = flujo.idStatusNuevo;
    this.nombreEvento = flujo.nombreEvento ?? '';
    this.editando = true;
    this.mensaje = '';
  }
 
  async eliminar(flujo: FlujoStatusEmpleado): Promise<void> {
    if (!confirm(`¿Eliminar la transición ${this.nombreStatus(flujo.idStatusActual)} → ${this.nombreStatus(flujo.idStatusNuevo)}?`)) {
      return;
    }
    try {
      await this.service.eliminar(flujo.idStatusActual, flujo.idStatusNuevo);
      this.mostrar('Transición eliminada correctamente.', 'exito');
      if (this.editando) this.limpiar();
      await this.cargarDatos();
    } catch (e: any) {
      this.mostrar(e?.error?.mensaje || e?.message || 'No se pudo eliminar la transición.', 'error');
    }
  }
 
  async validar(): Promise<void> {
    if (this.actual == null || this.nuevo == null) {
      this.mostrar('Selecciona ambos estados para validar.', 'error');
      return;
    }
    try {
      const r = await this.service.validar(this.actual, this.nuevo);
      this.mostrar(r?.mensaje ?? (r?.permitida ? 'Transición permitida.' : 'Transición no permitida.'), r?.permitida ? 'exito' : 'error');
    } catch (e: any) {
      this.mostrar(e?.error?.mensaje || e?.message || 'No se pudo validar la transición.', 'error');
    }
  }
 
  limpiar(): void {
    this.actual = null;
    this.nuevo = null;
    this.nombreEvento = '';
    this.editando = false;
  }
 
  mostrar(texto: string, tipo: string): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
  }
}
 