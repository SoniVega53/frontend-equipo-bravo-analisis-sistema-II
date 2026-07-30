import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../base.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

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
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
  activeItemId: string = '';
  isMobileMenuOpen: boolean = false;
  
  private routerSubscription!: Subscription;

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

    this.syncMenuWithUrl(this.router.url);

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.syncMenuWithUrl(event.urlAfterRedirects);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private syncMenuWithUrl(url: string) {
    const path = url.split('?')[0]; 

    const findAndExpand = (items: MenuItem[], parents: MenuItem[]): boolean => {
      for (const item of items) {
        
        if (item.url && path.endsWith(`/home/${item.url}`)) {
          this.activeItemId = item.id;
          
          parents.forEach(p => p.expanded = true);
          return true;
        }

        if (item.children && item.children.length > 0) {
          if (findAndExpand(item.children, [...parents, item])) {
            return true;
          }
        }
      }
      return false;
    };

    findAndExpand(this.menuItems, []);
  }

  clickLogSe() {
    this.authService.logout(); 
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