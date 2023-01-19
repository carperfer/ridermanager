import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEditDialogComponent } from './customer-edit-dialog.component';

describe('CustomerEditDialogComponent', () => {
  let component: CustomerEditDialogComponent;
  let fixture: ComponentFixture<CustomerEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerEditDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
