import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationSetupListComponent } from './authentication-setup-list.component';

describe('AuthenticationSetupListComponent', () => {
  let component: AuthenticationSetupListComponent;
  let fixture: ComponentFixture<AuthenticationSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationSetupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
