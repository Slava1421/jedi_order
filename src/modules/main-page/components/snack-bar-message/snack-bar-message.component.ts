import { Component, Inject, OnInit } from '@angular/core';
import { ButtonModule } from '../../../../core/components/button/button.module';
import { IconModule } from '../../../../core/components/icon/icon.module';
import { CZ_SNACK_BAR_DATA, CzSnackBarRef } from '../../../../core/components/snack-bar/shared/snack-bar';

@Component({
  selector: 'app-snack-bar-message',
  standalone: true,
  imports: [IconModule, ButtonModule],
  templateUrl: './snack-bar-message.component.html',
  styleUrl: './snack-bar-message.component.scss'
})
export class SnackBarMessageComponent implements OnInit {
  constructor(
    public snackBarRef: CzSnackBarRef<SnackBarMessageComponent>,
    @Inject(CZ_SNACK_BAR_DATA) public data: any
  ) {
  }
  ngOnInit(): void {

  }

  close(): void {
    this.snackBarRef.dismissWithAction();
  }
}
