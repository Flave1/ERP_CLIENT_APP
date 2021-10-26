import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PurchaseService } from "src/app/core/services/purchase.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/core/services/loading.service";
import { SupplierService } from "../../core/services/supplier.service";
import { SelectItem } from "primeng/api";
import {CompanyService} from "../../core/services/company.service";
import {JwtService} from "../../core/services/jwt.service";

@Component({
  selector: "app-puchase-requisition-entry",
  templateUrl: "./puchase-requisition-entry.component.html"
})
export class PuchaseRequisitionEntryComponent implements OnInit {
  index: number = null;
  formTitle: string = "Add New Purchase Requisition Note";
  form: FormGroup;
  detailForm: FormGroup;
  prnDetails: any[] = [];
  displaySearchModal: boolean = false;
  purchaseReqNoteId: any;
  searchResults: any[];
  filteredSearchResults: any[] = [];
  selectedSuppliers: SelectItem[];
  departments: any[] = [];
  user: any;
  constructor(
    private purchaseService: PurchaseService,
    private router: Router,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private companyService: CompanyService,
    private jwtService: JwtService
  ) {
    this.form = this.fb.group({
      purchaseReqNoteId: 0,
      requestBy: ["", Validators.required],
      departmentId: [""],
      documentNumber: [""],
      description: ["", Validators.required],
      isBudgeted: [false],
      isFundAvailable: [false],
      deliveryLocation: ["", Validators.required],
      total: ["", Validators.required],
      expectedDeliveryDate: [""]
    });
    this.detailForm = this.fb.group({
      prndetailsId: 0,
      sno: 0,
      description: ["", Validators.required],
      noOfItems: ["", Validators.required],
      unitPrice: ["", Validators.required],
      subTotal: ["", Validators.required],
      purchaseReqNoteId: 0,
      suggestedSupplierId: [[]],
      comment: [""],
      isBudgeted: [false]
    });
  }

  ngOnInit() {
    this.user = this.jwtService.getUserDetails();
    const userName = this.user.staffName;
    const departmentId = this.user.departmentId;
    this.form.patchValue({
      requestBy: userName,
      departmentId: departmentId
    });
    this.route.queryParams.subscribe(params => {
      this.purchaseReqNoteId = params["editrequisitioninfo"];
      if (
        this.purchaseReqNoteId != null ||
        this.purchaseReqNoteId != undefined
      ) {
        this.editPurchase(this.purchaseReqNoteId);
      }
    });
    this.getSupplier();
    this.getDepartment()
  }

  getDepartment() {
    this.loadingService.show();
    this.companyService.getAllCompanyStructure().subscribe(data => {
      this.loadingService.hide()
      this.departments = data.companyStructures;
    }, err => {
      this.loadingService.hide();
    });
  }
  goBack() {
    this.router.navigate(["/purchases-and-supplier/requisition-list"]);
  }

