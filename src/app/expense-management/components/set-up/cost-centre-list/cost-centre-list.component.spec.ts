import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCentreListComponent } from './cost-centre-list.component';

describe('CostCentreListComponent', () => {
  let component: CostCentreListComponent;
  let fixture: ComponentFixture<CostCentreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCentreListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCentreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
