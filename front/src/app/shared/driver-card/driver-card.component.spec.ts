import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCardComponent } from './driver-card.component';

describe('DriverCardComponent', () => {
  let component: DriverCardComponent;
  let fixture: ComponentFixture<DriverCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
