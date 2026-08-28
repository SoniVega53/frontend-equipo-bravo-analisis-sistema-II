import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { MenuOpcionService } from '../../core/services/menu-opcion.service';
import { filter, Subscription } from 'rxjs';
import { HomeComponent, MenuItem } from '../home/home.component';
import { BaseComponent } from '../base.component';
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";

@Component({
  selector: 'console',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, LoaderComponent, SidebarComponent],
  templateUrl: './console.component.html',
  styleUrl: './console.component.css',
})
export class ConsoleComponent extends BaseComponent implements OnInit, OnDestroy  {
  menuService = inject(MenuOpcionService);
  homeComponent = inject(HomeComponent);

  activeItemId: string = "";
  isLoadingMenu: boolean = true;

  private routerSubscription!: Subscription;

  menuItems: MenuItem[] = [];

  constructor() {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.cargarListaMenu();
    const data = this.getNavParams();
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private syncMenuWithUrl(url: string) {
    const path = url.split('?')[0];

    if (path === this.urlBase2) {
      this.activeItemId = "";
      return;
    }

    const findAndExpand = (items: MenuItem[], parents: MenuItem[]): boolean => {
      for (const item of items) {
        if (item.url) {
          const matchExacto = path.endsWith(`${this.urlBase}${item.url}`);
          const matchConCode = path.endsWith(`${this.urlBase}${item.url}/${item.code}`);

          if (matchExacto || matchConCode) {
            this.activeItemId = item.id;
            parents.forEach((p) => (p.expanded = true));
            return true;
          }
        }

        if (item.children && item.children.length > 0) {
          if (findAndExpand(item.children, [...parents, item])) {
            return true;
          }
        }
      }
      return false;
    };

    const rutaPermitida = findAndExpand(this.menuItems, []);

    if (!rutaPermitida) {
      this.router.navigate([this.urlBase2 || '/home/console']); 
    }
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

  navigateHome(item: MenuItem) {
    this.activeItemId = item.id;
    this.homeComponent.isMobileMenuOpen = false;

    if (item.url) {
      this.clearNavParams();
      this.navigateToConsole(`${this.urlBase}${item.url}`, item.code);
    }
  }

}
