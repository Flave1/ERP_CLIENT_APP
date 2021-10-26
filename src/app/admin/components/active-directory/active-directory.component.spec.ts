import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDirectoryComponent } from './active-directory.component';
import {ReactiveFormsModule} from '@angular/forms';

describe('ActiveDirectoryComponent', () => {
  let component: ActiveDirectoryComponent;
  let fixture: ComponentFixture<ActiveDirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveDirectoryComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
