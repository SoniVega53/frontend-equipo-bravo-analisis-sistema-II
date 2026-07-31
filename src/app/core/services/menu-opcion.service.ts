import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { RoleOpciones } from '../../interface/rolo-opciones.interface';
import { MenuItem } from '../../ui/home/home.component';

@Injectable({
  providedIn: 'root',
})
export class MenuOpcionService extends BaseService {
  private readonly endpoint = 'menu';
  private allowedUrls: string[] = [];
  private menuCargado: boolean = false;
  private menu: MenuItem[] = [];

  async getMenuList(): Promise<MenuItem[]> {
    if (this.menuCargado && this.menu) {
      return this.menu;
    }
    const respones: any = await this.get<any>(`${this.endpoint}`);
    return respones?.data || [];
  }

  async getMenu(): Promise<MenuItem[]> {
    const response: any = await this.get<any>(`${this.endpoint}`);
    const menuItems = response?.data || [];
    //const menuItems:any = [];

    console.log(menuItems)

    this.allowedUrls = this.extraerUrls(menuItems);
    this.menuCargado = true;

    return menuItems;
  }

  async verificarAcceso(targetUrl: string): Promise<boolean> {
    if (!this.menuCargado) {
      this.menu = await this.getMenu();

      console.log( "DATA:",this.menu);
    }
    return this.allowedUrls.includes(targetUrl);
  }

  private extraerUrls(items: MenuItem[]): string[] {
    let urls: string[] = [];

    for (const item of items) {
      if (item.url) {
        const rutaLimpia = item.url.startsWith('/') ? item.url : `/${item.url}`;
        urls.push(`/home${rutaLimpia}`);
      }

      if (item.children && Array.isArray(item.children)) {
        urls = [...urls, ...this.extraerUrls(item.children)];
      }
    }

    console.log(urls)
    return urls;
  }
}
