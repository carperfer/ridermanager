import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecoverUser } from 'src/app/interfaces/users';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  recoverPassForm: FormGroup;
  recoverUser: RecoverUser;

  constructor(private fb: FormBuilder, private usersService: UsersService, private router: Router, private message: ShowMessageService) {
    this.recoverPassForm = this.fb.group({
      email: ['', [Validators.required]]
    });
    this.recoverUser = {
      email: ''
    }
  }

  ngOnInit(): void {
  }

  public recoverPassword() {
    this.recoverUser.email = this.recoverPassForm.value.email;
    this.usersService.recoverPassword(this.recoverUser);
    this.message.showMessage('success', 'orders.success', 'auth.recoverPasswordSuccess')
    this.goToLogin();
  }

  public goToLogin() {
    this.router.navigate(['/login'])
  }
}
