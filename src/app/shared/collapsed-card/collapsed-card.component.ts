import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'collapsed-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsed-card.component.html',
  styleUrl: './collapsed-card.component.css',
})
export class CollapsedCardComponent {
  @Input() isFormCollapsed = false;
  @Input() hidden = false;

  toggleForm() {
    this.isFormCollapsed = !this.isFormCollapsed;
  }
}
