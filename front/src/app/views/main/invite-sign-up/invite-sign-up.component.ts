import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterUserInvite, TokenData } from 'src/app/interfaces/users';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { ErrorService } from 'src/app/services/error/error.service';

@Component({
  selector: 'app-invite-sign-up',
  templateUrl: './invite-sign-up.component.html',
  styleUrls: ['./invite-sign-up.component.scss']
})
export class InviteSignUpComponent implements OnInit {

  tokenData: TokenData;
  userForm!: FormGroup;
  existingUserForm: FormGroup;

  token: string;
  userAlreadyRegistered: boolean = false;
  passwordRepeatError: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private usersService: UsersService, private fb: FormBuilder, private message: ShowMessageService, private errorMessage: ErrorService) {
    this.token = '';
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get("token") || '';

    this.usersService.comprove_token(this.token)
      .then((response) => {
        if (response.user) {
          this.userAlreadyRegistered = true;
          this.tokenData = response;
        }
      })
      .catch(() => this.router.navigate(['/login']));

    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
      phone: ['', [Validators.required]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      token: [this.token]
    });

    this.existingUserForm = this.fb.group({
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    })
  }

  public register() {
    //Checks if user is already register in order to show the full form or only a password confirmation
    if (this.userAlreadyRegistered) {
      let user = {
        first_name: this.tokenData.user.first_name,
        last_name: this.tokenData.user.last_name,
        email: this.tokenData.user.email,
        phone: this.tokenData.user.phone,
        password: this.existingUserForm.value.password,
        password_confirmation: this.existingUserForm.value.password_confirmation,
        token: this.token
      }
      user.password === user.password_confirmation ?
        this.sendUserandRegister(user) : this.showPasswordRepeatError();
    } else {
      this.userForm.value.password === this.userForm.value.password_confirmation ?
        this.sendUserandRegister(this.userForm.value) : this.showPasswordRepeatError();
    }
  }

  private sendUserandRegister(user: RegisterUserInvite) {
    //Registers user in a new company
    this.usersService.accept_invitation(user).then((response: object) => {
      if (response) {
        this.message.showMessage('success', 'orders.success', 'auth.user_created');
        this.router.navigate(['/login']);
      }
    }).catch((err) => {
      this.errorMessage.showError(err.error.code, err.error.error);
    })
  }

  private showPasswordRepeatError() {
    this.passwordRepeatError = true;
    this.message.showMessage('error', 'orders.error', 'auth.repeat_password_error')
  }
}