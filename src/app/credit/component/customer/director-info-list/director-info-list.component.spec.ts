import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorInfoListComponent } from './director-info-list.component';

describe('DirectorInfoListComponent', () => {
  let component: DirectorInfoListComponent;
  let fixture: ComponentFixture<DirectorInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectorInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
