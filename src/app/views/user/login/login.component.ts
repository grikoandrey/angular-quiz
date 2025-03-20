import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {LoginResponseType} from "../../../../types/login-response.type";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/), Validators.required]),
  })

  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (data: LoginResponseType) => {
            if (data && data.fullName && data.refreshToken && data.accessToken
              && data.userId && this.loginForm.value.email) {
              // this.authService.setUserInfo({
              //   fullName: data.fullName,
              //   userId: data.userId,
              //   email: this.loginForm.value.email,
              // });
              // this.authService.setTokens(data.accessToken, data.refreshToken);
              this.router.navigate(['/choice']);
            } else {
              this._snackBar.open('Что-то пошло не так, попробуйте еще раз!');
              throw new Error(data.message ? data.message : 'Error with data on login');
            }
          },
          error: (error: HttpErrorResponse) => {
            this._snackBar.open('Что-то пошло не так, попробуйте еще раз!');
            throw new Error(error.error.message);
          }
        });
    }
  }
}
