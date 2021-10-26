import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CompanyService } from "src/app/core/services/company.service";
import { GLTransactionService } from "src/app/core/services/gltransaction.service";
import { DatePipe, DecimalPipe } from "@angular/common";

@Component({
    selector: "app-gltransaction",
    templateUrl: "./gltransaction.component.html"
})
export class GLTransactionComponent implements OnInit {
    companyInformation: any[] = [];
    form: FormGroup;
    formTitle: string = "GL Transaction";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private glTransactionService: GLTransactionService,
        private companyService: CompanyService,
        private pipe: DatePipe,
        private number: DecimalPipe  ,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            transactionId: [0],
            subGLFSLineCaption: ["", Validators.required],
            subGLNoteLine: ["", Validators.required],
            companyId: ["", Validators.required],
            batchCode: ["", Validators.required],
            sourceReferenceNumber: ["", Validators.required],
            operationName: ["", Validators.required],
            description: ["", Validators.required],
            debitAmount: ["", Validators.required],
            creditAmount: ["", Validators.required],
            valueDate: ["", Validators.required],
            postedDateTime: ["", Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let transactionId = params["editgltransaction"];
            if (transactionId != null || transactionId != undefined) {
                this.editGLTransaction(transactionId);
            }
        });
        this.getAllCompany();
    }

    getAllCompany() {
        this.loadingService.show();
        this.companyService.getAllCompanyStructure().subscribe(data => {
            this.loadingService.hide();
            this.companyInformation = data.companyStructures;


        }, err => {
          this.loadingService.hide()
        });
    }

    editGLTransaction(transactionId) {
        this.formTitle = "GLTransaction Information";
        this.loadingService.show();
        this.glTransactionService.getGLTransaction(transactionId).subscribe(data => {
            this.loadingService.hide();
            let row = data.gLtransaction;
            this.form = this.fb.group({
                transactionId: row.transactionId,
                subGLFSLineCaption: row.subGLFSLineCaption,
                subGLNoteLine: row.subGLNoteLine,
                companyId:row.companyId,
                batchCode:row.batchCode,
                sourceReferenceNumber:row.sourceReferenceNumber,
                operationName:row.operationName,
                description:row.description,
                debitAmount:this.number.transform(row.debitAmount,'1.2-2'),
                creditAmount:this.number.transform(row.creditAmount,'1.2-2'),
                valueDate: this.pipe.transform(row.valueDate, "dd-MM-yyyy"),
                postedDateTime:this.pipe.transform(row.postedDateTime, "dd-MM-yyyy"),
                // this.myFormattedDate  = this.pipe.transform(this.nextCurrentDate, "dd-MM-yyyy");
            });
        });
    }

    goBack() {
        this.router.navigate(["/finance/gltransaction-list"]);
    }
}
