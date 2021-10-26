import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { StatementTypeService } from "src/app/core/services/statementtype.service";
import { CompanyService } from "src/app/core/services/company.service";
import {SubGLService} from '../../../core/services/subgl.service';

@Component({
  selector: "app-statementtype",
  templateUrl: "./statementtype.component.html"
})
export class StatementTypeComponent implements OnInit {
  companyInformation: any[] = [];
  form: FormGroup;
  formTitle: string = "Statement Type Information";
  glArr: any[] = [];
  statementForm: string;
  valueSelected: boolean;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private statementTypeService: StatementTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private glService: SubGLService
  ) {
    this.form = this.fb.group({
      statementTypeId: [0],
      statementTypeName: ["", Validators.required],
      statementTypeAlias: ["", Validators.required],
      statementFormName: [""],
      yearEndGlName: [""],
      yearEndGl: [0],
      statementForm: []
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let statementTypeId = params["editstatementType"];
      if (statementTypeId != null || statementTypeId != undefined) {
        this.editStatementType(statementTypeId);
      }
    });
    this.getGL()
  }

  editStatementType(statementTypeId) {
    this.formTitle = " Statement Type Information";
    this.loadingService.show();
    this.statementTypeService
      .getStatementType(statementTypeId)
      .subscribe(data => {
        this.loadingService.hide();
        let row = data.statementTypes[0];
        this.form = this.fb.group({
          statementTypeId: row.statementTypeId,
          statementTypeName: row.statementTypeName,
          statementTypeAlias: row.statementTypeAlias,
          statementFormName: row.statementFormName,
          yearEndGlName: row.yearEndGlName,
          yearEndGl: row.yearEndGl,
          statementForm: row.statementForm
        });
        this.valueSelected = true;
        this.statementForm = this.form.get('statementForm').value;
      }, err => {
        this.loadingService.hide()
      });
  }

  goBack() {
    this.router.navigate(["/finance/statementtype-list"]);
  }
  submitStatementTypeInfo(formObj) {
    const payload = formObj.value;
    payload.yearEndGl = parseInt(payload.yearEndGl);
    payload.statementForm = parseInt(payload.statementForm);
    this.loadingService.show();
    this.statementTypeService.updateStatementType(payload).subscribe(
      data => {
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("GOS FINANCIAL", message, "success");
          this.router.navigate(["/finance/statementtype-list"]);
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
  getGL() {
    this.loadingService.show();
    return this.glService.getAllSubGL().subscribe(data => {
      this.loadingService.hide();
      this.glArr = data.subGls;
    }, err => {
      this.loadingService.hide()
    })
  }
  getStatementForm(event: any) {
    this.valueSelected = true;
    this.statementForm = this.form.get('statementForm').value;
  }
}
