import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewLandingComponent } from './order-new-landing.component';

describe('OrderNewLandingComponent', () => {
  let component: OrderNewLandingComponent;
  let fixture: ComponentFixture<OrderNewLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderNewLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
