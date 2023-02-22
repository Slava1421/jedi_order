import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(
    private _auth: AuthService,
    private _router: Router,
  ) {}

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
