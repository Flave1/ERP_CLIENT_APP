import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SubGLService } from "src/app/core/services/subgl.service";
import { GLService } from "src/app/core/services/gl.service";
import { CompanyService } from "src/app/core/services/company.service";
import {RegistryService} from '../../../core/services/registry';


@Component({
    selector: "app-subGL",
    templateUrl: "./subgl.component.html"
})
export class SubGLComponent implements OnInit {
    glInformation: any[] = [];
    companyInformation: any[] = [];
    form: FormGroup;
    formTitle: string = "Add SubGL Information";
    registryInformation: any[];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private subGLService: SubGLService,
        private companyService: CompanyService,
        private glService: GLService,
        private router: Router,
        private route: ActivatedRoute,
        private registryService: RegistryService
    ) {
        this.form = this.fb.group({
            subGLId: [0],
            subGLCode: ["", Validators.required],
            subGLName: ["", Validators.required],
            glId: [0, Validators.required],
            noteLine: [""],
            fsLineCaption: [""],
          companyStructureId: [""],
            glClassId:["", Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let subGLId = params["editsubGL"];
            if (subGLId != null || subGLId != undefined) {
                this.editSubGL(subGLId);
            }
        });
        this.getAllGL();
        this.getAllCompany();
        this.getAllRegistry()
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
    getAllRegistry() {
        this.registryService.getAllRegistry().subscribe(data => {
            this.loadingService.hide();
            this.registryInformation = data.registry;
        }, err => {
            this.loadingService.hide()
        });
    }
    getAllGL() {
        this.loadingService.show();
        this.glService.getAllGL().subscribe(data => {
            this.loadingService.hide().then(() => {
              this.glInformation = data.gls;
            });
        }, err => {
            this.loadingService.hide()
        });
    }


    getGLByCompany(companyId) {
        this.loadingService.show();
        this.glService.getGLByCompany(companyId).subscribe(data => {
            this.loadingService.hide();
            this.glInformation = data["result"];

        });
    }

    editSubGL(subGLId) {
        this.formTitle = "Edit SubGL Information";
        this.loadingService.show();
        this.subGLService.getSubGL(subGLId).subscribe(data => {
            this.loadingService.hide();
            let row = data.subGls[0];
            this.form = this.fb.group({
                subGLId: row.subGLId,
                subGLCode: row.subGLCode,
                subGLName: row.subGLName,
                glId: row.glId,
                noteLine: row.noteLine,
                fsLineCaption: row.fsLineCaption,
              companyStructureId: row.companyStructureId,
                glClassId:row.glClassId,
            });

        }, err => {
            this.loadingService.hide();
        });
    }

    goBack() {
        this.router.navigate(["/finance/subGL-list"]);
    }
    submitSubGLInfo(formObj) {
      const payload = formObj.value;
      payload.glId = parseInt(payload.glId);
      payload.glClassId = parseInt(payload.glClassId);
      payload.companyStructureId = parseInt(payload.companyStructureId);
        this.loadingService.show();
        this.subGLService.updateSubGL(payload).subscribe(
            data => {
                this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success");
                    this.router.navigate(["/finance/subGL-list"]);
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
