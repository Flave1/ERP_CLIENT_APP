import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import swal from 'sweetalert2';
import { LoanCustomerService } from '../../../../core/services/loancustomer.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { DataService } from '../../../../core/services/data.service';
import { CommonService } from '../../../../core/services/common.service';

@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.css'],
})
export class DocumentInfoComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @Input() customerId: string;
  documentTypeId: any;
  documentTypeList: any[] = [];
  documentName: string;
  physicalLocation: string;
  file: File;
  files: FileList;
  displayDocumentUpload: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private loanCustomerService: LoanCustomerService,
    private loadingService: LoadingService,
    private dataService: DataService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getDocumentType();
  }

  // onFileChange(event: Event) {
  //   this.fileChange.emit(event);
  // }

  // uploadFile() {
  //   this.fileUpload.emit();
  // }

  closeDocumentUpload(value) {
    this.closeModal.emit(value);
    this.documentName = '';
    this.documentTypeId = '';
    this.physicalLocation = '';
  }
  fileExtention(name: string) {
    const regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }
  uploadFile() {
    if (this.file != undefined || this.documentName != null) {
      const body = {
        customerId: parseInt(this.customerId),
        documentName: this.documentName,
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        physicalLocation: this.physicalLocation,
        documentTypeId: this.documentTypeId,
      };
      this.loadingService.show();
      this.loanCustomerService
        .uploadFile(this.file, body)
        .then((data: any) => {
          this.loadingService.hide();
          const message = data.status.message.friendlyMessage;
          if (data.status.isSuccessful) {
            this.documentName = '';
            this.documentTypeId = '';
            this.fileInput.nativeElement.value = '';
            this.physicalLocation = '';
            // this.getLoanCustoemrDocumentUpload(this.customerId);
            this.dataService.reloadDocuments.emit();
            this.closeModal.emit(false);
            swal.fire(`GOS FINANCIAL`, message, 'success');
          } else {
            swal.fire(`GOS FINANCIAL`, message, 'error');
          }
        })
        .catch((err) => {
          this.loadingService.hide(1000);

          const message = err.status.message.friendlyMessage;
          this.documentName = null;
          this.documentTypeId = null;
          this.fileInput.nativeElement.value = '';
          this.dataService.reloadDocuments.emit();
          // this.getLoanCustoemrDocumentUpload(this.customerId);
          this.displayDocumentUpload = false;
          swal.fire(`GOS FINANCIAL`, message, 'error');
        });
    }
  }
  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }
  getDocumentType() {
    this.commonService.getAllDocumentType().subscribe((data) => {
      this.documentTypeList = data['commonLookups'];
    });
  }
}
