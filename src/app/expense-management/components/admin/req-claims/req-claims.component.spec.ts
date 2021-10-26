import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqClaimsComponent } from './req-claims.component';

describe('ReqClaimsComponent', () => {
  let component: ReqClaimsComponent;
  let fixture: ComponentFixture<ReqClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
