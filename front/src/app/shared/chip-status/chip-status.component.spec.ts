import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipStatusComponent } from './chip-status.component';

describe('ChipStatusComponent', () => {
  let component: ChipStatusComponent;
  let fixture: ComponentFixture<ChipStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
