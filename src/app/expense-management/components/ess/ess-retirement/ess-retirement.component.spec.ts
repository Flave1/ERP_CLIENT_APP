import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssRetirementComponent } from './ess-retirement.component';

describe('EssRetirementComponent', () => {
  let component: EssRetirementComponent;
  let fixture: ComponentFixture<EssRetirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssRetirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssRetirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
