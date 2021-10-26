import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import swal from "sweetalert2";
import {LoadingService} from '../../../core/services/loading.service';
import {DepositAccountService} from '../../../core/services/depositaccount.service';

@Component({
  selector: 'app-till-and-vault-list',
  templateUrl: './till-and-vault-list.component.html',
  styleUrls: ['./till-and-vault-list.component.css']
})
export class TillAndVaultListComponent implements OnInit {
  tillVaultDetails: any[] = [];
  cols: any;
  selectedTillVault: any;
  viewHeight: string = '600px';

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private depositService: DepositAccountService
  ) { }

  ngOnInit() {
    this.getTillvault()
  }

  editTillVault(x) {
    this.router.navigate(['/deposit/till-vault'], {queryParams: {
      id: x.tillVaultId
      }})
  }

  submitMultipleDelete(payload) {
    this.loadingService.show();
    let body = { setup: payload };
    this.depositService.deleteTillVault(body).subscribe(
      data => {
        this.loadingService.hide();
        if (data["result"] == true) {
          swal.fire("GOSFINANCIAL", data["message"], "success");
          this.getTillvault();
        } else {
          swal.fire("GOSFINANCIAL", data["message"], "error");
        }
      },
      err => {
        this.loadingService.hide();
        swal.fire("GOSFINANCIAL", JSON.stringify(err), "error");
      }
    );
  }
  multipleDelete() {
    if (this.selectedTillVault.length == 0) {
      swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
      return;
    }
    let tempData = this.selectedTillVault;
    let targetIds = [];
    if (tempData !== undefined) {
      tempData.forEach(el => {
        let data = {
          setupId: el.tillVaultId
        };
        targetIds.push(data);
      });
    }
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
          this.submitMultipleDelete(targetIds);
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  showAddNew() {
    this.router.navigateByUrl('/deposit/till-vault')
  }

  getTillvault() {
    this.loadingService.show();
    return this.depositService.getTillVaults().subscribe(data => {
      this.loadingService.hide();
      this.tillVaultDetails = data.result;
    }, err => {
      this.loadingService.hide();
    })
  }
}
