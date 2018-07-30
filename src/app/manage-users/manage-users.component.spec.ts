import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserResponse } from './../domains/user-response';
import { MatPaginatorModule, MatListModule, PageEvent, MatIconModule, MatInputModule } from '@angular/material';
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
  let searchSpy: any;

  const errorResponse = new Response(new ResponseOptions({ status: 500, body: null }));

  let mockUsers: User[];

  let mockUserResponse: UserResponse;

  const mockAuthService = {
    logout() { },
    getHeaders() { },
    login(username: string, password: string) { },
    isLoggedIn() { },
    getToken() { }
  };

  const mockPageEvent: PageEvent = {
    pageIndex: 1,
    pageSize: 5,
    length: 15,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageUsersComponent],
      imports: [
        HttpModule,
        MatListModule,
        MatPaginatorModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule
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

    mockUserResponse = {
      users: mockUsers,
      paginationTotalElements: mockUsers.length
    };

    spyOn(userService, 'getUsers').and.returnValue(Observable.of(mockUsers));
    searchSpy = spyOn(userService, 'searchUsers').and.returnValue(Observable.of(mockUserResponse));


    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should select the selectedUser', () => {
    component.selectUser(mockUsers[0]);
    expect(component.selectedUser).toBe(mockUsers[0]);
  });

  it('should set the users and totalElements when setUsers is called', async(() => {
    component.setUsers(mockUserResponse);

    expect(component.users.length).toBe(mockUsers.length);
    expect(component.totalUsers).toBe(mockUserResponse.paginationTotalElements);
  }));

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
    expect(userService.deleteUser).toHaveBeenCalled();
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

  it('should display a toast when unlockUser is success', async(() => {
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));
    spyOn(userService, 'unlockUser').and.returnValue(Observable.of(mockUsers[0]));
    spyOn(alertService, 'info');
    component.selectedUser = mockUsers[0];
    const usersLength = mockUsers.length;

    component.unlockUser();

    expect(alertService.info).toHaveBeenCalled();
    expect(userService.unlockUser).toHaveBeenCalled();
  }));

  it('should display an error toast when unlockUser throws error', async(() => {
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(true));
    spyOn(userService, 'unlockUser').and.returnValue(Observable.throw(errorResponse));
    spyOn(alertService, 'error');
    component.selectedUser = mockUsers[0];

    component.unlockUser();

    expect(alertService.error).toHaveBeenCalled();
  }));

  it('should do nothing when confirmation is false', async(() => {
    spyOn(alertService, 'confirmation').and.returnValue(Observable.of(false));
    spyOn(userService, 'unlockUser').and.returnValue(Observable.of(mockUsers[0]));
    component.selectedUser = mockUsers[0];

    component.unlockUser();

    expect(userService.unlockUser).toHaveBeenCalledTimes(0);
  }));

  it('should call userService. when getUsers is called', async(() => {
    component.getUsers();
    expect(userService.searchUsers).toHaveBeenCalled();
  }));

  it('should call getUsers() when pageEvent is set', async(() => {
    spyOn(component, 'getUsers');
    component.pageEvent = null;
    expect(component.getUsers).toHaveBeenCalled();
  }));

  it('should return _pageEvent when get pageEvent is called', async(() => {
    expect(component.pageEvent).toBe(component._pageEvent);
  }));

  it('should call searchUser()', async(() => {
    component.searchUser('');
    expect(userService.searchUsers).toHaveBeenCalledWith(0, component.pageSize, 'lastName', '');
  }));

  it('should handle errors if searchUser() has errors', async(() => {
    searchSpy.and.returnValue(Observable.throw(errorResponse));
    spyOn(alertService, 'error');

    component.searchUser('');

    expect(alertService.error).toHaveBeenCalled();
  }));

  it('should handle errors if getUsers() has errors', async(() => {
    searchSpy.and.returnValue(Observable.throw(errorResponse));
    spyOn(alertService, 'error');

    component.getUsers();

    expect(alertService.error).toHaveBeenCalled();
  }));

  it('a new page event should navigate to a new page of results', async(() => {
    component.searchUser('');
    component.pageEvent = mockPageEvent;
    expect(userService.searchUsers).toHaveBeenCalled();
    expect(component.pageEvent.pageIndex).toEqual(1);
  }));
});
