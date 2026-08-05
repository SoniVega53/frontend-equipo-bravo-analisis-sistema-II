import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acceso-denegado.component.html',
  styleUrls: ['./acceso-denegado.component.css']
})
export class AccesoDenegadoComponent extends BaseComponent {
  private location = inject(Location);

  ngOnInit() {
    const esF5oUrlDirecta = history.state.navigationId === 1;
    if (esF5oUrlDirecta) {
      this.router.navigate(['/home']); 
    }
  }

  regresar() {
    this.navigateTo('/home')
  }
}