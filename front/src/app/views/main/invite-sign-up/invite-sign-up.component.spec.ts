import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteSignUpComponent } from './invite-sign-up.component';

describe('InviteSignUpComponent', () => {
  let component: InviteSignUpComponent;
  let fixture: ComponentFixture<InviteSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
