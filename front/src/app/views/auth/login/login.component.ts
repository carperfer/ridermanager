import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  login$: Subscription;
  getUser$: Subscription;

  constructor(private usersService: UsersService, private router: Router, private fb: FormBuilder, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  ngOnDestroy() {
    if (this.login$) this.login$.unsubscribe();
    if (this.getUser$) this.getUser$.unsubscribe();
  }

  public goToRecoverPassword() {
    this.router.navigate(['/recover-password'])
  }

  public goToSignUp() {
    this.router.navigate(['/sign-up'])
  }

  login() {
    this.login$ = this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        this.getUser$ = this.usersService.getAsyncUser().subscribe(userRes => {
          this.router.navigate(["/view"]);
        });
      },
      (error) => {
        localStorage.removeItem("login");
      }
    );
  }

}
