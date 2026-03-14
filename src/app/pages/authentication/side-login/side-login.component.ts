import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from 'src/app/core/services/login.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { TokenService } from 'src/app/core/guards/token.service';
interface Form {
  userName: string;
  password: string;
}

@Component({
  selector: 'app-side-login',
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AppSideLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { targetRoute: string },
  ) {}
  loginForm!: FormGroup;
  redirectUrl: string | null = null;
  loginErrorMessage: string = '';
  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  form = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  getRedirectUrl(): string | null {
    const url = this.redirectUrl;
    this.redirectUrl = null;
    return url;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService
        .login({
          userName: this.loginForm.value.username ?? '',
          password: this.loginForm.value.password ?? '',
        })
        .subscribe({
          next: (res) => {
            let token = res.token.split(' ')[1];
            localStorage.setItem('authJWTToken', token);
            this.tokenService.setToken(token);
            this.dialogRef.close({ success: true });

            this.loginService.setLoginStatus(true);

            this.router.navigate([this.getRedirectUrl()]);
          },
          error: (error) => {
            console.error('Login failed:', error);

            this.loginService.setLoginStatus(false);
            this.loginErrorMessage =
              '* Invalid Username or Password. Please try again.'; // ❌ Set to false on error
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  onClose() {
    this.dialogRef.close({ success: false });

    this.router.navigate([this.data.targetRoute]);
  }
}
