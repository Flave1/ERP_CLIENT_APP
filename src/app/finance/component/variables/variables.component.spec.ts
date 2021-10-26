import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesComponent } from './variables.component';
import {RegistryService} from '../../../core/services/registry';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('VariablesComponent', () => {
  let component: VariablesComponent;
  let fixture: ComponentFixture<VariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariablesComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: RegistryService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
