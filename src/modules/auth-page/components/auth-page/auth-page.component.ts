import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {
  authForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  constructor(
    private _auth: AuthService,
    private _router: Router,
  ) { }

  onSubmit(): void {
    if (!this.authForm.valid) {
      return;
    }
    
    const { email, password } = this.authForm.controls;

    this._auth.logIn(email.value, password.value)
      .subscribe({
        next: () => {
          this._router.navigate(['/main']);
        },
        error: (e) => {
          console.error(e);
          alert('Помилка');
        }
      })
  }
}
