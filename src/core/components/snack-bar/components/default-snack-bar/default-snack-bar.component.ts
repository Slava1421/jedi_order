import { Component } from '@angular/core';
import { CzSnackBarRef } from '../../shared/snack-bar';

export interface TextOnlySnackBar {
  data: {message: string; action: string};
  snackBarRef: CzSnackBarRef<TextOnlySnackBar>;
  action: () => void;
  hasAction: boolean;
}

@Component({
  selector: 'app-default-snack-bar',
  templateUrl: './default-snack-bar.component.html',
  styleUrl: './default-snack-bar.component.scss'
})
export class DefaultSnackBarComponent implements TextOnlySnackBar{
  data: { message: string; action: string; };
  snackBarRef: CzSnackBarRef<TextOnlySnackBar>;
  action: () => void;
  hasAction: boolean;

}
