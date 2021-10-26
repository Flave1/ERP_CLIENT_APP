import { Component, OnInit } from '@angular/core';
import { GLMappingService } from 'src/app/core/services/glmapping.service';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-flutter-transfer-list',
  templateUrl: './flutter-transfer-list.component.html'
})
export class FlutterTransferListComponent implements OnInit {
  transferInformation : any[] = [];
  selectedtransferInformation : any[] = [];
  viewHeight: any = "600px";
  cols : any[] = [];
  constructor(
    private glMappingService: GLMappingService,
    private loadingService: LoadingService,
  ) {
    this.cols = [
      { field: "account_number", header: "Account Number" },
      { field: "full_name", header: "Full Name" },
      {
        field: "Bank",
        header: "bank_name"
      },
      {
        field: "Currency",
        header: "currency"
      },
      {
        header: "Status",
        field: "status"
      }
    ];
   }

  ngOnInit() {
    this.getTransfers();
  }

  getTransfers() {
    this.loadingService.show();
    this.glMappingService.getAlltransfers().subscribe(data => {
      this.loadingService.hide();
      this.transferInformation = data.data;
    }, err => {
      this.loadingService.hide()
    });
  }

}
