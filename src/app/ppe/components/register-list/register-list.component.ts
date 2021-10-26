import { Component, OnInit, ViewChild } from "@angular/core";
import { PpeService } from "../../services/ppe.service";
import { LoadingService } from "../../../core/services/loading.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { saveAs } from "file-saver";

@Component({
  selector: "app-register-list",
  templateUrl: "./register-list.component.html",
  styleUrls: ["./register-list.component.css"]
})
export class RegisterListComponent implements OnInit {
  @ViewChild("fileInput") fileInput: any;
  registerList: any[] = [];
  cols: any;
  selectedItem: any;
  viewHeight: string = "600px";
  fileToUpload: File;
  constructor(
    private ppeService: PpeService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        header: "assetNumber",
        field: "assetNumber"
      },
      {
        header: "lpoNumber",
        field: "lpoNumber"
      },
      {
        header: "netBookValue",
        field: "netBookValue"
      },
      {
        header: "cost",
        field: "cost"
      },
      {
        header: "description",
        field: "description"
      }
    ];
    this.getRegisterList();
  }
  getRegisterList() {
    this.loadingService.show();
    return this.ppeService.getRegisterList().subscribe(
      data => {
        this.loadingService.hide();
        this.registerList = data.registers;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  ReassessUsefulLife() {}

  ReassessResidualValue() {}

  exportItems() {
    this.loadingService.show();
    this.ppeService.exportRegister().subscribe(
      response => {
        this.loadingService.hide();
        const data = response.export;
        if (data != undefined) {
          const byteString = atob(data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const bb = new Blob([ab]);
          try {
            const file = new File([bb], "Asset Register.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "Asset Register.xlsx");
          }
        } else {
          swal.fire(`GOS FINANCIAL`, "Unable to download data", "error");
        }
      },
      err => {
        return this.loadingService.hide();
      }
    );
  }

  uploadItems() {
    if (this.fileToUpload == null) {
      swal.fire("GOS FINANCIAL", "Please select upload document to continue", "error");
      return;
    }
    if (
      this.fileToUpload.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return swal.fire("GOS FINANCIAL", "Only excel files allowed", "error");
    }
    this.loadingService.show();
    this.ppeService
      .uploadRegister(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.getRegisterList();
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "success");
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = "";
          swal.fire("GOS FINANCIAL", message, "error");
        }
      })
      .catch(err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  editItem(x) {
    this.router.navigate(["/ppe/register"], {
      queryParams: {
        id: x.registerId
      }
    });
  }

  AddItems() {
    this.router.navigate(["/ppe/register"]);
  }

  downloadDepreciationReport() {
    this.loadingService.show();
    this.ppeService.exportDepreciationReport().subscribe(
      response => {
        this.loadingService.hide();
        const data = response.export;
        if (data != undefined) {
          const byteString = atob(data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const bb = new Blob([ab]);
          try {
            const file = new File([bb], "DepreciationReport.xlsx", {
              type: "application/vnd.ms-excel"
            });
            saveAs(file);
          } catch (err) {
            const textFileAsBlob = new Blob([bb], {
              type: "application/vnd.ms-excel"
            });
            window.navigator.msSaveBlob(textFileAsBlob, "DepreciationReport.xlsx");
          }
        } else {
          swal.fire(`GOS FINANCIAL`, "Unable to download data", "error");
        }
      },
      err => {
        return this.loadingService.hide();
      }
    );
  }
}
