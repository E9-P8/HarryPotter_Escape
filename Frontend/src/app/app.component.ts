import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router) {}

  title = 'Harry Potter - Escape Room';

  ngOnInit(): void {
  const isPwa = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

  if (isPwa) {
    const savedRoute = localStorage.getItem('hp_pwa_route');
    if (savedRoute) {
      this.router.navigateByUrl(savedRoute);
    }
  }
}

}
