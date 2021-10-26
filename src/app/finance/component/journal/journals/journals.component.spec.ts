import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalsComponent } from './journals.component';
import { LoadingService } from '../../../../core/services/loading.service';
import { GLService } from '../../../../core/services/gl.service';
import { DataService } from '../../../../core/services/data.service';
import { JournalService } from '../../../../core/services/journal.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('JournalsComponent', () => {
  let component: JournalsComponent;
  let fixture: ComponentFixture<JournalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JournalsComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: [LoadingService, GLService, DataService, JournalService],
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
