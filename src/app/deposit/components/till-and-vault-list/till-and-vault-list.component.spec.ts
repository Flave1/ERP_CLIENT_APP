import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TillAndVaultListComponent } from './till-and-vault-list.component';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

describe('TillAndVaultListComponent', () => {
  let component: TillAndVaultListComponent;
  let fixture: ComponentFixture<TillAndVaultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TillAndVaultListComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TillAndVaultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
