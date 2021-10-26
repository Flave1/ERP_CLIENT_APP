import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInfoListComponent } from './bank-info-list.component';

describe('BankInfoListComponent', () => {
  let component: BankInfoListComponent;
  let fixture: ComponentFixture<BankInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
