import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CzSliderItemComponent } from './cz-slider-item.component';

describe('CzSliderItemComponent', () => {
  let component: CzSliderItemComponent;
  let fixture: ComponentFixture<CzSliderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CzSliderItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CzSliderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
