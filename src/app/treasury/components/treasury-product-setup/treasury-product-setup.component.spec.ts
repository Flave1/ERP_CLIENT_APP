import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryProductSetupComponent } from './treasury-product-setup.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('TreasuryProductSetupComponent', () => {
  let component: TreasuryProductSetupComponent;
  let fixture: ComponentFixture<TreasuryProductSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryProductSetupComponent ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryProductSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
