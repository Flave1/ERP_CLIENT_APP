import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTermsListComponent } from './service-terms-list.component';

describe('ServiceTermsListComponent', () => {
  let component: ServiceTermsListComponent;
  let fixture: ComponentFixture<ServiceTermsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTermsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTermsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
