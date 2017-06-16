import { User } from './../../domains/user';
import { FormsModule, ReactiveFormsModule, Validators, NgForm, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new User();
  confirmPassword: string;
  @ViewChild('userForm') userForm: NgForm;


  constructor() { }

  ngOnInit() {
  }

  onSubmitRegister() {
    console.log('register submitted');
    console.log(this.userForm);
  }
}
