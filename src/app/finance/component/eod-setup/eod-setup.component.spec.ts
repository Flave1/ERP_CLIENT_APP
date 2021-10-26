import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EodSetupComponent } from './eod-setup.component';
import {ReactiveFormsModule} from '@angular/forms';

describe('EodSetupComponent', () => {
  let component: EodSetupComponent;
  let fixture: ComponentFixture<EodSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EodSetupComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EodSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
