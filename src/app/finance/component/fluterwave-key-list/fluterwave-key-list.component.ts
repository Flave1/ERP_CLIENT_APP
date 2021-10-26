import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LoadingService} from "../../../core/services/loading.service";
import {GLMappingService} from "../../../core/services/glmapping.service";

@Component({
  selector: 'app-fluterwave-key-list',
  templateUrl: './fluterwave-key-list.component.html',
  styleUrls: ['./fluterwave-key-list.component.css']
})
export class FluterwaveKeyListComponent implements OnInit {
  keys: any[] = [];
  viewHeight: string = '600px';
  selectedItem: any[] = [];

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private glMappingService: GLMappingService
  ) { }

  ngOnInit() {
    this.getKeysList()
  }

  getKeysList() {
    this.loadingService.show();
    return this.glMappingService.getFlutterKeys().subscribe(data => {
      this.loadingService.hide()
      this.keys = data.keys
    }, err => {
      this.loadingService.hide()
    })
  }
  multipleDelete() {

  }

  showAddNew() {
    this.router.navigate(['/finance/key-list'])
  }

  editItem(flutterWaveKeysId: any) {

  }
}
