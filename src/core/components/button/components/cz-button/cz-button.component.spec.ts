import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CzButtonComponent } from './cz-button.component';

describe('CzButtonComponent', () => {
  let component: CzButtonComponent;
  let fixture: ComponentFixture<CzButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CzButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CzButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
