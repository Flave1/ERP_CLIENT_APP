import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {CompanyService} from '../../../core/services/company.service';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-company-setup-list',
  templateUrl: './company-setup-list.component.html',
  styleUrls: ['./company-setup-list.component.css']
})
export class CompanySetupListComponent implements OnInit {
    companyStructureList: any[] = [];
    cols: any[] = [];
    selectedCompanyStructure: any;
    viewHeight: any = '600px';
  constructor(
      private loadingService: LoadingService,
      private companyService: CompanyService,
      private router: Router
  ) { }

  ngOnInit() {
      this.getAllCompanyStructure();
  }
    getAllCompanyStructure() {
        this.loadingService.show();
        this.companyService.getAllCompanyStructure().subscribe(data => {
            this.loadingService.hide();
            this.companyStructureList = data["companyStructures"];
            if (this.companyStructureList == undefined) {
                this.companyStructureList = [];
            }
        }, err => {
            this.loadingService.hide()
        });
    }
    editCompanyStructure(row) {
        this.router.navigate(["/organization/company-setup"], {
            queryParams: { id: row.companyStructureId }
        });
    }
}
