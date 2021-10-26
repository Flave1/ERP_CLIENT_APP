import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';
import { DataService } from '../../../../core/services/data.service';
@Component({
  selector: 'app-document-info-list',
  templateUrl: './document-info-list.component.html',
  styleUrls: ['./document-info-list.component.css'],
})
export class DocumentInfoListComponent implements OnInit {
  @Input() customerId: string;
  @Output() toggleModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() editDocument: EventEmitter<any> = new EventEmitter<any>();
  loanCustomerDocuments: any[] = [];
  selectedDocument: string;
  binaryFile: string;
  displayOutput: boolean;
  constructor(
    private loadingService: LoadingService,
    private loanCustomerService: LoanCustomerService,
    private dataService: DataService
  ) {
    this.dataService.reloadDocuments.subscribe(() => {
      this.getLoanCustoemrDocumentUpload();
    });
  }

  ngOnInit(): void {
    this.getLoanCustoemrDocumentUpload();
  }

  getLoanCustoemrDocumentUpload() {
    this.loanCustomerService
      .getLoanCustomerDocumentByLoanCustomer(this.customerId)
      .subscribe((data) => {
        this.loanCustomerDocuments = data.customerDocuments;
      });
  }
  deleteLoanCustoemrDocument(row) {
    if (row.documentTypeId == 1007) {
      return swal.fire('GOS FINANCIAL', 'Signature cannot be deleted', 'error');
    }
    const __this = this;
    swal
      .fire({
        title: 'Are you sure you want to delete document?',
        text: "You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
      })
      .then((result) => {
        if (result.value) {
          __this.loadingService.show();

          __this.loanCustomerService
            .deleteLoanCustomerDocument(row.customerDocumentId)
            .subscribe((data) => {
              __this.loadingService.hide();
              if (data.deleted) {
                swal.fire(
                  'GOS FINANCIAL',
                  'Record deleted successful.',
                  'success'
                );
                __this.getLoanCustoemrDocumentUpload();
              } else {
                swal.fire('GOS FINANCIAL', 'Record not deleted', 'error');
              }
            });
        } else {
          swal.fire('GOS FINANCIAL', 'Cancelled', 'error');
        }
      });
  }
  viewDocument(id: number) {
    this.loadingService.show();
    this.loanCustomerService.getLoanCustomerDocument(id).subscribe(
      (data) => {
        this.loadingService.hide();
        const doc = data.customerDocuments[0];

        if (doc != undefined) {
          this.binaryFile = doc.documentFile;
          this.selectedDocument = doc.documentName;
          this.displayOutput = true;
        }
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  DownloadDocument(id: number) {
    this.loadingService.show();
    this.loanCustomerService.getLoanCustomerDocument(id).subscribe((data) => {
      this.loadingService.hide();
      const fileDocument = data.customerDocuments[0];
      if (fileDocument != undefined) {
        this.binaryFile = fileDocument.documentFile;
        this.selectedDocument = fileDocument.documentName;
        const myDocExtention = fileDocument.documentExtension;
        const byteString = atob(this.binaryFile);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const bb = new Blob([ab]);

        if (myDocExtention == '.jpg' || myDocExtention == '.jpeg') {
          try {
            const file = new File([bb], this.selectedDocument + '.jpg', {
              type: 'image/jpg',
            });
            saveAs(file);
          } catch (err) {
            const saveFileAsBlob = new Blob([bb], {
              type: 'image/jpg',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.jpg'
            );
          }
        }
        if (myDocExtention == '.png' || myDocExtention == '.png') {
          try {
            const file = new File([bb], this.selectedDocument + '.png', {
              type: 'image/png',
            });
            saveAs(file);
          } catch (err) {
            const saveFileAsBlob = new Blob([bb], {
              type: 'image/png',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.png'
            );
          }
        }
        if (myDocExtention == '.pdf' || myDocExtention == '.pdf') {
          try {
            const file = new File([bb], this.selectedDocument + '.pdf', {
              type: 'application/pdf',
            });
            saveAs(file);
          } catch (err) {
            const saveFileAsBlob = new Blob([bb], {
              type: 'application/pdf',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.pdf'
            );
          }
        }
        if (myDocExtention == '.xls' || myDocExtention == '.xlsx') {
          try {
            const file = new File([bb], this.selectedDocument + '.xlsx', {
              type: 'application/vnd.ms-excel',
            });
            saveAs(file);
          } catch (err) {
            const saveFileAsBlob = new Blob([bb], {
              type: 'application/vnd.ms-excel',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.xlsx'
            );
          }
        }
        if (myDocExtention == '.doc' || myDocExtention == '.docx') {
          try {
            const file = new File([bb], this.selectedDocument + '.doc', {
              type: 'application/msword',
            });
            saveAs(file);
          } catch (err) {
            const saveFileAsBlob = new Blob([bb], {
              type: 'application/msword',
            });
            window.navigator.msSaveBlob(
              saveFileAsBlob,
              this.selectedDocument + '.doc'
            );
          }
        }
      }
    });
  }

  showAddNewDocument() {
    this.toggleModal.emit(true);
  }
}
