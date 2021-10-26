import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { CustomerFsService } from "src/app/core/services/customer-fs.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-loan-customer-fs-caption-group-list",
  templateUrl: "./loan-customer-fs-caption-group-list.component.html"
})
export class LoanCustomerFsCaptionGroupListComponent implements OnInit {
  fsCaptionGroupList: any[];
  cols: any[];
  selectedFSCaptionGroup: any[] = [];
  private fileToUpload: File;
  viewHeight: any = "600px";

  constructor(
    private loadingService: LoadingService,
    private customerFsService: CustomerFsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "fSCaptionGroupName", header: "FS Caption Group Name" },
      { field: "position", header: "Position" }
    ];
    this.getAllFSCaptionGroup();
  }

  getAllFSCaptionGroup() {
    this.loadingService.show();
    this.customerFsService.getAllCustomerFSCaptionGroup().subscribe(
      data => {
        this.loadingService.hide();
        this.fsCaptionGroupList = data.loanCustomerFSGroup;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  showAddNew() {
    this.router.navigate(["/credit/loan-customer-fscaption-group"]);
  }

  editFSCaptionGroup(row) {
    this.router.navigate(["/credit/loan-customer-fscaption-group"], {
      queryParams: { editFSCaptionGroup: row.fsCaptionGroupId }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/credit/loan-customer-fscaption-group"], {
      queryParams: { editFSCaptionGroup: event.data.fsCaptionGroupId }
    });
  }
  deleteFSCaptionGroup(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete caption group?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.customerFsService
            .deleteFSCaptionGroup(row.fSCaptionGroupId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllFSCaptionGroup();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  rowClicked(row: any): void {

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
  // handleFileInput(file: FileList) {
  //     this.fileToUpload = file.item(0);
  // }
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
    if (this.selectedFSCaptionGroup.length === 0) {
      swal.fire("GOS FINANCIAL", "Please select records you want to delete", "error");
      return;
    }
    const targetIds = [];

    this.selectedFSCaptionGroup.forEach(x => {
      targetIds.push(x.fsCaptionGroupId);
    });

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

          __this.customerFsService.deleteMultipleFsGroup(targetIds).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.getAllFSCaptionGroup();
              } else {
                swal.fire("GOS FINANCIAL", message, "error");
              }
            },
            err => {
              const message = err.status.message.friendlyMessage;
              this.loadingService.hide();
              swal.fire("GOS FINANCIAL", message, "error");
            }
          );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
}
