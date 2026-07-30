import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";

export interface TableColumn {
  header: string;
  field: string;
  type?: 'text' | 'audit'; 
  userField?: string;     
  dateField?: string;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() isLoading: boolean = false;

  @Output() actionSelect = new EventEmitter<any>();

  onSelect(item: any) {
    this.actionSelect.emit(item);
  }
}