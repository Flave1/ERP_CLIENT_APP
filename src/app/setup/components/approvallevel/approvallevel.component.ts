import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
// import { ApprovalGroupService } from "src/app/core/services/approvalGroup.service";
import { ApprovalLevelService } from "src/app/core/services/approvallevel.service";
import {ApprovalGroupService} from '../../../core/services/approvalgroup.service';

@Component({
    selector: "app-approvallevel",
    templateUrl: "./approvallevel.component.html"
})
export class ApprovalLevelComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add ApprovalLevel Information";
    approvalGroupList: any[];
    checkIsActive: boolean = true;
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
    allApprovalLevel: any[] = [];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private approvalLevelService: ApprovalLevelService,
        private approvalGroupService: ApprovalGroupService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.initializeControl();
        this.route.queryParams.subscribe(params => {
            let approvalLevelId = params["editapprovalLevel"];
            if (approvalLevelId != null || approvalLevelId != undefined) {
                this.editApprovalLevel(approvalLevelId);
            }
        });
        this.getAllApprovalGroup();
        this.getAllApprovalLevel();
    }

    initializeControl() {
        this.form = this.fb.group({
            approvalLevelId: [0],
            approvalLevelName: ["", Validators.required],
            position: ["", Validators.required],
            approvalGroupId: ["", Validators.required],
            isActive: true,
            maximumAmount: [""],
            canViewDocument: [false, Validators.required],
            canViewApproval: [false, Validators.required],
            canApprove: [false, Validators.required],
            canUpload: [false, Validators.required],
            canEdit: [false, Validators.required],
            canReceiveEmail: [false, Validators.required],
            canRecieveSMS: [false, Validators.required],
            canEscalate: [false, Validators.required]
        });
    }

    getAllApprovalGroup() {
        this.loadingService.show();
        this.approvalGroupService.getAllApprovalGroup().subscribe(data => {
            this.loadingService.hide();
            this.approvalGroupList = data["result"];
        });
    }
    getAllApprovalLevel() {
        this.loadingService.show();
        this.approvalLevelService.getAllApprovalLevel().subscribe(data => {
            this.loadingService.hide();
            this.allApprovalLevel = data["result"];
        });
    }
    onApprovalLevelChange(value) {
        let levels = this.allApprovalLevel.filter(
            x => x.approvalGroupId == value
        );
        if (levels != undefined || levels != null) {
            this.filterPositions(levels);
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

    editApprovalLevel(approvalLevelId) {
        this.formTitle = "Edit ApprovalLevel Information";
        this.positions = this.allPositions;
        this.loadingService.show();
        this.approvalLevelService
            .getApprovalLevel(approvalLevelId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data["result"];
                this.form = this.fb.group({
                    approvalLevelId: row.approvalLevelId,
                    approvalLevelName: row.approvalLevelName,
                    approvalGroupId: row.approvalGroupId,
                    position: row.position,
                    isActive: row.isActive,
                    maximumAmount: row.maximumAmount,
                    canViewDocument: [row.canViewDocument, Validators.required],
                    canViewApproval: [row.canViewApproval, Validators.required],
                    canApprove: [row.canApprove, Validators.required],
                    canUpload: [row.canUpload, Validators.required],
                    canEdit: [row.canEdit, Validators.required],
                    canReceiveEmail: [row.canReceiveEmail, Validators.required],
                    canRecieveSMS: [row.canRecieveSMS, Validators.required],
                    canEscalate: [row.canEscalate, Validators.required]
                });
            });
    }

    goBack() {
        this.router.navigate(["/approval/approvallevel-list"]);
    }
    submitApprovalLevelInfo(formObj) {
        this.loadingService.show();
        this.approvalLevelService.updateApprovalLevel(formObj.value).subscribe(
            data => {
                this.loadingService.hide();
                if (data["result"] == true) {
                    swal.fire("GOS FINANCIAL", data["message"], "success");
                    this.router.navigate(["/approval/approvallevel-list"]);
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
