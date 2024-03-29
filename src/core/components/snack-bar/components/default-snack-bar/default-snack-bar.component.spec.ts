import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultSnackBarComponent } from './default-snack-bar.component';

describe('DefaultSnackBarComponent', () => {
  let component: DefaultSnackBarComponent;
  let fixture: ComponentFixture<DefaultSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultSnackBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefaultSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
