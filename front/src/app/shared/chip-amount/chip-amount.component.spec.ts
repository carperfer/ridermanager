import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipAmountComponent } from './chip-amount.component';

describe('ChipAmountComponent', () => {
  let component: ChipAmountComponent;
  let fixture: ComponentFixture<ChipAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