  getSupplier() {
    this.loadingService.show();
    this.supplierService.getApprovedSuppliers().subscribe(
      data => {
        this.loadingService.hide();
        if (data != null) {
          this.searchResults = data.suppliers;
          if (this.searchResults != undefined) {
            this.selectedSuppliers = [];
            this.searchResults.forEach(el => {
              this.selectedSuppliers.push({
                label: el.name,
                value: el.supplierId
              });
            });
          }
          this.filteredSearchResults = this.searchResults;
        }
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  deleteDetail(row) {
    const index = this.prnDetails.indexOf(row);
    if (index !== -1) {
      this.prnDetails.splice(index, 1);
    }
    this.calculateTotal();
  }

  addToList(formObj) {
    let obj = formObj.value;
    if (!obj.suggestedSupplierId) {
      return swal.fire(`GOS FINANCIAL`, 'Selected supplier(s)', 'error');
    }
    if (!obj.description) {
      return swal.fire(`GOS FINANCIAL`, 'Description is required', 'error')
    }
    if (!obj.noOfItems) {
      return swal.fire(`GOS FINANCIAL`, 'Quantity is required', 'error')
    }
    if (!obj.unitPrice) {
      return swal.fire(`GOS FINANCIAL`, 'Unit price is required', 'error')
    }
    if (isNaN(obj.unitPrice)) {
      return swal.fire(`GOS FINANCIAL`, 'Unit price should be a number', 'error')
    }
    let detail = {
      prndetailsId: 0,
      sno: 0,
      description: obj.description,
      quantity: parseInt(obj.noOfItems),
      unitPrice: parseFloat(obj.unitPrice),
      subTotal: parseFloat(obj.subTotal),
      purchaseReqNoteId: 0,
      suggestedSupplierId: obj.suggestedSupplierId,
      comment: obj.comment
    };
    if (this.index !== null) {
      this.prnDetails = this.prnDetails.map((item, index) => {
        if (index == this.index) {
          return detail
        }
        return item
      })
    } else {
      this.prnDetails.push(detail);
    }
    this.index = null;
    this.calculateTotal();
    formObj.reset()
    // this.detailForm.reset();
  }

  calculateSubTotal(unitprice) {
    const quantity = this.detailForm.value.noOfItems;
    if (quantity != undefined) {
      let subtotal = Number(quantity) * Number(unitprice);
      this.detailForm.get("subTotal").setValue(subtotal);
    }
  }
  calculateSubTotal2(qty) {
    const unitPrice = this.detailForm.value.unitPrice;
    if (unitPrice != undefined) {
      let subtotal = Number(qty) * Number(unitPrice);
      this.detailForm.get("subTotal").setValue(subtotal);
    }
  }
  calculateTotal() {
    let total = 0;
    this.prnDetails.forEach(obj => {
      total = total + obj.subTotal;
    });
    this.form.get("total").setValue(total);
  }
  openSearchBox() {
    this.displaySearchModal = true;
  }
  pickSearchedData(data) {
    this.detailForm.patchValue({
      suggestedSupplierId: data.supplierId
    });
    // this.detailForm.get["suggestedSupplierId"].setValue(data.supplierId);
    this.selectedSuppliers.push(data.supplierId);
    this.displaySearchModal = false;
  }

  searchDB(searchString) {
    searchString.preventDefault();
    let filterBy = searchString ? searchString.toLocaleLowerCase() : null;
    this.filteredSearchResults = this.searchResults.filter(
      (item: any) =>
        item.supplierName.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }

  editPurchase(purchaseReqNoteId) {
    this.formTitle = "Edit Purchase Requisition Note";
    this.loadingService.show();
    this.purchaseService.getSinglePurchasePRN(purchaseReqNoteId).subscribe(
      data => {
        this.loadingService.hide();
        let row = data.requisitionNotes[0];
        this.prnDetails = row.prnDetails;
        const prnData = this.prnDetails[0];
        this.form = this.fb.group({
          purchaseReqNoteId: row.purchaseReqNoteId,
          requestBy: [row.requestBy],
          departmentId: [row.departmentId],
          documentNumber: [row.documentNumber],
          description: [row.description],
          isBudgeted: [row.isBudgeted],
          isFundAvailable: [row.isFundAvailable],
          deliveryLocation: [row.deliveryLocation],
          suggestedSupplierId: [row.suggestedSupplierId],
          total: [row.total],
          expectedDeliveryDate: [new Date(row.expectedDeliveryDate)]
        });
        this.detailForm = this.fb.group({
          prndetailsId: prnData.prnDetailsId,
          sno: prnData.sno,
          description: [prnData.description],
          noOfItems: [prnData.quantity],
          unitPrice: prnData.unitPrice,
          subTotal: prnData.subTotal,
          purchaseReqNoteId: prnData.purchaseReqNoteId,
          suggestedSupplierId: [[prnData.suggestedSupplierId]],
          comment: prnData.comment,
          isBudgeted:prnData.isBudgeted
        });
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  submitPurchaseInfo(formObj) {

    let obj = formObj.value;

    let body = {
      purchaseReqNoteId: parseInt(obj.purchaseReqNoteId),
      requestBy: obj.requestBy,
      departmentId: parseInt(obj.departmentId),
      documentNumber: obj.documentNumber,
      description: obj.description,
      isBudgeted: obj.isBudgeted,
      isFundAvailable: obj.isFundAvailable,
      deliveryLocation: obj.deliveryLocation,
      total: parseFloat(obj.total),
      expectedDeliveryDate: this.formatDate(obj.expectedDeliveryDate),
      prnDetails: this.prnDetails
    };
    let date = this.formatDate(new Date());
   if (body.expectedDeliveryDate < date) {

     return swal.fire('GOS FINANCIAL', 'Expected delivery date cannot be less than today', 'error')
   }
   this.loadingService.show()
    this.purchaseService.updatePurchasePRN(body).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/purchases-and-supplier/requisition-list"]);
        } else {
          swal.fire("GOS FINANCIAL", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOS FINANCIAL", message, "error");
      }
    );
  }

  editDetail(x, i) {
    this.detailForm = this.fb.group({
      prndetailsId: x.prndetailsId,
      sno: x.sno,
      description: [x.description],
      noOfItems: [x.quantity],
      unitPrice: [x.unitPrice],
      subTotal: [x.subTotal],
      purchaseReqNoteId: x.purchaseReqNoteId,
      suggestedSupplierId: [x.suggestedSupplierId],
      comment: [x.comment],
      isBudgeted: x.isBudgeted
    });
    this.index = i;
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
