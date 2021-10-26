import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ApprovalLevelStaffService } from "src/app/core/services/approvallevelstaff.service";
import { ApprovalLevelService } from "src/app/core/services/approvallevel.service";
import { UserAccountService } from "src/app/core/services/user.service";

@Component({
    selector: "app-approvallevelstaff",
    templateUrl: "./approvallevelstaff.component.html"
})
export class ApprovalLevelStaffComponent implements OnInit {
    form: FormGroup;
    formTitle: string = "Add ApprovalLevelStaff Information";
    approvalLevelList: any[];
    staffList: any[];
    checkIsActive: boolean = true;
    allPositions = [
        { id: "1", name: "Position 1" },
        { id: "2", name: "Position 2" },
        { id: "3", name: "Position 3" },
        { id: "4", name: "Position 4" },
        { id: "5", name: "Position 5" },
        { id: "6", name: "Position 6" },
        { id: "7", name: "Position 7" },
        { id: "8", name: "Position 8" },
        { id: "9", name: "Position 9" },
        { id: "10", name: "Position 10" }
    ];
    positions: any[] = [];
    approvalStaff: any[] = [];
    constructor(
        public fb: FormBuilder,
        private loadingService: LoadingService,
        private approvalLevelStaffService: ApprovalLevelStaffService,
        private approvalLevelService: ApprovalLevelService,
        private staffService: UserAccountService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.initializeControl();
        this.route.queryParams.subscribe(params => {
            let approvalLevelStaffId = params["editapprovalLevelStaff"];
            if (
                approvalLevelStaffId != null ||
                approvalLevelStaffId != undefined
            ) {
                this.editApprovalLevelStaff(approvalLevelStaffId);
            }
        });
        this.getAllApprovalLevelStaff();
        this.getAllApprovalLevel();
        this.getAllStaff();
    }

    initializeControl() {
        this.form = this.fb.group({
            approvalLevelStaffId: [0],
            staffId: ["", Validators.required],
            position: ["", Validators.required],
            approvalLevelId: ["", Validators.required],
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

    getAllApprovalLevel() {
        this.loadingService.show();
        this.approvalLevelService.getAllApprovalLevel().subscribe(data => {
            this.loadingService.hide();
            this.approvalLevelList = data["result"];
        });
    }

    getAllStaff() {
        this.loadingService.show();
        this.staffService.getStaffList().subscribe(data => {
            this.loadingService.hide();
            this.staffList = data["result"];
        });
    }
    getAllApprovalLevelStaff() {
        this.loadingService.show();
        this.approvalLevelStaffService
            .getAllApprovalLevelStaff()
            .subscribe(data => {
                this.loadingService.hide();
                this.approvalStaff = data["result"];
            });
    }
    onApprovalLevelChanged(value) {
        let staffs = this.approvalStaff.filter(x => x.approvalLevelId == value);
        if (staffs != undefined || staffs != null) {
            this.filterPositions(staffs);
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
    editApprovalLevelStaff(approvalLevelStaffId) {
        this.formTitle = "Edit ApprovalLevelStaff Information";
        this.positions = this.allPositions;
        this.loadingService.show();
        this.approvalLevelStaffService
            .getApprovalLevelStaff(approvalLevelStaffId)
            .subscribe(data => {
                this.loadingService.hide();
                let row = data["result"];
                this.form = this.fb.group({
                    approvalLevelStaffId: row.approvalLevelStaffId,
                    staffId: row.staffId,
                    approvalLevelId: row.approvalLevelId,
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
        this.router.navigate(["/approval/approvallevelstaff-list"]);
    }
    submitApprovalLevelStaffInfo(formObj) {
        this.loadingService.show();
        this.approvalLevelStaffService
            .updateApprovalLevelStaff(formObj.value)
            .subscribe(
                data => {
                    this.loadingService.hide();
                    if (data["result"] == true) {
                        swal.fire("GOS FINANCIAL", data["message"], "success");
                        this.router.navigate([
                            "/approval/approvallevelstaff-list"
                        ]);
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
