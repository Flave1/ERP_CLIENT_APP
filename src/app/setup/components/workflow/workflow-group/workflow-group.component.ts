import { WorkflowService } from './../../../../core/services/workflow.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/core/services/loading.service';
import { CompanyService } from 'src/app/core/services/company.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-workflow-group',
  templateUrl: './workflow-group.component.html',
})
export class WorkflowGroupComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Add Workflow Group";
  companyList: any[];
  accessLevelList: any[];
  accessLevels: SelectItem[];
  accessList: any[];
  constructor(
      public fb: FormBuilder,
      private loadingService: LoadingService,
      private workflowService: WorkflowService,
      private companyService: CompanyService,
      private router: Router,
      private route: ActivatedRoute
  ) {
      this.form = this.fb.group({
        workflowGroupId: [0],
        workflowGroupName: ["", Validators.required],
      });
  }

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
          let workflowGroupId = params["editworkflowgroup"];
          if (workflowGroupId != null || workflowGroupId != undefined) {
              this.editWorkflowGroup(workflowGroupId);
          }
      });
      this. getAllAccess();
  }


  getAllAccess() {
      this.loadingService.show();
      this.companyService.getAllCompanyStructureDefinition().subscribe(data => {
        this.loadingService.hide();
        this.accessList = data["result"];
    });
  }
  onAccessChanged(value){
    if(value !=null){
    this.loadingService.show();
    this.companyService.getCompanyStructureByAccessId(value).subscribe(data => {
        this.loadingService.hide();
        this.accessLevelList = data["result"];
        this.accessLevels = [];
        if (this.accessLevelList !== undefined) {
            this.accessLevelList.forEach(el => {
                this.accessLevels.push({label: el.name, value: el.companyStructureId});
            });
       }

    });
  }
}
  editWorkflowGroup(workflowGroupId) {
      this.formTitle = "Edit Workflow Group";
      this.loadingService.show();
      this.workflowService.getSingleWorkflowGroup(workflowGroupId).subscribe(data => {
          this.loadingService.hide();
          let row = data["workflowGroups"][0];
          this.form = this.fb.group({
            workflowGroupId: [row.workflowGroupId],
            workflowGroupName: [row.workflowGroupName, Validators.required],
          });
          this.onAccessChanged(row.accessId)
      }, err => {
        this.loadingService.hide()
      });
  }

  goBack() {
      this.router.navigate(["/setup/workflow-group-list"]);
  }
  submitWorkflowGroup(formObj) {
      this.loadingService.show();
      this.workflowService.addUpdateWorkflowGroup(formObj.value).subscribe(
          data => {
              this.loadingService.hide();
              let message = data.status.message.friendlyMessage;
                  swal.fire("GOS FINANCIAL", message, "success");
                  this.router.navigate(["/setup/workflow-group-list"]);

          },
          err => {
              this.loadingService.hide();
              swal.fire("GOS FINANCIAL", JSON.stringify(err), "error");
          }
      );
  }

}
