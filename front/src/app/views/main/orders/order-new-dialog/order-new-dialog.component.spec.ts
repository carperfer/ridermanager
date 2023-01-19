import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewDialogComponent } from './order-new-dialog.component';

describe('OrderNewDialogComponent', () => {
  let component: OrderNewDialogComponent;
  let fixture: ComponentFixture<OrderNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderNewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
