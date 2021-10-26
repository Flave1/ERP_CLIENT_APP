import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunImpairmentsComponent } from './run-impairments.component';
import {LoadingService} from '../../../core/services/loading.service';

describe('RunImpairmentsComponent', () => {
  let component: RunImpairmentsComponent;
  let fixture: ComponentFixture<RunImpairmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunImpairmentsComponent ],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunImpairmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
