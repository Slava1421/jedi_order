import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from '../../../../core/components/button/button.module';
import { IconModule } from '../../../../core/components/icon/icon.module';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-notification',
  standalone: true,
  imports: [ButtonModule, IconModule],
  templateUrl: './auth-notification.component.html',
  styleUrl: './auth-notification.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AuthNotificationComponent {
  @HostBinding('class.noauth-page') item = true;

  constructor(
    private _router: Router,
  ) { }

  public navigateToAuth(): void {
    this._router.navigate(['/auth']);
  }
}
