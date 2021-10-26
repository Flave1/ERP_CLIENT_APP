import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityInfoListComponent } from './identity-info-list.component';

describe('IdentityInfoListComponent', () => {
  let component: IdentityInfoListComponent;
  let fixture: ComponentFixture<IdentityInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentityInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
