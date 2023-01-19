import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  newPassForm: FormGroup;
  repeatPasswordError: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private usersService: UsersService, private message: ShowMessageService) {
    this.newPassForm = this.fb.group({
      password: ['', [Validators.required]],
      password_confirmation: ['', Validators.required],
      token: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.usersService.checkUserToken(param.token)
        .then(() => this.newPassForm.patchValue({ token: param.token }))
        .catch(() => {
          this.message.showMessage('warn', 'Error: ', 'auth.page_dont_exist');
          this.goToLogin();
        });
    });
  }

  public newPassword() {
    //Checks validations before changing password
    if (this.newPassForm.value.password === this.newPassForm.value.password_confirmation)
      this.sendNewPassword();
    else {
      this.repeatPasswordError = true;
      this.message.showMessage('error', 'orders.error', 'auth.repeat_password_error');
    }

  }

  private sendNewPassword() {
    //Changes password
    this.usersService.resetPassword(this.newPassForm.value)
      .then(() => {
        this.message.showMessage('success', 'orders.success', 'auth.new_password_success')
        this.goToLogin();
      });
  }

  public goToLogin() {
    this.router.navigate(['/login'])
  }
}
