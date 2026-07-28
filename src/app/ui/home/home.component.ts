import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent extends BaseComponent implements OnInit{

  
  constructor(
    private authService: AuthService,
  ) {
    super()
  }

  ngOnInit(): void {
    const data = this.getNavParams();
    console.log("DATA IMPLEMENTE", data);
  }

  clickLogSe (){
    this.authService.logout();
    this.router.navigate(['/login']);
  };
}
