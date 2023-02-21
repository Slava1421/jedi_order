import { Component } from '@angular/core';
import { AuthService } from 'src/core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jedi_order';

  constructor(private auth: AuthService) {

  }

  test(): void {
    this.auth.registration('viacheslavpopenko@gmail.com', '56222').subscribe();
  }
}
