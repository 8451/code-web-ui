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

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(res => {
      this.users = res;
    });
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

}
