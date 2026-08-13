import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicTableComponent } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { StatusUserService } from '../../../core/services/status-user.service';

@Component({
  selector: 'status-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './status-user.component.html',
  styleUrl: './status-user.component.css',
})
export class StatusUserComponent extends BaseComponent implements OnInit {

   private statusUserService = inject(StatusUserService);

  async ngOnInit() {
    await this.cargarPermisos();
  }

  
  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data: any = await this.statusUserService.getGenero();
        
      },
    });
  }
  
}
