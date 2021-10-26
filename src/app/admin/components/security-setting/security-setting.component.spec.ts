import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritySettingComponent } from './security-setting.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

describe('SecuritySettingComponent', () => {
  let component: SecuritySettingComponent;
  let fixture: ComponentFixture<SecuritySettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecuritySettingComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuritySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
