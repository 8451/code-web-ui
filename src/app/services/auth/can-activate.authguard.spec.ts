import { Http, HttpModule } from '@angular/http';
import { AuthService } from './auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivateAuthguard } from './can-activate.authguard';
import { TestBed, inject } from '@angular/core/testing';

describe('CanActivateAuthguard', () => {

  const mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
          HttpModule,
      ],
      providers: [
          CanActivateAuthguard,
          { provide: Router, useValue: mockRouter },
          AuthService
      ],
    });
  });

  it('should be created', inject([CanActivateAuthguard], (service: CanActivateAuthguard) => {
    expect(service).toBeTruthy();
  }));

  it('should return true if we are logged in', inject([AuthService, Router], (authService: AuthService, router: Router) => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const canActivate = new CanActivateAuthguard(router, authService);
    const isLoggedIn = canActivate.canActivate(null, null);
    expect(isLoggedIn).toBeTruthy();

  }));

  it('should navigate to login when not logged in', inject([AuthService, Router], (authService: AuthService, router: Router) => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    const canActivate = new CanActivateAuthguard(router, authService);
    canActivate.canActivate(null, null);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);

  }));
});
