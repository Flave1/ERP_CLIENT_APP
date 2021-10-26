import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutOfStationListComponent } from './out-of-station-list.component';

describe('OutOfStationListComponent', () => {
  let component: OutOfStationListComponent;
  let fixture: ComponentFixture<OutOfStationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutOfStationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutOfStationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
