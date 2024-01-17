import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonColor } from 'src/core/components/button/models/cz-button.model';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  host: {
    class: 'auth-page'
  },
  encapsulation: ViewEncapsulation.None,
})
export class AuthPageComponent {
  color: ButtonColor = 'green';

  validEmpty = (c: AbstractControl): ValidationErrors | null => {

    if(!c.value) {
      return {
        errorMessage: 'Заповніть поле'
      };
    }
  
    return null;
  }

  authForm: FormGroup = new FormGroup({
    email: new FormControl('', (c: AbstractControl) => this.validEmpty(c)),
    password: new FormControl('', (c: AbstractControl) => this.validEmpty(c)),
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
          alert('Помилка');
        }
      })
  }
}
