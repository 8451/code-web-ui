import { UserService } from './../../services/user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit, OnDestroy {

  activationCode: string;
  routeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
     this.routeSubscription = this.route.params.subscribe(params => {
      this.activationCode = params['guid'] || '';
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  activate() {
    this.userService.activateUser(this.activationCode);
  }

}
