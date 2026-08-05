import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from '../../ui/home/home.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() isLoadingMenu: boolean = false;
  @Input() isMobileMenuOpen: boolean = false;
  @Input() activeItemId: string | number | null = null;

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<MenuItem>();

  onToggleMobileMenu(): void {
    this.toggleMenu.emit();
  }

  onNavigate(item: MenuItem,event?:Event): void {
      if (event) {
      event.stopPropagation();
    }

    this.navigate.emit(item);
  }
}
