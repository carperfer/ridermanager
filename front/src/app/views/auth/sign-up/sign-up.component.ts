import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShowMessageService } from 'src/app/services/show-message/show-message.service';
import { ErrorService } from 'src/app/services/error/error.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {

  userForm!: FormGroup;

  constructor(private router: Router, private usersService: UsersService, private fb: FormBuilder, private errorService: ErrorService, private message: ShowMessageService) {

  }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
      phone: ['', [Validators.required]],
      name: ['', [Validators.required]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    });
  }

  register() {
    this.usersService.registerUser(this.userForm.value).then(response => {
      if (response.id) {
        this.message.showMessage('success', 'auth.finished', 'auth.user_created')
        this.router.navigate(['login']);
      }
    }).catch((err) => {
      this.errorService.showError(err.error.code, err.error.error);
    }).finally(() => {

    })
  }
  public goToLogin() {
    this.router.navigate(['/login']);
  }
}
