import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryCollectionCommentsComponent } from './treasury-collection-comments.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TreasuryCollectionCommentsComponent', () => {
  let component: TreasuryCollectionCommentsComponent;
  let fixture: ComponentFixture<TreasuryCollectionCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryCollectionCommentsComponent ],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryCollectionCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
