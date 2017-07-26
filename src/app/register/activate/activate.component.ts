import { AlertService } from './../../services/alert/alert.service';
import { Observable } from 'rxjs/Observable';
import { UserService } from './../../services/user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, HostListener, HostBinding } from '@angular/core';
import { routerTransitionRight } from '../../../router.animations';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
  animations: [routerTransitionRight()]
})
export class ActivateComponent implements OnInit, OnDestroy {
  @HostBinding('@routerTransition') routerTransition;
  activationCode: string;
  routeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    document.body.style.backgroundImage = 'url(../../assets/magenta-orange.jpg)';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
    this.routeSubscription = this.route.params.subscribe(params => {
      this.activationCode = params['guid'] || '';
    });
  }

  ngOnDestroy() {
    document.body.style.backgroundImage = 'none';
    this.routeSubscription.unsubscribe();
  }

  activate() {
    this.userService.activateUser(this.activationCode).subscribe(
      res => {
        this.alertService.info('Account activated!');
        this.router.navigate(['/login']);
      }, error => {
        this.alertService.error('Unable to activate your account.');
      });
  }

}
