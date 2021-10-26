import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSuppliersComponent } from './pending-suppliers.component';

describe('PendingSuppliersComponent', () => {
  let component: PendingSuppliersComponent;
  let fixture: ComponentFixture<PendingSuppliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingSuppliersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
