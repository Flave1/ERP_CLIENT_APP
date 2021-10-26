import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssRequisitionsComponent } from './ess-requisitions.component';

describe('EssRequisitionsComponent', () => {
  let component: EssRequisitionsComponent;
  let fixture: ComponentFixture<EssRequisitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssRequisitionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
