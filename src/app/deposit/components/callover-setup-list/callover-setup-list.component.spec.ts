import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalloverSetupListComponent } from './callover-setup-list.component';
import {RouterTestingModule} from '@angular/router/testing';
import {LoadingService} from '../../../core/services/loading.service';

describe('CalloverSetupListComponent', () => {
  let component: CalloverSetupListComponent;
  let fixture: ComponentFixture<CalloverSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalloverSetupListComponent ],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalloverSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
