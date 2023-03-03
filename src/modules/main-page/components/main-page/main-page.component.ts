import { Component } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

export function tt(c: AbstractControl): ValidationErrors | null {

  if(Number(c.value) > 5) {
    return {
      errorMessage: 'Не більше 5'
    };
  }

  return null;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {

  input = new FormControl('', (c: AbstractControl) => tt(c));

  constructor(
    private _auth: AuthService,
    private _router: Router,
  ) { }

  test(): void {
    console.log(this.input);
  }

  logout(): void {
    this._auth.logOut().subscribe(
      {
        next: () => {
          this._router.navigate(['/auth']);
        },
        error: (e) => {
          console.error(e);
          alert('Помилка');
        }
      }
    );
  }
}
