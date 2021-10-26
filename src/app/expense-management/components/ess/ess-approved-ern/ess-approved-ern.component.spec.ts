import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssApprovedErnComponent } from './ess-approved-ern.component';

describe('EssApprovedErnComponent', () => {
  let component: EssApprovedErnComponent;
  let fixture: ComponentFixture<EssApprovedErnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssApprovedErnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssApprovedErnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
