import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationSetupComponent } from './authentication-setup.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('AuthenticationSetupComponent', () => {
  let component: AuthenticationSetupComponent;
  let fixture: ComponentFixture<AuthenticationSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationSetupComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
