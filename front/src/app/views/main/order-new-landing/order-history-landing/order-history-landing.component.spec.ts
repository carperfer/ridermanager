import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryLandingComponent } from './order-history-landing.component';

describe('OrderHistoryLandingComponent', () => {
  let component: OrderHistoryLandingComponent;
  let fixture: ComponentFixture<OrderHistoryLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderHistoryLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
