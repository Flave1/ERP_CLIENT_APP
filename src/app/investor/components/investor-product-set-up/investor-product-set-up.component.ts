import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InvestorFundService } from "../../../core/services/investor-fund.service";
import { LoadingService } from "../../../core/services/loading.service";
import swal from 'sweetalert2'
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: "app-investor-product-set-up",
    templateUrl: "./investor-product-set-up.component.html",
    styleUrls: ["./investor-product-set-up.component.css"]
})
export class InvestorProductSetUpComponent implements OnInit {
    form: FormGroup;
    formTitle = "Create Product Type";
    companyId: any = JSON.parse(localStorage.getItem('userDetails')).companyId;
    productTypeId: any;
    constructor(
        public fb: FormBuilder,
        private investorFundService: InvestorFundService,
        private loadingService: LoadingService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.form = this.fb.group({
            productTypeId: 0,
            name: ["", Validators.required],
            description: ["", Validators.required],
            companyId: this.companyId
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.productTypeId = params["editProductTypeId"];
            if (this.productTypeId != null || this.productTypeId != undefined) {
                this.editProductType(this.productTypeId);
            }
        });
    }

    submitProductInfo(form: any) {
        const payload = form.value;
        if (!payload.name) {
            return swal.fire('Error', 'Name is required', 'error')
        }
        if (!payload.description) {
            return swal.fire('Error', 'Description is required', 'error')
        }
        this.loadingService.show();
        return this.investorFundService.updateProductType(payload).subscribe(res => {
            this.loadingService.hide();
            const message = res.status.message.friendlyMessage;
            if (res.status.isSuccessful) {
                swal.fire('GOS FINANCIAL', message, 'success');
                this.router.navigateByUrl(`/investor/product-type`)
            } else {
                return swal.fire('GOS FINANCIAL', message, 'error')
            }
        }, err => {
          const message = err.status.message.friendlyMessage;
          this.loadingService.hide();
          swal.fire('GOS FINANCIAL', message, 'error')
        })
    }

    editProductType(productTypeId: any) {
        this.formTitle = "Edit Product Type Information";
        this.loadingService.show();
        this.investorFundService.getProductType(productTypeId).subscribe(data => {
            this.loadingService.hide();
            let row = data.infProductTypes[0];
            this.form = this.fb.group({
                productTypeId: row.productTypeId,
                name: [row.name],
                description: [row.description],
                companyId: row.companyId
            });
            this.productTypeId = row.productTypeId;
        });
    }
}
