import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLinkFormComponent } from './external-link-form.component';

describe('ExternalLinkFormComponent', () => {
  let component: ExternalLinkFormComponent;
  let fixture: ComponentFixture<ExternalLinkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLinkFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
