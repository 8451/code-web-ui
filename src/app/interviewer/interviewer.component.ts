import { User } from './../domains/user';
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
  ) { }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit() { }

}
