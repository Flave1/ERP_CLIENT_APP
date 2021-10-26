import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { RegistryService } from "src/app/core/services/registry";
import { AccountTypeService } from "src/app/core/services/accounttype.service";
import { StatementTypeService } from "src/app/core/services/statementtype.service";
import { SubGLService } from "src/app/core/services/subgl.service";

@Component({
    selector: "app-registry",
    templateUrl: "./registry.component.html"
})
export class RegistryComponent implements OnInit {
    accountTypeInformation: any[] = [];
    statementTypeInformation: any[] = [];
    IndustryInformation: any[] = [];
    subGLInformation: any[] = [];
    checkedIsTotalLine: boolean = false;
    form: FormGroup;
    formTitle: string = "Add Registry Information";
    userDetails: any = JSON.parse(localStorage.getItem('userDetails'));
    industry: string = "";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private registryService: RegistryService,
        private accounttypeService: AccountTypeService,
        private statementTypeService: StatementTypeService,
        private subGLService: SubGLService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            registryId: [0],
            fsLine: ["", Validators.required],
            statementTypeId: ["", Validators.required],
            fsLineCaption: ["", Validators.required],
            subCaption: [""],
            parentCaption: [""],
            accountTypeId: ["", Validators.required],
            position: [""],
            subLedger: [""],
            noteLine: [""]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let registryId = params["editregistry"];
            if (registryId != null || registryId != undefined) {
                this.editRegistry(registryId);
            }
        });
        this.getAllAccountType();
        this.getAllStatementType();
        this.getAllSubGL();
        this.getIndustry()
    }

    getAllAccountType() {
        this.loadingService.show();
        this.accounttypeService.getAllAccountType().subscribe(data => {
            this.loadingService.hide();
            this.accountTypeInformation = data.accountTypes;


        }, err => {
          this.loadingService.hide()
        });
    }

    getAllStatementType() {
        this.loadingService.show();
        this.statementTypeService.getAllStatementType().subscribe(data => {
            this.loadingService.hide();
            this.statementTypeInformation = data.statementTypes;
        }, err => {
          this.loadingService.hide()
        });
    }

    getAllSubGL() {
        this.loadingService.show();
        this.subGLService.getAllSubGL().subscribe(data => {
            this.loadingService.hide();
            this.subGLInformation = data.subGls;
        });
    }
    getIndustry() {
        return this.registryService.getIndustry(this.userDetails.companyId).subscribe(data => {
            this.industry = data.result.registryTemplate;
        }, err => {

        })
    }
    editRegistry(registryId) {
        this.formTitle = "Edit Registry Information";
        this.loadingService.show();
        this.registryService.getRegistry(registryId).subscribe(data => {
            this.loadingService.hide();
            let row = data.registry[0];
            this.form = this.fb.group({
                registryId: row.registryId,
                industry: row.industry,
                fsLine: row.fsLine,
                statementTypeId: row.statementTypeId,
                fsLineCaption: row.fsLineCaption,
                subCaption: row.subCaption,
                parentCaption: row.parentCaption,
                accountTypeId: row.accountTypeId,
                position: row.position,
                subLedger: row.subLedger,
                noteLine: row.noteLine
            });
        }, err => {
          this.loadingService.hide()
        });
    }

    goBack() {
        this.router.navigate(["/finance/registry-list"]);
    }
    submitRegistryInfo(formObj) {
        this.loadingService.show();
        const payload = formObj.value;
        payload.industry = this.industry;
        payload.accountTypeId = parseInt(payload.accountTypeId);
        payload.statementTypeId = parseInt(payload.statementTypeId);
        payload.companyId = parseInt(payload.companyId);
        payload.position = parseInt(payload.position);
        this.registryService.updateRegistry(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate(["/finance/registry-list"]);
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
}
