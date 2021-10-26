import { Component, OnInit } from "@angular/core";
import { CustomerFsService } from "src/app/core/services/customer-fs.service";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-loan-customer-fs-caption-list",
  templateUrl: "./loan-customer-fs-caption-list.component.html"
})
export class LoanCustomerFsCaptionListComponent implements OnInit {
  fSCaptionList: any[] = [];
  selectedSeletectFSCaption: any[];
  cols: any[];
  viewHeight: any = "600px";
  private fileToUpload: File;
  constructor(
    private loadingService: LoadingService,
    private customerFsService: CustomerFsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "fSCaptionName", header: "fSCaptionName" },
      { field: "fSCaptionGroupName", header: "fSCaptionGroupName" },
      { field: "isRatio", header: "isRatio" },
      { field: "position", header: "position" }
    ];
    this.getAllCustomerFSCaption();
  }

  showAddNew() {
    this.router.navigate(["/credit/loan-customer-fscaption"]);
  }

  getAllCustomerFSCaption() {
    this.loadingService.show();
    this.customerFsService.getAllCustomerFSCaption().subscribe(
      data => {
        this.loadingService.hide();
        this.fSCaptionList = data.loanCustomerFSCaption;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editFSCaption(row) {
    this.router.navigate(["/credit/loan-customer-fscaption"], {
      queryParams: { editfscaption: row.fsCaptionId }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/credit/loan-customer-fscaption"], {
      queryParams: { editfscaption: event.data.fsCaptionId }
    });
  }
  rowClicked(row: any): void {
  }

  deleteFSCaption(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.customerFsService
            .deleteFSCaption(row.fSCaptionId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllCustomerFSCaption();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  exportFSCaption() {
    this.loadingService.show();
    // this.customerFsService.exportFSCaption().subscribe(response => {
    //     this.loadingService.hide();
    //     const data = response.result;
    //     if (data != undefined) {
    //         const byteString = atob(data);
    //         const ab = new ArrayBuffer(byteString.length);
    //         const ia = new Uint8Array(ab);
    //         for (let i = 0; i < byteString.length; i++) {
    //             ia[i] = byteString.charCodeAt(i);
    //         }
    //         const bb = new Blob([ab]);
    //         try {
    //             const file = new File([bb], 'users.xlsx', {
    //                 type: 'application/vnd.ms-excel'
    //             });
    //             saveAs(file);
    //         } catch (err) {
    //             const textFileAsBlob = new Blob([bb], {
    //                 type: 'application/vnd.ms-excel'
    //             });
    //             window.navigator.msSaveBlob(textFileAsBlob, 'users.xlsx');
    //         }
    //     }
    // });
  }
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
  uploadFSCaption() {
    if (this.fileToUpload == null) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
      return;
    }
  }
  multipleDelete() {
    if (this.selectedSeletectFSCaption.length === 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    let targetIds: number[] = [];

    this.selectedSeletectFSCaption.forEach(x => targetIds.push(x.fsCaptionId));
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.customerFsService
            .deleteMultipleFsCaptions(targetIds)
            .subscribe(
              data => {
                __this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.deleted) {
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.getAllCustomerFSCaption();
                } else {
                  swal.fire("GOS FINANCIAL", message, "error");
                }
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
}
