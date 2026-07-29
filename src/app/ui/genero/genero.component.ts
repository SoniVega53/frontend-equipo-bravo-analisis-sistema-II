import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneroService } from '../../core/services/genero.service';

@Component({
  selector: 'app-genero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './genero.component.html',
  styleUrl: './genero.component.css',
})
export class GeneroComponent extends BaseComponent implements OnInit {
  generoService = inject(GeneroService);

  ngOnInit(): void {
    this.getListadoGeneros();
  }

  async getListadoGeneros() {
    try {
      const payload = { nombre: 'NANI', idGenero:5};
      const respuesta = await this.generoService.crearToActualizar(payload);

      // Si usas SweetAlert2 o un Toast para mostrar éxito:
      console.log('¡Guardado!', respuesta);

      // const respuesta = await this.generoService.getGenero(1);
      // console.log("TESTEO",respuesta);
    } catch (err: any) {
      this.showErrorAlert(err.mensaje);
    }
  }
}
