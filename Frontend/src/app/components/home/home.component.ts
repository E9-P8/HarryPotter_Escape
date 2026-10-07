import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isFullGameEnded = false;
  
  ngOnInit(): void {
  }
  constructor(private router: Router) {}

  playDemo(): void {
    this.router.navigate(['/demo']);
  }

  playFullGame(): void {
    this.router.navigate(['/menu']);
  }

}
