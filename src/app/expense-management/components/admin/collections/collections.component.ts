import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';
import { ExpenseManagementService } from '../../../../core/services/expense-management.service';
import { Collection, SearchColumn } from '../../../../models/models';
import { SubGLService } from '../../../../core/services/subgl.service';
import swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css'],
})
export class CollectionsComponent implements OnInit {
  collections: Collection[] = [];
  cols: SearchColumn[];
  selectedItem: any;
  viewHeight = '600px';
  showDialog: boolean;
  bankGls: any[] = [];
  collectionId: number;
  constructor(
    private loadingService: LoadingService,
    private expenseManagementService: ExpenseManagementService,
    private subGLService: SubGLService
  ) {}

  ngOnInit(): void {
    this.getCollections();
    this.getBankGls();
  }
  getCollections() {
    this.loadingService.show();
    return this.expenseManagementService.getCollections().subscribe(
      (data) => {
        this.loadingService.hide();
        this.collections = data;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  confirmRefund(collectionId: number) {
    this.showDialog = true;
    this.collectionId = collectionId;
  }

  getBankGls() {
    return this.subGLService.getBankGls().subscribe((data) => {
      this.bankGls = data.bank;
    });
  }

  confirm(value: any) {
    const payload = {
      companyBank: +value,
      collectionId: this.collectionId,
    };

    swal
      .fire({
        title: `Do you want to confirm this item for refund?`,
        text: `You won't be able to revert this`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        icon: 'warning',
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.loadingService.show();
          return this.expenseManagementService
            .confirmRefund(payload)
            .subscribe(
              (res) => {
                this.loadingService.hide();
                const message = res['status'].message.friendlyMessage;
                if (res['status'].isSuccessful) {
                  swal.fire('GOS FINANCIAL', message, 'success').then(() => {
                    this.getCollections(); 
                    this.showDialog = false; 
                    this.clearBank();
                  });
                } else {
                  swal.fire('GOS FINANCIAL', message, 'error');
                }
              },
              (err) => {
                this.loadingService.hide();
                this.clearBank();
                const message = err['status'].message.friendlyMessage;
                swal.fire('GOS FINANCIAL', message, 'error');
              }
            );
        }else{

          this.collectionId = 0;
          this.showDialog = false;
          this.clearBank();
        }
      }); 
 
    // this.loadingService.show();
    // return this.expenseManagementService.confirmRefund(payload).subscribe(
    //   (res) => {
    //     this.loadingService.hide();
    //     const message = res.status.message.friendlyMessage;
    //     if (res.status.isSuccessful) {
    //       swal.fire('GOS FINANCIAL', message, 'success').then(() => {
    //         this.getCollections();
    //         this.showDialog = false;
    //       });
    //     } else {
    //       swal.fire('GOS FINANCIAL', message, 'error');
    //     }
    //   },
    //   (err) => {
    //     this.loadingService.hide();
        
    //     debugger;
    //     const message = err.status.message.friendlyMessage;
    //     swal.fire('GOS FINANCIAL', message, 'error');
    //   }
    // );
  }
  clearBank(){
    $('#bankSelected').val("0"); 
  }
}
