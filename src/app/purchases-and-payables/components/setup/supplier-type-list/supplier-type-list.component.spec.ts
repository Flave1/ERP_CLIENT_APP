import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTypeListComponent } from './supplier-type-list.component';

describe('SupplierTypeListComponent', () => {
  let component: SupplierTypeListComponent;
  let fixture: ComponentFixture<SupplierTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
