import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluterwaveKeyListComponent } from './fluterwave-key-list.component';
import {RouterTestingModule} from '@angular/router/testing';
import {LoadingService} from '../../../core/services/loading.service';
import {GLMappingService} from '../../../core/services/glmapping.service';

describe('FluterwaveKeyListComponent', () => {
  let component: FluterwaveKeyListComponent;
  let fixture: ComponentFixture<FluterwaveKeyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluterwaveKeyListComponent ],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: [LoadingService, GLMappingService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluterwaveKeyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
