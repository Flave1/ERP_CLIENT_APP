import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeListComponent } from './product-type-list.component';
import {ProductService} from '../../../core/services/product.service';
import {LoadingService} from '../../../core/services/loading.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('ProductTypeListComponent', () => {
  let component: ProductTypeListComponent;
  let fixture: ComponentFixture<ProductTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTypeListComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{
        provide: [ProductService, LoadingService]
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should expect product information length to be 0', () => {
    expect(component.productInformation.length).toBe(0)
  })
});
