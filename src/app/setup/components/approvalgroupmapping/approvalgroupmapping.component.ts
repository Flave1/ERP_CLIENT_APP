import swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import {ApprovalGroupService} from '../../../core/services/approvalgroup.service';
// import { ApprovalGroupService } from "src/app/core/services/approvalGroup.service";

@Component({
    selector: "app-approvalgroupmapping",
    templateUrl: "./approvalgroupmapping.component.html"
})
export class ApprovalgroupmappingComponent implements OnInit {
    approvalForm: FormGroup;
    approvalWorkflowForm: FormGroup;
    operationTypes: any[];
    operations: any[];
    approvalWorkflowList: any[];
    displayWorkflow: boolean = false;
    displayAddNewWorkflow: boolean = false;
    filteredOperations: any[];
    operationId: any;
    approvalGroups: any[];
    positions: any[] = [];
    allPositions = [
        { id: "1", name: "Position 1" },
        { id: "2", name: "Position 2" },
        { id: "3", name: "Position 3" },
        { id: "4", name: "Position 4" },
        { id: "5", name: "Position 5" },
        { id: "6", name: "Position 6" },
        { id: "7", name: "Position 7" },
        { id: "8", name: "Position 8" },
        { id: "9", name: "Position 9" }
    ];

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private approvalGroupService: ApprovalGroupService
    ) {}

    ngOnInit() {
        this.operationControl();
        this.intialiseControl();
        this.getOperations();
        this.getOperationypes();
        this.getApprovalGroup();
    }
    operationControl() {
        this.approvalForm = this.fb.group({
            operationTypeId: [""],
            operationId: [""]
        });
    }
    intialiseControl() {
        this.approvalWorkflowForm = this.fb.group({
            approvalGroupMappingId: [0],
            operationId: [""],
            groupId: ["", Validators.required],
            position: ["", Validators.required],
            approvalStatusId: [0],
            createdBy: [""]
        });
    }
    getApprovalGroup() {
        this.approvalGroupService.getAllApprovalGroup().subscribe(data => {
            this.approvalGroups = data["result"];
        });
    }
    getOperations() {
        this.approvalGroupService.getOperations().subscribe(data => {
            this.operations = data["result"];
        });
    }

    getOperationypes() {
        this.approvalGroupService.getOperationTypes().subscribe(data => {
            this.operationTypes = data["result"];
        });
    }

    getApprovalWorkflow(operationId) {
        this.loadingService.show();
        this.approvalGroupService
            .getApprovalGroupMapping(operationId)
            .subscribe(data => {
                this.loadingService.hide();
                this.approvalWorkflowList = data["result"];
                this.filterPositions(this.approvalWorkflowList);
            });
    }

    onOperationTypeChanged(id) {
        this.filteredOperations = this.operations.filter(x => x.parentId == id);
    }

    onOperationChanged(id) {
        this.operationId = id;
        if (this.operationId > 0) {
            this.getApprovalWorkflow(this.operationId);
            this.displayWorkflow = true;
        } else {
            this.displayWorkflow = false;
        }
    }

    filterPositions(list: any[], filter: boolean = true) {
        this.positions = this.allPositions;
        if (filter) {
            list.forEach(element => {
                this.positions = this.positions.filter(
                    x => x.id != element.position
                );
            });
        }
    }

    showAddNewWorkflow() {
        this.intialiseControl();
        this.filterPositions(this.approvalWorkflowList);
        this.displayAddNewWorkflow = true;
    }
    editApprovalWorkflow(row) {
        this.approvalWorkflowForm.reset();
        this.approvalWorkflowForm = this.fb.group({
            approvalGroupMappingId: row.approvalGroupMappingId,
            operationId: [row.operationId, Validators.required],
            groupId: [row.groupId, Validators.required],
            position: [row.position, Validators.required],
            approvalStatusId: row.approvalStatusId,
            createdBy: row.createdBy
        });
        this.positions = this.allPositions;
        this.displayAddNewWorkflow = true;
    }
    deleteApprovalWorkflow(row) {
        const __this = this;
        swal.fire({
            title: "Are you sure you want to delete record?",
          text: "You won't be able to revert this",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!"
        }).then(result => {
            if (result.value) {
                __this.loadingService.show();

                __this.approvalGroupService
                    .deleteApprovalGroupMapping(row.approvalGroupMappingId)
                    .subscribe(data => {
                        __this.loadingService.hide();
                        if (data["result"] == true) {
                            swal.fire(
                                "GOS FINANCIAL",
                                "User deleted successful.",
                                "success"
                            );
                            __this.getApprovalWorkflow(row.operationId);
                        } else {
                            swal.fire(
                                "GOS FINANCIAL",
                                "Record not deleted",
                                "error"
                            );
                        }
                    });
            } else {
                swal.fire("GOS FINANCIAL", "Cancelled", "error");
            }
        });
    }
    submitApprovalWorkflow(formObj) {
        this.loadingService.show();
        let body = {
            approvalGroupMappingId: formObj.value.approvalGroupMappingId,
            operationId: this.operationId,
            groupId: formObj.value.groupId,
            position: formObj.value.position,
            approvalStatusId: formObj.value.approvalStatusId,
            createdBy: formObj.value.createdBy
        };
        this.approvalGroupService.updateApprovalGroupMapping(body).subscribe(
            data => {
                this.loadingService.hide();
                if (data["success"] == true) {
                    this.displayAddNewWorkflow = false;
                    this.approvalWorkflowForm.reset();
                    this.getApprovalWorkflow(this.operationId);
                    swal.fire("GOS FINANCIAL", data["message"], "success");
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
}
