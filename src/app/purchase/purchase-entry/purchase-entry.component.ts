import swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PurchaseService } from "src/app/core/services/purchase.service";
import { LoadingService } from "src/app/core/services/loading.service";

@Component({
    selector: "app-purchase-entry",
    templateUrl: "./purchase-entry.component.html"
})
export class PurchaseEntryComponent implements OnInit {
    formTitle: string = "Add New Purchase";
    form: FormGroup;
    detailForm: FormGroup;
    lpoDetails: any[] = [];
    displaySearchModal: boolean = false;
    plpoid: any;
    searchResults: any[];
    filteredSearchResults: any[] = [];

    constructor(
        private purchaseService: PurchaseService,
        private router: Router,
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            plpoid: 0,
            name: ["", Validators.required],
            address: ["", Validators.required],
            supplierId: 0,
            paymentTerms: ["", Validators.required],
            tax: ["", Validators.required],
            total: ["", Validators.required],
            deliveryDate: [""],
            lponumber: [""]
        });
        this.detailForm = this.fb.group({
            plpodetailsId: 0,
            sno: 0,
            description: ["", Validators.required],
          quantity: ["", Validators.required],
            unitPrice: ["", Validators.required],
            subTotal: ["", Validators.required],
            plpoid: 0
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.plpoid = params["editpurchaseinfo"];
            if (this.plpoid != null || this.plpoid != undefined) {
                this.editPurchase(this.plpoid);
            }
        });
        this.getSupplier();
    }

    goBack() {
        this.router.navigate(["/purchase/purchase-list"]);
    }

    getSupplier() {
        this.loadingService.show();
        this.purchaseService.getSuppliers().subscribe(data => {
            this.loadingService.hide();
            if (data != null) {
                this.searchResults = data["result"];
                this.filteredSearchResults = this.searchResults;
            }
        });
    }

    deleteDetail(row) {
        var index = this.lpoDetails.indexOf(row);
        if (index !== -1) {
            this.lpoDetails.splice(index, 1);
        }
        this.calculateTotal();
    }

    addToList(formObj) {
        let obj = formObj.value;
        let detail = {
            plpodetailsId: 0,
            sno: 0,
            description: obj.description,
          quantity: obj.quantity,
            unitPrice: obj.unitPrice,
            subTotal: obj.subTotal,
            plpoid: 0
        };
        this.lpoDetails.push(detail);
        this.calculateTotal();
        this.detailForm.reset();
    }

    calculateSubTotal(unitprice) {
        const quantity = this.detailForm.value.quantity;
        if (quantity != undefined) {
            let subtotal = Number(quantity) * Number(unitprice);
            this.detailForm.get("subTotal").setValue(subtotal);
        }
    }
    calculateTotal() {
        let total = 0;
        this.lpoDetails.forEach(obj => {
            total = total + obj.subTotal;
        });
        this.form.get("total").setValue(total);
    }
    openSearchBox() {
        this.displaySearchModal = true;
    }
    pickSearchedData(data) {
        this.form.controls["name"].setValue(data.supplierName);
        this.form.controls["address"].setValue(data.address);
        this.form.controls["supplierId"].setValue(data.supplierId);

        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        let filterBy = searchString ? searchString.toLocaleLowerCase() : null;
        this.filteredSearchResults = this.searchResults.filter(
            (item: any) =>
                item.supplierName.toLocaleLowerCase().indexOf(filterBy) !== -1
        );
    }

    editPurchase(plpoid) {
        this.formTitle = "Edit Purchase Information";
        this.loadingService.show();
        this.purchaseService.getSinglePurchase(plpoid).subscribe(data => {
            this.loadingService.hide();
            let row = data["result"];
            this.lpoDetails = row.purchasedetails;
            this.form = this.fb.group({
                plpoid: row.plpoid,
                name: row.name,
                address: row.address,
                supplierId: row.supplierId,
                paymentTerms: row.paymentTerms,
                tax: row.tax,
                total: row.total,
                deliveryDate: row.deliveryDate,
                lponumber: row.lponumber
            });
        });
    }

    submitPurchaseInfo(formObj) {
        this.loadingService.show();
        let obj = formObj.value;

        let body = {
            plpoid: obj.plpoid,
            name: obj.name,
            address: obj.address,
            supplierId: obj.supplierId,
            paymentTerms: obj.paymentTerms,
            tax: obj.tax,
            total: obj.total,
            deliveryDate: "",
            lponumber: "",
            purchasedetails: this.lpoDetails
        };
        this.purchaseService.updatePurchase(body).subscribe(
            data => {
                this.loadingService.hide();
                if (data["success"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/purchase/purchase-list"]);
                } else {
                    swal.fire("GOS FINANCIAL", data["message"], "error");
                }
            },
            err => {
                this.loadingService.hide();
                swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
            }
        );
    }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = '' + d.getFullYear();

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
  }
}
