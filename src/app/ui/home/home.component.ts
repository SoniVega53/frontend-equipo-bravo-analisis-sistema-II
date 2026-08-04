import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { BaseComponent } from '../base.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Subscription } from 'rxjs';
import { RoleOpciones } from '../../interface/rolo-opciones.interface';
import { MenuOpcionService } from '../../core/services/menu-opcion.service';
import { PrimerIngresoModalComponent } from '../../shared/modals/primer-ingreso-modal/primer-ingreso-modal.component';
import { UsuarioService } from '../../core/services/usuarios.service';

export interface MenuItem {
  id: number;
  label: string;
  url?: string;
  parametros?: RoleOpciones;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    RouterOutlet,
    PrimerIngresoModalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent extends BaseComponent implements OnInit {
  menuService = inject(MenuOpcionService);
  usuarioService = inject(UsuarioService);

  activeItemId: number = -1;
  isMobileMenuOpen: boolean = false;
  isLoadingMenu: boolean = true;

  esPrimerIngreso = false;

  menuItems: MenuItem[] = [];

  constructor() {
    super();
  }

  async ngOnInit(): Promise<void> {
    const data = this.getNavParams();
    this.cargarChangePassword();
  }

  async cargarChangePassword() {
    this.isLoadingMenu = true;
    await this.executeService({
      callback: async () => {
        const respones = await this.usuarioService.getChangePassword();
        if (respones) {
          console.log(respones?.changePassword)
          this.esPrimerIngreso = respones?.changePassword;
        }
      },
    });
    this.isLoadingMenu = false;
  }

  clickLogSe() {
    this.authService.logout();
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  onConfiguracionExitosa() {
    this.clearNavParams();
    this.esPrimerIngreso = false;
  }
}
