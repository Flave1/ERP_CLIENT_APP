import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LoadingService} from "../../../core/services/loading.service";
import {SubGLService} from "../../../core/services/subgl.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-bank-setup-list',
  templateUrl: './bank-setup-list.component.html',
  styleUrls: ['./bank-setup-list.component.css']
})
export class BankSetupListComponent implements OnInit {
  banks: any[] = [];
  viewHeight: string = '600px';
  selectedItem: any[] = [];

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private subGlService: SubGLService
  ) { }

  ngOnInit() {
    this.getBankSetups()
  }

  getBankSetups() {
    this.loadingService.show();
    return this.subGlService.getBankGls().subscribe(data => {
      this.loadingService.hide();
     this.banks = data.bank
    }, err => {
      this.loadingService.hide()
    })
  }
  multipleDelete() {
    if (this.selectedItem.length === 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    const tempData = this.selectedItem;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        targetIds.push(el.bankGlId);
      });
    }
    const body = {
      targetIds
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete this item?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.subGlService.deleteBankGl(body).subscribe(
            data => {
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success").then(() => {
                  __this.getBankSetups();
                  this.selectedItem = []
                });
              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
              __this.loadingService.hide();
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOS FINANCIAL", message, "error");
            }
          );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  showAddNew() {
    this.router.navigate(['/finance/bank'])
  }

  exportBank() {

  }

  handleFileInput(files: any) {

  }

  uploadBank() {

  }

  editBank(bankGlId) {
    this.router.navigate(['/finance/bank'], {queryParams: {
      id: bankGlId
      }})
  }
}
