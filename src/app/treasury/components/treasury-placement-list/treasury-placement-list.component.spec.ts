import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryPlacementListComponent } from './treasury-placement-list.component';

describe('TreasuryPlacementListComponent', () => {
  let component: TreasuryPlacementListComponent;
  let fixture: ComponentFixture<TreasuryPlacementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryPlacementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryPlacementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
