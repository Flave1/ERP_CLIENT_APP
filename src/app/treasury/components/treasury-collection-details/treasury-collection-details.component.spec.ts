import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryCollectionDetailsComponent } from './treasury-collection-details.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TreasuryCollectionDetailsComponent', () => {
  let component: TreasuryCollectionDetailsComponent;
  let fixture: ComponentFixture<TreasuryCollectionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryCollectionDetailsComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryCollectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
