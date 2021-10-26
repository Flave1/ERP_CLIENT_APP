import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReqComponent } from './admin-req.component';

describe('AdminReqComponent', () => {
  let component: AdminReqComponent;
  let fixture: ComponentFixture<AdminReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
