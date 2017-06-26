import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CoDE: Collaborative Development Environment';

  constructor(private authService: AuthService, private router: Router) { }

  navigateTo(route: String) {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}
