import { AuthService } from './../services/auth/auth.service';
import { HttpModule, ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AlertService } from './../services/alert/alert.service';
import { UserService } from './../services/user/user.service';
import { User } from './../domains/user';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUsersComponent } from './manage-users.component';

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;
  let userService: UserService;
  let alertService: AlertService;

  const errorResponse = new Response(new ResponseOptions({ status: 500, body: null }));

  let mockUsers: User[];

  const mockAuthService = {
    logout() { },
    getHeaders() { },
    login(username: string, password: string) { },
    isLoggedIn() { },
    getToken() { }
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageUsersComponent],
      imports: [
        HttpModule
      ],
      providers: [
        UserService,
        AlertService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(UserService);
    alertService = fixture.debugElement.injector.get(AlertService);
    spyOn(userService, 'getUsers').and.returnValue(Observable.of(mockUsers));

    mockUsers = [{
      id: 'id1',
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'test@test.com',
      password: '123456',
    },
    {
      id: 'id2',
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'test@test.com',
      password: '123456',
    },
    {
      id: 'id3',
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'test@test.com',
      password: '123456',
    }];

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should select the selectedUser', () => {
    component.selectUser(mockUsers[0]);
    expect(component.selectedUser).toBe(mockUsers[0]);
  });

  it('should call userService.deleteUser() when deleteUser()', async(() => {
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));
    spyOn(userService, 'deleteUser').and.returnValue(Observable.of(true));
    component.selectedUser = mockUsers[0];
    const userId = mockUsers[0].id;

    component.deleteUser();

    expect(userService.deleteUser).toHaveBeenCalledWith(userId);
  }));

  it('should display a toast and reset the selected user when deleteUser is success', async(() => {
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));
    spyOn(userService, 'deleteUser').and.returnValue(Observable.of(true));
    spyOn(alertService, 'info');
    component.selectedUser = mockUsers[0];
    const usersLength = mockUsers.length;

    component.deleteUser();

    expect(alertService.info).toHaveBeenCalled();
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.selectedUser).toBeNull();
  }));

  it('should display an error toast when the userService returns error', async(() => {
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));
    spyOn(userService, 'deleteUser').and.returnValue(Observable.throw(errorResponse));
    spyOn(alertService, 'error');
    component.selectedUser = mockUsers[0];

    component.deleteUser();

    expect(alertService.error).toHaveBeenCalled();
  }));

  it('should do nothing when confirmation is false', async(() => {
    spyOn(userService, 'deleteUser').and.returnValue(Observable.of(true));
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(false));
    component.selectedUser = mockUsers[0];

    component.deleteUser();

    expect(userService.deleteUser).toHaveBeenCalledTimes(0);
  }));
});
