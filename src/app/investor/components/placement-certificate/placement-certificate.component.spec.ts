import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementCertificateComponent } from './placement-certificate.component';

describe('PlacementCertificateComponent', () => {
  let component: PlacementCertificateComponent;
  let fixture: ComponentFixture<PlacementCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacementCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
