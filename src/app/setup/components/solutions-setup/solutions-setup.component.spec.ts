import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsSetupComponent } from './solutions-setup.component';

describe('SolutionsSetupComponent', () => {
  let component: SolutionsSetupComponent;
  let fixture: ComponentFixture<SolutionsSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionsSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionsSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
