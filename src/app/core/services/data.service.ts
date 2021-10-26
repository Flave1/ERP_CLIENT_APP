import { Injectable, EventEmitter } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  getData: EventEmitter<any> = new EventEmitter();
  getScheduleData: EventEmitter<any> = new EventEmitter();
  getRealData: EventEmitter<any> = new EventEmitter();
  fromDashboard: EventEmitter<any> = new EventEmitter();
  reloadJournals: EventEmitter<any> = new EventEmitter();
  showSection: EventEmitter<any> = new EventEmitter();
  reloadIdentity: EventEmitter<any> = new EventEmitter<any>();
  reloadDirectors: EventEmitter<any> = new EventEmitter<any>();
  reloadNextOKin: EventEmitter<any> = new EventEmitter<any>();
  reloadBankDetails: EventEmitter<any> = new EventEmitter<any>();
  reloadDocuments: EventEmitter<any> = new EventEmitter<any>();
  getTotalSum: EventEmitter<any> = new EventEmitter<any>();
  emitErnApproval: EventEmitter<any> = new EventEmitter<any>();
  emitErnDetailsApproval: EventEmitter<any> = new EventEmitter<any>();
  reloadClaimsData: EventEmitter<any> = new EventEmitter<any>();
  convertToFile(fileName: string, data: string) {
    if (data != undefined) {
      const byteString = atob(data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const bb = new Blob([ab]);
      try {
        const file = new File([bb], fileName, {
          type: 'application/vnd.ms-excel',
        });
        saveAs(file);
      } catch (err) {
        const textFileAsBlob = new Blob([bb], {
          type: 'application/vnd.ms-excel',
        });
        window.navigator.msSaveBlob(textFileAsBlob, fileName);
      }
    }
  }
}
