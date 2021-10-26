import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCentreComponent } from './cost-centre.component';

describe('CostCentreComponent', () => {
  let component: CostCentreComponent;
  let fixture: ComponentFixture<CostCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCentreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
