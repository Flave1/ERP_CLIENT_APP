import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { JournalService } from "../../../../core/services/journal.service";
import { LoadingService } from "src/app/core/services/loading.service";

@Component({
  selector: "app-Journal-approval",
  templateUrl: "./Journal-approval.component.html",
  styleUrls: ["./Journal-approval.component.css"]
})
export class JournalApprovalComponent implements OnInit {
  approvalStatus: any[];
  selectedApprovalData: any = {};
  journalAwaitingApproval: any[];
  displayApproval: boolean = false;
  viewHeight: any = "600px";
  journalEntries: any[];
  creditAmount: any;
  debitAmount: any;
  activeIndex: number = 0;
  tabSelected: boolean;
  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private journalService: JournalService
  ) {}

  ngOnInit() {
    this.getJournalsAwaitingApproval();
  }
  viewApprovalDetails(row) {
    this.selectedApprovalData = row;
    this.getAllSubmitJournals(row.transactionReference);
    this.tabSelected = true;
    this.activeIndex = 1;
  }
  getJournalsAwaitingApproval() {
    this.loadingService.show();
    this.journalService.getJournalsAwaitingApproval().subscribe(
      data => {
        this.loadingService.hide();
        this.journalAwaitingApproval = data.journalEntry;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getAllJournalEntries() {
    this.loadingService.show();
    this.journalService.getAllJournals().subscribe(
      data => {
        this.loadingService.hide();
        this.journalEntries = data.journalEntry;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  getAllSubmitJournals(tref) {
    this.loadingService.show();
    this.journalService.getAllSubmitJournals(tref).subscribe(data => {
      this.loadingService.hide();
      this.journalEntries = data.totalJournal.journal;
      this.debitAmount = data.totalJournal.totalDebit;
      this.creditAmount = data.totalJournal.totalCredit;
    });
  }
  submitApproval(formObj) {
    let body = {
      targetId: parseInt(formObj.transactionReference),
      approvalStatusId: parseInt(formObj.approvalStatusId),
      comment: formObj.comment
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to approve this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.journalService.goForApproval(body).subscribe(data => {
            __this.loadingService.hide();
            if (data.status.isSuccessful) {
              swal.fire(
                "GOS FINANCIAL",
                data.status.message.friendlyMessage,
                "success"
              );
              __this.displayApproval = false;
              __this.getJournalsAwaitingApproval();
              this.activeIndex = 0;
            } else {
              swal.fire(
                "GOS FINANCIAL",
                data.status.message.friendlyMessage,
                "error"
              );
            }
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }
  tabChange(event: any) {
    this.activeIndex = event.index;
  }

  close() {
    this.activeIndex = 0;
  }
}
