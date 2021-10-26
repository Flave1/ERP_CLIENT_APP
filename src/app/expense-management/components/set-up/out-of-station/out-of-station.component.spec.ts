import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutOfStationComponent } from './out-of-station.component';

describe('OutOfStationComponent', () => {
  let component: OutOfStationComponent;
  let fixture: ComponentFixture<OutOfStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutOfStationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutOfStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
