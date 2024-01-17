import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderTestComponent } from './slider-test.component';

describe('SliderTestComponent', () => {
  let component: SliderTestComponent;
  let fixture: ComponentFixture<SliderTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SliderTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
