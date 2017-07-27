import { Component, OnInit, OnDestroy, trigger, state, style, transition, animate, keyframes, HostBinding } from '@angular/core';
import { MdInputModule, MaterialModule, MdCardModule } from '@angular/material';
import { routerTransitionTopEnter } from '../../router.animations';

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
      routerTransitionTopEnter()
  ]
})
export class GatewayComponent implements OnInit, OnDestroy {
  @HostBinding('@routerTransition') routerTransition;
  loginFacing: string;
  registerFacing: string;
  component: string;

  constructor() { }

  ngOnInit() {
    document.body.style.backgroundImage = 'url(../../assets/magenta-orange.jpg)';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
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
