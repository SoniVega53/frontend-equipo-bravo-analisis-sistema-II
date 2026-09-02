import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { BaseComponent } from '../../ui/base.component';
import { AvatarIconoComponent } from "../avatar-icono/avatar-icono.component";
import { UsuarioService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarIconoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent extends BaseComponent implements OnInit {
  usuarioService = inject(UsuarioService);
  

  @Output() menuToggle = new EventEmitter<void>();
  @Input() isMobile: boolean = true;

  nombreUsuario: string = '';
  fotografia: string = '';

  ngOnInit() {
    this.cargarPerfil();

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

  navigateHome(url: string) {
    if (!url) return;
    this.navigateTo(`/home/${url}`);
  }

  async cargarPerfil() {
    await this.executeService({
      callback: async () => {
        const respones = await this.usuarioService.getFotografia();
        if (respones) {
          this.fotografia = respones;
        }
      },
    });
  }
}
