import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChangePasswordRequest } from 'src/app/interfaces/change-password-request';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;
  changePassword$: Subscription;

  constructor(private fb: FormBuilder, private userService: UsersService, private message: ShowMessageService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      newPasswordConfirmed: ['', [Validators.required]]
    })
  }

  ngOnDestroy() {
    if (this.changePassword$) this.changePassword$.unsubscribe();
  }

  public changePassword(): void {
    if (this.form.value.newPassword === this.form.value.newPasswordConfirmed) {
      const passwords: ChangePasswordRequest = {
        current_password: this.form.value.oldPassword,
        password: this.form.value.newPassword,
        password_confirmation: this.form.value.newPasswordConfirmed
      }
      this.changePassword$ = this.userService.changePassword(passwords).subscribe((passwordChanged) => {
        this.message.showMessage('success', 'orders.success', 'auth.new_password_success');
        localStorage.setItem('login', JSON.stringify(passwordChanged));
        this.form.reset();
      },
        (error) => {
          if (error.error.error === 'validation_current_password') {
            this.message.showMessage('error', 'auth.pass_change_error', 'auth.pass_incorrect');
          }
        });
    }
    else {
      this.message.showMessage('error', 'auth.pass_change_error', 'auth.repeat_password_error')
    }
  }

}
