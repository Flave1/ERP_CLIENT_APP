import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterListComponent } from './register-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('RegisterListComponent', () => {
  let component: RegisterListComponent;
  let fixture: ComponentFixture<RegisterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterListComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
