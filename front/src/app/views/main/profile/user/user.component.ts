import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/interfaces/users';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'profile-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: UserInfo;
  editMode: boolean;
  userForm: FormGroup;

  constructor(private usersService: UsersService, private authService: AuthService, private router: Router) {
    this.editMode = false;
  }

  ngOnInit() {
    this.user = this.usersService.getActiveUser()
  }

  public logout = () => {
    this.authService.logout().subscribe((res) => {
      this.router.navigateByUrl('/login');
    })
  }

  public enableEdit() {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.userForm = new FormGroup({
        firstName: new FormControl(this.user?.first_name, [
          Validators.required,
        ]),
        lastName: new FormControl(this.user?.last_name, [
          Validators.required,
        ]),
        email: new FormControl(this.user?.email, [
          Validators.required,
        ]),
        phone: new FormControl(this.user?.phone, [
          Validators.required,
        ])
      });
    }
  }

  public save() {
    //Updates user
    this.user.first_name = this.userForm.value.firstName;
    this.user.last_name = this.userForm.value.lastName;
    this.user.email = this.userForm.value.email;
    this.user.phone = this.userForm.value.phone;

    this.usersService.editUser(this.user);
    this.editMode = !this.editMode;
  }
}
