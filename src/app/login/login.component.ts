import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralApiService } from '../general-api.service';
import { User } from '../model/user';
import { first } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  accountNotFound = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: GeneralApiService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  get formEmail() {
    return this.form.controls['email'];
  }

  get formPassword() {
    return this.form.controls['password'];
  }

  get formBody() {
    return this.form;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    let user: User = {
      id: null,
      email: this.formEmail.value,
      password: this.formPassword.value,
    };

    this.api
      .login(user)
      .pipe(first())
      .subscribe({
        next: (data) => {
          if (data.length === 0) {
            this.accountNotFound = true;
          } else {
            this.accountNotFound = false;
            let token = data[0].token || '';
            this.loginService.LoginToken = token;
            this.loginService.Email = data[0].email;
            this.router.navigateByUrl('histogram');
          }
        },
        error: (error) => {},
        complete: () => {},
      });
  }

  reFocus(){
    this.isSubmitted = false;
    this.accountNotFound = false
  }
}
