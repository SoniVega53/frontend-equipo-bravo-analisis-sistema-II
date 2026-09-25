import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface KpiCard {
  title: string;
  value: number | string;
  type?: 'text' | 'currency';
  currency?: string;
  icon: string;
  colorClass: 'success' | 'danger' | 'primary' | 'info' | 'warning' | 'secondary' | 'dark';
  isHighlight?: boolean;
}

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-cards.component.html',
  styleUrl: './kpi-cards.component.css'
})
export class KpiCardsComponent {
  @Input() title: string = 'Resultados';
  @Input() items: KpiCard[] = [];
}