import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReqListComponent } from './admin-req-list.component';

describe('AdminReqListComponent', () => {
  let component: AdminReqListComponent;
  let fixture: ComponentFixture<AdminReqListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReqListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
