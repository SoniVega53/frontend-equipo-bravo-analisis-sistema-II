import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneroService } from '../../core/services/genero.service';
import { Genero } from '../../interface/genero.interface';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';

@Component({
  selector: 'app-genero',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputComponent],
  templateUrl: './genero.component.html',
  styleUrl: './genero.component.css',
})
export class GeneroComponent extends BaseComponent implements OnInit {
  private generoService = inject(GeneroService);

  generos: Genero[] = [];
  generoActual: Genero = { nombre: '' };

  async ngOnInit() {
    await this.cargarLista();
  }

  async cargarLista() {
    this.isLoading = true;
    try {
      const data: any = await this.generoService.getGenero();
      this.generos = Array.isArray(data) ? data : [];
    } catch (error: any) {
      this.showErrorAlert(error.mensaje || 'Error al iniciar servicio');
    } finally {
      this.isLoading = false;
    }
  }

  async guardar() {
    if (!this.generoActual.nombre) return;

    this.isLoading = true;
    try {
      await this.generoService.crearToActualizar(this.generoActual);
      this.limpiarFormulario();
      await this.cargarLista();
    } catch (error: any) {
      this.showErrorAlert(error.mensaje || 'Error al iniciar servicio');
    } finally {
      this.isLoading = false;
    }
  }

  async eliminar(id?: number) {
    if (!id) return;

    this.showDeleteConfirm(async () => {
      this.isLoading = true;
      try {
        await this.generoService.eliminar(id);

        if (this.generoActual.idGenero === id) {
          this.limpiarFormulario();
        }

        this.showSuccessAlert('El género ha sido eliminado correctamente.');
        await this.cargarLista();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }, 'este género');
  }

  seleccionarParaEditar(genero: Genero) {
    this.generoActual = { ...genero };
  }

  limpiarFormulario() {
    this.generoActual = { nombre: '' };
  }
}
