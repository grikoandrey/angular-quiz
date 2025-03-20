import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {SignupResponseType} from "../../../../types/signup-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginResponseType} from "../../../../types/login-response.type";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.pattern(/^[а-я]+\s*$/i), Validators.required]),
    lastName: new FormControl('', [Validators.pattern(/^[а-я]+\s*$/i), Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/), Validators.required]),
    agree: new FormControl(false, [Validators.required]),
  })

  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  signup(): void {
    if (this.signupForm.valid
      && this.signupForm.value.email && this.signupForm.value.password
      && this.signupForm.value.name && this.signupForm.value.lastName) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.lastName,
        this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: SignupResponseType) => {
            if (data && data.user && data.message
              && this.signupForm.value.email && this.signupForm.value.password) {
              this.authService.login(this.signupForm.value.email, this.signupForm.value.password)
                .subscribe({
                  next: (data: LoginResponseType) => {
                    if (data && data.fullName && data.refreshToken && data.accessToken
                      && data.userId && this.signupForm.value.email) {
                      // this.authService.setUserInfo({
                      //   fullName: data.fullName,
                      //   userId: data.userId,
                      //   email: this.signupForm.value.email,
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
                })
            } else {
              this._snackBar.open('Ошибка при регистрации, попробуйте еще раз!');
              throw new Error(data.message ? data.message : 'Error with data on signup');
            }
          },
          error: (error: HttpErrorResponse) => {
            this._snackBar.open('Ошибка при регистрации, попробуйте еще раз!');
            throw new Error(error.error.message);
          }
        });
    }
  }
}
