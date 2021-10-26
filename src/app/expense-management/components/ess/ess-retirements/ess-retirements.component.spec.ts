import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssRetirementsComponent } from './ess-retirements.component';

describe('EssRetirementsComponent', () => {
  let component: EssRetirementsComponent;
  let fixture: ComponentFixture<EssRetirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssRetirementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssRetirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
