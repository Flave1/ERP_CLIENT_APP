import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedErnComponent } from './approved-ern.component';

describe('ApprovedErnComponent', () => {
  let component: ApprovedErnComponent;
  let fixture: ComponentFixture<ApprovedErnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedErnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedErnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
