import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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
  @Output() menuToggle = new EventEmitter<void>();

  nombreUsuario: string = '';

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const info = this.getDataToken();
      if (info) {
        this.nombreUsuario = info.user;
      }
    }
  }

  toggleMobileMenu(): void {
    this.menuToggle.emit();
  }

  onLogout() {
    this.authService.logout();
    this.navigateTo('/login');
  }
}
