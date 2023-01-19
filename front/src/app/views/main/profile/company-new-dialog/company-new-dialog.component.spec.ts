import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNewDialogComponent } from './company-new-dialog.component';

describe('CompanyNewDialogComponent', () => {
  let component: CompanyNewDialogComponent;
  let fixture: ComponentFixture<CompanyNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyNewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
