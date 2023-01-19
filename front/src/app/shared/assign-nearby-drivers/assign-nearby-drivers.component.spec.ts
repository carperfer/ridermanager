import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignNearbyDriversComponent } from './assign-nearby-drivers.component';

describe('AssignNearbyDriversComponent', () => {
  let component: AssignNearbyDriversComponent;
  let fixture: ComponentFixture<AssignNearbyDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignNearbyDriversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignNearbyDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
