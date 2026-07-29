import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { BaseComponent } from '../base.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  id: string;
  label: string;
  url?: string;
  parametros?: any;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent extends BaseComponent implements OnInit {
  activeItemId: string = '';
  isMobileMenuOpen: boolean = false;

  menuItems: MenuItem[] = [
    {
      id: 'seguridad',
      label: 'Seguridad',
      expanded: true,
      children: [
        {
          id: 'param-generales',
          label: 'Parametros Generales',
          expanded: true,
          children: [
            {
              id: 'empresas',
              label: 'Empresas',
              url: 'empresa',
              parametros: { view: 'list' },
            },
            { id: 'sucursales', label: 'Sucursales', url: 'sucursal' },
            { id: 'generos', label: 'Generos', url: 'genero' },
          ],
        },
      ],
    },
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
    const data = this.getNavParams();
    console.log('DATA IMPLEMENTE', data);
  }

  
  clickLogSe() {
    this.authService.logout();
    this.navigateTo('/login');
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateHome(item: MenuItem, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.activeItemId = item.id;
    this.isMobileMenuOpen = false;

    if (item.url) {
      this.navigateTo(`/home/${item.url}`, item.parametros || {});
    }
  }
}
