import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Output() onFormCollapsed = new EventEmitter<boolean>();

  toggleForm() {
    this.isFormCollapsed = !this.isFormCollapsed;

    this.onFormCollapsed.emit(this.isFormCollapsed);
  }
}
