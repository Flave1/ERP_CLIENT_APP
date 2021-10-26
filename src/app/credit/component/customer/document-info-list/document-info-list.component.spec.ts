import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentInfoListComponent } from './document-info-list.component';

describe('DocumentInfoListComponent', () => {
  let component: DocumentInfoListComponent;
  let fixture: ComponentFixture<DocumentInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
