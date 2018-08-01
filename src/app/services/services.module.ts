import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import { AlertService } from './alert/alert.service';
import { AssessmentWebSocketService, stompConfig } from './assessment-web-socket/assessment-web-socket.service';
import { AssessmentService } from './assessment/assessment.service';
import { AuthService } from './auth/auth.service';
import { CanActivateAuthguard } from './auth/can-activate.authguard';
import { AuthenticatedHttpService } from './http/authenticated-http-service';
import { QuestionService } from './question/question.service';
import { UserService } from './user/user.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
  ],
  providers: [
    AlertService,
    AssessmentService,
    AssessmentWebSocketService,
    AuthService,
    CanActivateAuthguard,
    AuthenticatedHttpService,
    QuestionService,
    UserService,
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ]
})
export class ServicesModule { }
