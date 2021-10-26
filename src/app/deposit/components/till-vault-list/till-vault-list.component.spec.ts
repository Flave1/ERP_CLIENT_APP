import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TillVaultListComponent } from './till-vault-list.component';

describe('TillVaultListComponent', () => {
  let component: TillVaultListComponent;
  let fixture: ComponentFixture<TillVaultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TillVaultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TillVaultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
