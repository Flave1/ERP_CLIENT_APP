import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryProductListComponent } from './treasury-product-list.component';

describe('TreasuryProductListComponent', () => {
  let component: TreasuryProductListComponent;
  let fixture: ComponentFixture<TreasuryProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
