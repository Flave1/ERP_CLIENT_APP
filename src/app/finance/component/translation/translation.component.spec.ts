import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationComponent } from './translation.component';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadingService} from '../../../core/services/loading.service';

describe('TranslationComponent', () => {
  let component: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
