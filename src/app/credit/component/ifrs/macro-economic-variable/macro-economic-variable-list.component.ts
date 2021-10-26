import { IfrsService } from 'src/app/core/services/ifrs.service';
import { saveAs } from 'file-saver';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-macro-economic-variable-list',
  templateUrl: './macro-economic-variable-list.component.html'
})
export class MacroEconomicVariableListComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  fileToUpload: File;
  viewHeight: any = '600px';
  cols: any[];
  macroEconomicVariableList: any[] = [];
  selectedMacroEconomicVariable: any[];

  constructor(
    private loadingService: LoadingService,
    private ifrsService: IfrsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'year', header: 'year' },
      { field: 'unemployement', header: 'unemployement' },
      { field: 'erosion', header: 'erosion' },
      { field: 'foregnEx', header: 'foregnEx' },
      { field: 'gdp', header: 'gdp' },
      { field: 'inflation', header: 'inflation' }
    ];
    this.getAllMacroEconomicVariable();
  }

  showAddNew() {
    this.router.navigate(['/credit/macro-economic-variable']);
  }

  getAllMacroEconomicVariable() {
    this.loadingService.show();
    this.ifrsService.getAllMacroEconomicVariable().subscribe(
      data => {
        this.loadingService.hide();
        this.macroEconomicVariableList = data.macroVariables;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  editMacroEconomicVariable(row) {
    this.router.navigate(['/credit/macro-economic-variable'], {
      queryParams: {
        editmacroeconomicvariable: row.macroEconomicVariableId
      }
    });
  }

  rowClicked(row: any): void {}

  exportMacroEconomicVariable() {
    this.loadingService.show();
    this.ifrsService.exportMacroEconomicVariable().subscribe(response => {
      this.loadingService.hide();
      let data = response.export;
      if (data != undefined) {
        var byteString = atob(data);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);
        try {
          var file = new File([bb], 'MacroEconomicVariable.xlsx', {
            type: 'application/vnd.ms-excel'
          });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], {
            type: 'application/vnd.ms-excel'
          });
          window.navigator.msSaveBlob(
            textFileAsBlob,
            'MacroEconomicVariable.xlsx'
          );
        }
      }
    });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  uploadMacroEconomicVariable() {
    if (this.fileToUpload == null) {
      swal.fire('Error', 'Please select upload document to continue', 'error');
      return;
    }
    if (
      this.fileToUpload.type !=
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return swal.fire('Error', 'Only excel files allowed', 'error');
    }
    this.loadingService.show();
    this.ifrsService
      .uploadMacroEconomicVariable(this.fileToUpload)
      .then(data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          this.getAllMacroEconomicVariable();
          swal.fire('GOS FINANCIAL', message, 'success');
        } else {
          this.fileToUpload = null;
          this.fileInput.nativeElement.value = '';
          swal.fire('GOS FINANCIAL', message, 'error');
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.fileInput.nativeElement.value = '';
        const message = err.status.message.friendlyMessage;
        swal.fire('GOS FINANCIAL', message, 'error');
      });
  }

  deleteMacroEconomicVariable(row) {
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete this record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!'
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.ifrsService
            .deleteMacroEconomicVariable(row.macroEconomicVariableId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data['result'] == true) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getAllMacroEconomicVariable();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  multipleDelete() {
    if (this.selectedMacroEconomicVariable.length === 0) {
      swal.fire('GOS FINANCIAL', 'Please select records you want to delete', 'error');
      return;
    }
    const tempData = this.selectedMacroEconomicVariable;
    const targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        // const data = {
        //   targetId: el.userAccountId
        // };
        targetIds.push(parseInt(el.macroEconomicVariableId));
      });
    }
    var body = {
      ids: targetIds
    };
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete record?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!'
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.ifrsService.multiDeleteMacroEconomicVariable(body).subscribe(
            data => {
              __this.loadingService.hide();
              const message = data.status.message.friendlyMessage;
              if (data.deleted) {
                swal.fire('GOS FINANCIAL', message, 'success');
                __this.getAllMacroEconomicVariable();
              } else {
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            },
            err => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire('GOS FINANCIAL', message, 'error');
            }
          );
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
}
