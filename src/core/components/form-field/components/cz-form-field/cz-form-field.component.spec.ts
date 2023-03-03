import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CzFormFieldComponent } from './cz-form-field.component';

describe('CzFormFieldComponent', () => {
  let component: CzFormFieldComponent;
  let fixture: ComponentFixture<CzFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CzFormFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CzFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
