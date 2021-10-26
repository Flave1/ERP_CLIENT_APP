import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailconfigListComponent } from './emailconfig-list.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('EmailconfigListComponent', () => {
  let component: EmailconfigListComponent;
  let fixture: ComponentFixture<EmailconfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailconfigListComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailconfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
