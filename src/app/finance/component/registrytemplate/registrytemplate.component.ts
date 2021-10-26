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
    selector: "app-registrytemplate",
    templateUrl: "./registrytemplate.component.html"
})
export class RegistryTemplateComponent implements OnInit {
    accountTypeInformation: any[] = [];
    statementTypeInformation: any[] = [];
    IndustryInformation: any[] = [];
    registryTemplateInformation: any[] = [];
    subGLInformation: any[] = [];
    checkedIsTotalLine: boolean = false;
    form: FormGroup;
    formTitle: string = "Add Registry Template Information";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private registryTemplateService: RegistryService,
        private accounttypeService: AccountTypeService,
        private statementTypeService: StatementTypeService,
        private subGLService: SubGLService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            registryId: [0],
            industry: ["", Validators.required],
            fsLine: ["", Validators.required],
            statementTypeId: ["", Validators.required],
            fslineCaption: ["", Validators.required],
            subCaption: [""],
            parentCaption: [""],
            accountTypeId: ["", Validators.required],
            position: [""],
            subLedger: [""],
            noteLine:[""],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let registryTemplateId = params["editregistrytemplate"];
            if (registryTemplateId != null || registryTemplateId != undefined) {
                this.editRegistryTemplate(registryTemplateId);
            }
        });
        this.getAllAccountType();
        this.getAllStatementType();
        this.getAllSubGL();
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

    editRegistryTemplate(registryTemplateId) {
        this.formTitle = "Edit Registry Template Information";
        this.loadingService.show();
        this.registryTemplateService.getRegistryTemplate(registryTemplateId).subscribe(data => {
            this.loadingService.hide();
            let row = data.registryTemplates[0];
            this.form = this.fb.group({
                registryId: row.registryId,
                industry: row.industry,
                fsLine: row.fsLine,
                statementTypeId: row.statementTypeId,
                fslineCaption: row.fslineCaption,
                subCaption: row.subCaption,
                parentCaption: row.parentCaption,
                accountTypeId: row.accountTypeId,
                position: row.position,
                subLedger: row.subLedger,
                noteLine: row.noteLine,
            });
        }, err => {
          this.loadingService.hide();
        });
    }

    goBack() {
        this.router.navigate(["/finance/registrytemplate-list"]);
    }
    submitRegistryTemplateInfo(formObj) {
        var payload = formObj.value;
        payload.accountTypeId = parseInt(payload.accountTypeId);
        payload.statementTypeId = parseInt(payload.statementTypeId);
        this.loadingService.show();
        this.registryTemplateService.updateRegistryTemplate(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate(["/finance/registrytemplate-list"]);
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
