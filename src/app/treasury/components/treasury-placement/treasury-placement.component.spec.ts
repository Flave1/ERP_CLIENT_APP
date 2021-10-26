import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryPlacementComponent } from './treasury-placement.component';

describe('TreasuryPlacementComponent', () => {
  let component: TreasuryPlacementComponent;
  let fixture: ComponentFixture<TreasuryPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
