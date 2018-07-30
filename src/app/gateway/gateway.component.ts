import { Component, OnInit, OnDestroy, HostBinding} from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { slideToTopEnter } from '../../router.animations';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.scss'],
  animations: [
    trigger('flip', [
      state('front', style({ transform: 'rotateY(0)'})),
      state('back', style({ transform: 'rotateY(180deg)'})),
      transition('front => back',
        animate('1000ms ease-in')),
      transition('back => front',
        animate('1000ms ease-in')),
    ]),
      slideToTopEnter()
  ]
})
export class GatewayComponent implements OnInit, OnDestroy {
  @HostBinding('@routerTransition') routerTransition;
  loginFacing: string;
  registerFacing: string;
  component: string;

  constructor() { }

  ngOnInit() {
    document.body.style.backgroundImage = 'linear-gradient(45deg, #ED008C, #F67E27)';
    this.loginFacing = 'front';
    this.registerFacing = 'back';
    this.component = 'login';
  }

  ngOnDestroy() {
    document.body.style.backgroundImage = 'none';
  }

  toggleComponent() {
    this.loginFacing = (this.loginFacing === 'front') ? 'back' : 'front';
    this.registerFacing = (this.registerFacing === 'front') ? 'back' : 'front';
    this.component = (this.component === 'login') ? 'register' : 'login';
  }

}
