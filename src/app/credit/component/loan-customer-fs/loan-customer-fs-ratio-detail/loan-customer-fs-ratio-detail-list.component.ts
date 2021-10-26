import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { CustomerFsService } from "src/app/core/services/customer-fs.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
    selector: "app-loan-customer-fs-ratio-detail-list",
    templateUrl: "./loan-customer-fs-ratio-detail-list.component.html"
})
export class LoanCustomerFsRatioDetailListComponent implements OnInit {
    fSCaptionList: any[] = [];
    fsCaptionGroupList: any[] = [];
    captionRatioDetailList: any[] = [];
    selectedcaptionRatioDetail: any[];
    selectedFSRatioCaption: any;
    selectedFSCaptionGroup: any;
    disableRCaptionBtn: boolean;
    cols: any[];
    ratioCaptionId: number;
    fsCaptionGroupId: number;
    viewHeight: any = '600px';
    constructor(
        private loadingService: LoadingService,
        private customerFsService: CustomerFsService,
        private router: Router
    ) {}

    ngOnInit() {
        this.cols = [
            { field: "ratioCaptionName", header: "FS Ratio Caption" },
            { field: "fsCaptionName", header: "FS Caption Name" },
            // { field: "divisorTypeName", header: "Divisor Type" },
            // { field: "valueTypeName", header: "Value Type" },
            // { field: "multiplier", header: "Multiplier" }
        ];

        this.getAllCaptionRatio();
        // this.getAllCustomerFSCaption();
        // this.getAllFSCaptionGroup();

    }

    showAddNew() {
        this.router.navigate(["/credit/loan-customer-fscaption-ratio-detail"]);
    }

    getAllCaptionRatio(): void{
        this.loadingService.show();
        this.customerFsService.getAllCustomerFSRatioCaption()
            .subscribe(data => {
                this.loadingService.hide();
                this.captionRatioDetailList = data.loanCustomerFSRatioDetail;
            }, err => {
              this.loadingService.hide()
            });
    }
    // getAllCustomerFSCaption() {
    //     this.loadingService.show();
    //     this.customerFsService
    //         .getAllCustomerFSRatioCaption()
    //         .subscribe(data => {
    //             this.loadingService.hide();
    //             this.fSCaptionList = data["result"];
    //         });
    // }

    // onChangeCaptionGroupId(id: number){
    //     this.getFSCaptionByCaptionGroupId(id);
    // }

    // onChangeCaptionId(rCaptionId: number){
    //     this.getAllFSRatio(rCaptionId)
    //     //Call all the caption ratio from the system
    // }

    // getAllFSRatio(rCaptionId: number){
    //     if(rCaptionId == 0 || rCaptionId == null){
    //         this.fSCaptionList = [];
    //         return;
    //     }
    //     this.loadingService.show();
    //     this.customerFsService
    //         .getAllCustomerFsCaptionRatioByCaptionId(rCaptionId)
    //         .subscribe(data => {
    //             this.loadingService.hide();
    //             this.captionRatioDetailList = data.result;
    //         });
    // }

    // getFSCaptionByCaptionGroupId(id: number) {
    //     if(id == 0 || id == null){
    //         this.fSCaptionList = [];
    //         return;
    //     }
    //     this.loadingService.show();
    //     this.customerFsService
    //         .getAllCustomerFSCaptionByCaptionGroup(id)
    //         .subscribe(data => {
    //             this.loadingService.hide();
    //             this.fSCaptionList = data.result;
    //         });
    // }

    // getAllFSCaptionGroup() {
    //     this.loadingService.show();
    //     this.customerFsService
    //         .getAllCustomerFSCaptionGroup()
    //         .subscribe(data => {
    //             this.loadingService.hide();
    //             this.fsCaptionGroupList = data.result;
    //         });
    // }

    ///Done till here.

    onFsCaptionGroupSelect(fsGroupId) {
        this.fsCaptionGroupId = fsGroupId;
        this.disableRCaptionBtn = false;
        if (this.ratioCaptionId > 0) {
            this.getAllFSRatioDetails(this.ratioCaptionId, fsGroupId);
        }
    }

    onFSRatioCaptionSelect(rCaptionId) {
        this.getAllFSRatioDetails(rCaptionId, this.fsCaptionGroupId);
        this.ratioCaptionId = rCaptionId;
    }

    getAllFSRatioDetails(rCaptionId, fsCaptionGroupId) {
        this.loadingService.show();
        this.customerFsService
            .getAllCustomerFSCaptionRatioDetail(rCaptionId, fsCaptionGroupId)
            .subscribe(data => {
                this.loadingService.hide();

                //change name of this.
                this.captionRatioDetailList = data.result;
            });
    }

    editFSCaptionRatioDetail(row) {
        this.router.navigate(["/credit/loan-customer-fscaption-ratio-detail"], {
            queryParams: { editratiodetail: row.ratioDetailId }
        });
    }
    onRowSelect(event) {
        // this.router.navigate(["/credit/loan-customer-fscaption-ratio-detail"], {
        //     queryParams: { editratiodetail: event.data.ratioDetailId }
        // });
    }
    rowClicked(row: any): void {

    }

    deleteFSCaptionRatioDetail(row) {

        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.customerFsService
                    .deleteFSCaptionRatioDetail(row.ratioDetailId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record deleted successful.",
                                "success"
                            );
                            this.getAllCaptionRatio()
                            // __this.getAllFSRatioDetails(
                            //     this.ratioCaptionId,
                            //     this.fsCaptionGroupId
                            // );
                        } else {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record not deleted",
                                "error"
                            );
                        }
                    });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        });
    }

  multipleDelete() {
    if (this.selectedcaptionRatioDetail.length == 0) {
      return swal.fire('GOS FINANCIALS', 'Select the item(s) you want to delete', 'error')
    }
    let deleteItems = this.selectedcaptionRatioDetail;
    let targetIds = [];
    if (deleteItems !== undefined) {
      deleteItems.forEach(item => {
        // let data = {
        //   targetId: item.ratioDetailId,
        // };
        targetIds.push(item.ratioDetailId);
      });
    }

    swal.fire({
      title: "Are you sure you want to delete record?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!"
    }).then(result => {
      if (result) {

        this.loadingService.show();
        this.customerFsService.deleteMultipleFsRatioDetail(targetIds).subscribe(res => {
          this.loadingService.hide();
          const message = res.status.message.friendlyMessage;
         if (res.deleted) {
           swal.fire('GOS FINANCIAL', message, 'success');
           this.getAllCaptionRatio()
         } else {
           swal.fire('GOS FINANCIAL', message, 'error')
         }
        }, err => {
          this.loadingService.hide();
          const message = err.status.message.friendlyMessage;
          swal.fire('GOS FINANCIAL', message, 'error')
        })
      }
    }).catch(err => {

    })
  }
}
