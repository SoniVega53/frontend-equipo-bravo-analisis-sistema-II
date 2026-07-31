import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../base.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { RoleOpciones } from '../../interface/rolo-opciones.interface';
import { MenuOpcionService } from '../../core/services/menu-opcion.service';
import { LoaderComponent } from "../../shared/loader/loader.component";

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
  imports: [CommonModule, FormsModule, NavbarComponent, RouterOutlet, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
  menuService = inject(MenuOpcionService);

  activeItemId: number = -1;
  isMobileMenuOpen: boolean = false;
  isLoadingMenu: boolean = true;

  private routerSubscription!: Subscription;

  menuItems: MenuItem[] = [];

  constructor() {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.cargarListaMenu();

    const data = this.getNavParams();
    console.log('DATA IMPLEMENTE', data);
  }

  async cargarListaMenu() {
    this.isLoadingMenu = true;
    await this.executeService({
      callback: async () => {
        const responseMenu = await this.menuService.getMenuList();
        if (responseMenu) {
          this.menuItems = responseMenu;
        }

        this.syncMenuWithUrl(this.router.url);

        this.routerSubscription = this.router.events
          .pipe(filter((event) => event instanceof NavigationEnd))
          .subscribe((event: any) => {
            this.syncMenuWithUrl(event.urlAfterRedirects);
          });
      },
    });
    this.isLoadingMenu = false;
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private syncMenuWithUrl(url: string) {
    const path = url.split('?')[0];

    if (path === '/home') {
      this.activeItemId = -1;
      return;
    }

    const findAndExpand = (items: MenuItem[], parents: MenuItem[]): boolean => {
      for (const item of items) {
        if (item.url && path.endsWith(`/home/${item.url}`)) {
          this.activeItemId = item.id;

          parents.forEach((p) => (p.expanded = true));
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

  private collapseMenu(items: MenuItem[]): void {
    for (const item of items) {
      item.expanded = false;

      if (item.children?.length) {
        this.collapseMenu(item.children);
      }
    }
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
      this.clearNavParams();
      this.navigateTo(`/home/${item.url}`, item.parametros || {});
    }
  }
}
