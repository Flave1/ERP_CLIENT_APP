import { saveAs } from "file-saver";
import { CountryService } from "src/app/core/services/country.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { CommonService } from "../../../core/services/common.service";

@Component({
  selector: "app-job-title-list",
  templateUrl: "./job-title-list.component.html"
})
export class JobTitleListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  fileToUpload: File;
  jobTitleList: any[] = [];
  selectedJobTitle: any[] = [];
  cols: any[];
  viewHeight: any = "600px";
  constructor(
    private loadingService: LoadingService,
    private countryService: CountryService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "lookupName", header: "lookupName" },
      { field: "description", header: "description" },
      { field: "skills", header: "skills" },
      { field: "skillDescription", header: "skillDescription" }
    ];
    this.getAllJobTitle();
  }

  showAddNew() {
    this.router.navigate(["/setup/job-title"]);
  }

  getAllJobTitle() {
    this.loadingService.show();
    this.commonService.getJobTitles().subscribe(
      data => {
        this.loadingService.hide();
        this.jobTitleList = data.commonLookups;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editJobTitle(row) {
    this.router.navigate(["/setup/job-title"], {
      queryParams: { editJobTitle: row.lookupId }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/setup/job-title"], {
      queryParams: { editJobTitle: event.jobTitleId }
    });
  }

  exportJobTitle() {
    this.loadingService.show();
    this.countryService.exportJobTitle().subscribe(
      response => {
        this.loadingService.hide();
        const data = response;
        if (data != undefined) {
          const byteString = atob(data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const bb = new Blob([ab]);
          try {
            const file = new File([bb], "JobTitle.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "JobTitle.xlsx");
          }
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

 async uploadJobTitle() {
    if (this.fileToUpload == null) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select upload document to continue",
        "error"
      );
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
   await this.countryService
      .uploadJobTitle(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getAllJobTitle();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.getAllJobTitle();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = "";
        const error = JSON.parse(err);
        const message = error.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  deleteJobTitle(row) {
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

          __this.countryService
            .deleteJobTitle(row.jobTitleId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllJobTitle();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  multipleDelete() {
    if (this.selectedJobTitle.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    const tempData = this.selectedJobTitle;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        const data = {
          targetId: el.jobTitleId
        };
        targetIds.push(el.lookupId);
      });
    }
    const body = {
      itemsId: targetIds
    };
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

          __this.commonService.deleteMultipleJobTitle(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.status.isSuccessful) {
                swal.fire("GOS FINANCIAL", message, "success");
                this.selectedJobTitle = [];
                __this.getAllJobTitle();
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
