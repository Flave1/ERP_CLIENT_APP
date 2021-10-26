import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TillVaultComponent } from './till-vault.component';

describe('TillVaultComponent', () => {
  let component: TillVaultComponent;
  let fixture: ComponentFixture<TillVaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TillVaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TillVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
