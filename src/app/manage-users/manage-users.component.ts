import { UserResponse } from './../domains/user-response';
import { PageEvent } from '@angular/material';
import { AlertService } from './../services/alert/alert.service';
import { User } from './../domains/user';
import { UserService } from './../services/user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  users: User[];
  selectedUser: User;

  totalUsers = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  searchString = '';

  _pageEvent: PageEvent;

  set pageEvent(pageEvent: PageEvent) {
    this._pageEvent = pageEvent;
    this.getUsers();
  }

  get pageEvent(): PageEvent {
    return this._pageEvent;
  }

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    let index = 0;
    let pageSize = 10;
    if (this._pageEvent) {
      index = this.pageEvent.pageIndex;
      pageSize = this.pageEvent.pageSize;
    }

    this.userService.searchUsers(index, pageSize, 'lastName', this.searchString).subscribe(res => {
      this.setUsers(res);
    }, error => {
      this.alertService.error('Error getting users');
    });
  }

  searchUser(searchString: string) {
    this.searchString = searchString;
    this.userService.searchUsers(0, this.pageSize, 'lastName', searchString).subscribe(res => {
      this.setUsers(res);
    }, error => {
      this.alertService.error('Error getting users');
    });
  }

  setUsers(users: UserResponse) {
    this.totalUsers = users.paginationTotalElements;
    this.users = users.users;
  }

  selectUser(selectedUser: User) {
    this.selectedUser = selectedUser;
  }

  deleteUser() {
    this.alertService.confirmation('Are you sure you want to delete this user?').subscribe(confirmation => {
      if (confirmation) {
        this.userService.deleteUser(this.selectedUser.id).subscribe(res => {
          this.selectedUser = null;
          this.getUsers();
          this.alertService.info('User deleted');
        }, error => {
          this.alertService.error('Error deleting user');
        });
      }
    });
  }

  unlockUser() {
    this.alertService.confirmation('Are you sure you want to unlock this user?').subscribe(confirmation => {
      if (confirmation) {
        this.selectedUser.locked = false;
        this.userService.unlockUser(this.selectedUser).subscribe(res => {
          this.selectedUser = res;
          this.alertService.info('User unlocked');
        }, error => {
          this.alertService.error('Error unlocking user');
        });
      }
    });
  }

}
