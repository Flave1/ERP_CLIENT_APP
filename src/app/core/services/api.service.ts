// import { AppConfigService } from "./app.config.service";
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { JwtService } from './jwt.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// let AppConstant: any = {};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private jwtService: JwtService) {
    // AppConstant = appConfigService;
  }
  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(`${environment.api_url}${path}`, JSON.stringify(body))
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, JSON.stringify(body))
      .pipe(catchError(this.formatErrors));
  }

  postUpload(path: string, body: FormData): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, body, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http
      .delete(`${environment.api_url}${path}`)
      .pipe(catchError(this.formatErrors));
  }

  getExcel(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  uploadExcel(path, file: File) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('File', file, file.name);

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadFile(path, file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('Image', file, file.name);

      formData.append('profileId', body);

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadRegistry(path, file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('Image', file, file.name);

      formData.append('companyId', body);

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadFSTemplate(path, file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('Image', file, file.name);

      formData.append('companyId', body.companyStructureId);

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadCollateralDocumentWithData(path, file: File, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('document', file, file.name);
      formData.append('collateralCustomerId', body.collateralCustomerId);
      formData.append('customerId', body.customerId);
      formData.append('collateralTypeId', body.collateralTypeId);
      formData.append('currencyId', body.currencyId);
      formData.append(
        'collateralVerificationStatus',
        body.collateralVerificationStatus
      );
      formData.append('collateralValue', body.collateralValue);
      formData.append('location', body.location);
      formData.append('collateralCode', body.collateralCode);
      formData.append('loanApplicationId', body.loanApplicationId);

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  upload(path, body: any, file: File) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('supportDocument', file, file.name);
      formData.append('loanCreditBureauId', body.loanCreditBureauId);
      formData.append('creditBureauId', body.creditBureauId);
      formData.append('loanApplicationId', body.loanApplicationId);
      formData.append('chargeAmount', body.chargeAmount);
      formData.append('reportStatus', body.reportStatus);

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  offerLetterUpload(path, body: any, file: File) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('supportDocument', file, file.name);
      formData.append('loanApplicationId', body.loanApplicationId);
      formData.append('reportStatus', body.reportStatus);

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadFileLoanCustomer(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/loancustomer/add/update/document`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('file', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }
  uploadInvestorCustomer(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/investorcustomer/document-upload`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('file', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }
  uploadTreasury(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/issuerregistration/add/update/documents`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('file', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }
  uploadFileCustomer(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/deposit2/kycdoc`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('file', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadSignatorySignature(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/accountopening/add/signatory`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('file', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadDirectorSignature(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/deposit2/director-upload`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('file', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }
  uploadCreditDirectorSignature(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/loancustomer/add/update/director`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('file', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadSupplierAuthorization(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/supplier/add/update/authorization`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      if (file) {
        formData.append('file', file, file.name);
      }

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadSupplierBusinessOwners(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/supplier/add/update/businessOwner`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      if (file != undefined) {
        formData.append('file', file, file.name);
      }

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadSupplierDocument(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/supplier/add/update/document`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('file', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  updateCompanyStructure(file: File, body: any, file2: File) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/company/add/update/companystructure`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      if (file2) {
        formData.append('fSTemplate', file2, file2.name);
      }
      if (file) {
        formData.append('file', file, file.name);
      }

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  updateLoanCheque(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/loan/add/update/loan/cheque`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      if (file) {
        formData.append('generalUpload', file, file.name);
      }

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadSingleLoanCheque(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/loan/upload/single/loan/cheque`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      if (file) {
        formData.append('singleUpload', file, file.name);
      }

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadPaymentPhase(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/purchase/update/proposal/phase`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      if (file) {
        formData.append('phaseDocument', file, file.name);
      }

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadBid(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/purchase/upload/proposal`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('proposalTenderUpload', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadCustomerSignature(file: File, body: any) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}/accountopening/add/signatory`;

      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('proposalTenderUpload', file, file.name);

      for (const key in body) {
        formData.append(key, body[key]);
      }

      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }
  uploadChequeAmount(path, body: any, file: File) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('loanApplicationId', body.loanApplicationId);
      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  uploadClaimEvidence(path, body: any, file: File) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('evidence', file, file.name);
      for (const key in body) {
        formData.append(key, body[key]);
      }
      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  addClaim(path, body: any, file: File) {
    return new Promise((resolve, reject) => {
      const url = `${environment.api_url}${path}`;
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      const formData = new FormData();
      formData.append('evidence', file, file.name);
      for (const key in body) {
        formData.append(key, body[key]);
      }
      let details = body.details;
      const payload = [];
      for (let i = 0; i < details.length; i++) {
        let item = {
          description: details[i].description,
          quantity: details[i].quantity,
          unitPrice: details[i].unitPrice,
          subTotal: details[i].subTotal,
        };
        payload.push(item);
      }
      details = JSON.stringify(payload);
      formData.append('detail', details);
      // this.createFormData(formData, body[key], body);
      const token = this.jwtService.getToken();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }
}
