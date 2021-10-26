import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SubGLService} from "../../../core/services/subgl.service";
import {LoadingService} from "../../../core/services/loading.service";

@Component({
  selector: 'app-bankgl-list',
  templateUrl: './bankgl-list.component.html',
  styleUrls: ['./bankgl-list.component.css']
})
export class BankglListComponent implements OnInit {
  bankGls: any[] = [];
  viewHeight: string = '600px';
  selectedItem: any[] = [];
  cols: any[] = [];

  constructor(
    private loadingService: LoadingService,
    private subglService: SubGLService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getBankGls()
  }

  getBankGls() {
    this.loadingService.show();
    return this.subglService.getBankGls().subscribe(data => {
      this.loadingService.hide();
      this.bankGls = data.bank
    }, err => {
      this.loadingService.hide()
    })
  }

  multipleDelete() {

  }

  showAddNew() {
    this.router.navigate(['/finance/bankgl'])
  }

  uploadItems() {

  }

  handleFileInput(files: any) {

  }

  exportItems() {

  }

  editItem(x) {
    this.router.navigate(['/finance/bankgl'], {queryParams: {
      id: x.bankGlId
      }})
  }
}
