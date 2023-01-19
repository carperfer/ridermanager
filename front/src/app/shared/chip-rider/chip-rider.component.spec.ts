import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipRiderComponent } from './chip-rider.component';

describe('ChipRiderComponent', () => {
  let component: ChipRiderComponent;
  let fixture: ComponentFixture<ChipRiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipRiderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipRiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
