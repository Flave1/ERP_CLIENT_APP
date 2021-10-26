import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSetupListComponent } from './transfer-setup-list.component';
import {LoadingService} from '../../../core/services/loading.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TransferSetupListComponent', () => {
  let component: TransferSetupListComponent;
  let fixture: ComponentFixture<TransferSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferSetupListComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
