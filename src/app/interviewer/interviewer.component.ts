import { User } from './../domains/user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interviewer',
  templateUrl: './interviewer.component.html',
  styleUrls: ['./interviewer.component.scss']
})
export class InterviewerComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  logout(): void {
    this.authService.logout();
  }

  editAccount(): void {
    this.router.navigate(['/interview/account']);
  }

  ngOnInit() { }

}
