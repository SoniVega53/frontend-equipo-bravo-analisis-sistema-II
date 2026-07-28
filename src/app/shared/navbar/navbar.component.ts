import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { BaseComponent } from '../../ui/base.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent extends BaseComponent implements OnInit {
  nombreUsuario: string = '';

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const info = this.getDataToken();
      if (info) {
        this.nombreUsuario = info.user;
      }
    }
  }

  onLogout() {
    this.authService.logout();
    this.navigateTo('/login');
  }
}
