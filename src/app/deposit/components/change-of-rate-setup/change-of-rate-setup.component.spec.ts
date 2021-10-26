import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOfRateSetupComponent } from './change-of-rate-setup.component';

describe('ChangeOfRateSetupComponent', () => {
  let component: ChangeOfRateSetupComponent;
  let fixture: ComponentFixture<ChangeOfRateSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOfRateSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOfRateSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
