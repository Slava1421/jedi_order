import { Component, Inject, OnInit } from '@angular/core';
import { CZ_SNACK_BAR_DATA } from 'src/core/components/snack-bar/shared/snack-bar';

@Component({
  selector: 'app-snack-bar-message',
  templateUrl: './snack-bar-message.component.html',
  styleUrl: './snack-bar-message.component.scss'
})
export class SnackBarMessageComponent implements OnInit {
  constructor(
    @Inject(CZ_SNACK_BAR_DATA) private data: any
  ) {
    // console.log(222);
    console.log(this.data)
  }
  ngOnInit(): void {
    console.log('11',this.data)
  }
}
