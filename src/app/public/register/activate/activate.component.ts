import { AlertService } from '../../../alert/alert-service/alert.service';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../services/user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { slideToRight } from '../../../../router.animations';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
  animations: [slideToRight()]
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
    document.body.style.backgroundImage = 'linear-gradient(45deg, #ED008C, #F67E27)';
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
