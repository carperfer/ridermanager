import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditDialogComponent } from './order-edit-dialog.component';

describe('OrderEditDialogComponent', () => {
  let component: OrderEditDialogComponent;
  let fixture: ComponentFixture<OrderEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
