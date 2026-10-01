import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../base.component';
import { CalculoPlanillaProcesarComponent } from './calculo-planilla-procesar/calculo-planilla-procesar.component';
import { CalculoPlanillaPeriodoComponent } from './calculo-planilla-periodo/calculo-planilla-periodo.component';

@Component({
  selector: 'app-calculo-planilla',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalculoPlanillaProcesarComponent,
    CalculoPlanillaPeriodoComponent
  ],
  templateUrl: './calculo-planilla.component.html',
  styleUrl: './calculo-planilla.component.css'
})
export class CalculoPlanillaComponent extends BaseComponent implements OnInit {
  activeTab: 'procesar' | 'periodo' = 'procesar';

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
    });
  }
}