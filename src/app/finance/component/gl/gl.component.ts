import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GLService } from "src/app/core/services/gl.service";
import { CompanyService } from "src/app/core/services/company.service";

@Component({
    selector: "app-gl",
    templateUrl: "./gl.component.html"
})
export class GLComponent implements OnInit {
    companyInformation: any[] = [];
    form: FormGroup;
    formTitle: string = "Add GL Information";
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private glService: GLService,
        private companyService: CompanyService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.form = this.fb.group({
            glId: [0],
            glCode: ["", Validators.required],
            glName: ["", Validators.required],
            companyId: [0],
            // glClassId:["", Validators.required],
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let glId = params["editgl"];
            if (glId != null || glId != undefined) {
                this.editGL(glId);
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

    editGL(glId) {
        this.formTitle = "Edit GL Information";
        this.loadingService.show();
        this.glService.getGL(glId).subscribe(data => {
            this.loadingService.hide();
            let row = data.gls[0];
            this.form = this.fb.group({
                glId: row.glId,
                glCode: row.glCode,
                glName: row.glName,
                companyId:row.companyId,
                glClassId:row.glClassId,
            });
        });
    }

    goBack() {
        this.router.navigate(["/finance/gl-list"]);
    }
    submitGLInfo(formObj) {
      const payload = formObj.value;
      // payload.glClassId = parseInt(payload.glClassId);
      // payload.companyId = parseInt(payload.companyId);
        this.loadingService.show();
        this.glService.updateGL(payload).subscribe(
            data => {
                const message = data.status.message.friendlyMessage;
                if (data.status.isSuccessful) {
                    swal.fire("GOS FINANCIAL", message, "success").then(() => {
                      this.router.navigate(["/finance/gl-list"]);
                    });
                } else {
                    swal.fire("GOS FINANCIAL", message, "error");
                }
              this.loadingService.hide();
            },
            err => {
                this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
                swal.fire("GOS FINANCIAL", message, "error");
            }
        );
    }
}
