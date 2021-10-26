import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextofkinInfoListComponent } from './nextofkin-info-list.component';

describe('NextofkinInfoListComponent', () => {
  let component: NextofkinInfoListComponent;
  let fixture: ComponentFixture<NextofkinInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextofkinInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextofkinInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
