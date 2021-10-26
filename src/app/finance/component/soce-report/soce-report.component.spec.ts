import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoceReportComponent } from './soce-report.component';

describe('SoceReportComponent', () => {
  let component: SoceReportComponent;
  let fixture: ComponentFixture<SoceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
