import swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/core/services/loading.service";
import { Router } from "@angular/router";
import { CreditRiskScoreCardService } from "src/app/core/services/creditriskscorecard";
import { TreeNode } from "primeng/api";

@Component({
  selector: "app-creditriskscorecard-list",
  templateUrl: "./creditriskscorecard-list.component.html"
})
export class CreditRiskScoreCardListComponent implements OnInit {
  creditRiskScoreCardInformation: any[] = [];
  attributeInformation: any[] = [];
  selectedcreditRiskScoreCardInformation: any[];
  creditRiskScoreCardGrouped: TreeNode[];
  cols: any[];
  allCreditRiskScoreCard: any[] = [];
  checkAll: boolean;
  private selectedCreditRating: any;
  targetIds: any[] = [];
  targetIds_string: any[] = [];
  constructor(
    private loadingService: LoadingService,
    private creditRiskScoreCardService: CreditRiskScoreCardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cols = [
      {
        field: "creditRiskAttributeName",
        header: "creditRiskAttributeName"
      },
      { field: "customerTypeName", header: "customerTypeName" },
      { field: "value", header: "value" },
      { field: "score", header: "score" }
    ];
    this.getAllCreditRiskScoreCard();
    this.getGroupedAttribute();
  }

  showAddNew() {
    this.router.navigate(["/credit/creditriskscorecard-info"]);
  }

  getAllCreditRiskScoreCard() {
    this.loadingService.show();
    this.creditRiskScoreCardService.getAllCreditRiskScoreCard().subscribe(
      data => {
        this.loadingService.hide();
        this.creditRiskScoreCardInformation = data.creditRiskScoreCard;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }

  // getDistinctAttribute() {
  //     this.loadingService.show();
  //     this.creditRiskScoreCardService.getDistinctAttribute().subscribe(data => {
  //         this.loadingService.hide();
  //         this.attributeInformation = data["result"];
  //     });
  // }

  getGroupedAttribute() {
    this.loadingService.show();
    this.creditRiskScoreCardService.getAllGroupedAttribute().subscribe(
      data => {
        this.loadingService.hide();
        this.allCreditRiskScoreCard = data.groupedCreditRiskAttibute;
        this.creditRiskScoreCardGrouped = data.groupedCreditRiskAttibute;
      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  onCustomerTypeChange(value) {
    this.creditRiskScoreCardGrouped = this.allCreditRiskScoreCard.filter(
      x => x.data.customerTypeId == value
    );
  }
  editCreditRiskScoreCard(row) {
    this.router.navigate(["/credit/creditriskscorecard-info"], {
      queryParams: { editcreditRiskScoreCard: row.creditRiskAttributeId }
    });
  }
  onRowSelect(event) {
    this.router.navigate(["/credit/creditriskscorecard-info"], {
      queryParams: {
        editcreditRiskScoreCard: event.data.creditRiskAttributeId
      }
    });
  }
  rowClicked(row: any): void {}

  deleteCreditRiskScoreCard(row) {
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete user?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.creditRiskScoreCardService
            .deleteCreditRiskScoreCard(row.creditRiskScoreCardId)
            .subscribe(data => {
              __this.loadingService.hide();
              if (data["result"] == true) {
                swal.fire(
                  "GOS FINANCIAL",
                  "User deleted successful.",
                  "success"
                );
                __this.getAllCreditRiskScoreCard();
                __this.ngOnInit();
              } else {
                swal.fire("GOS FINANCIAL", "Record not deleted", "error");
              }
            });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  getColor(level) {
    let styles = {};
    switch (level) {
      case 2: {
        styles = { "background-color": "#404040" };
        break;
      }
      case 3: {
        styles = { "background-color": "#606060" };
        break;
      }
      case 4: {
        styles = { "background-color": "#808080" };
        break;
      }
      case 5: {
        styles = { "background-color": "#A0A0A0" };
        break;
      }
      case 6: {
        styles = { "background-color": "#8b4513" };
        break;
      }
      case 7: {
        styles = { "background-color": "#ca641c" };
        break;
      }
      case 8: {
        styles = { "background-color": "#e78c4b" };
        break;
      }
      case 9: {
        styles = { "background-color": "#f0b78f" };
        break;
      }
      default: {
        styles = { "background-color": "#3F51B5" };
        break;
      }

      // #3F51B5
    }
    return styles;
  }
  multipleDelete() {
    if (this.targetIds.length == 0) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
    }
    // const tempData = this.selectedCreditRating;
    // const targetIds = [];
    // if (tempData !== undefined) {
    //     tempData.forEach(el => {
    //         const data = {
    //             targetId: el.creditRiskRatingId
    //         };
    //         targetIds.push(data);
    //     });
    // }
    const body = {
      ids: this.targetIds,
      targetIds: this.targetIds_string
    };
    const __this = this;
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {
          __this.loadingService.show();

          __this.creditRiskScoreCardService
            .multiDeleteScoredCard(body)
            .subscribe(
              data => {
                __this.loadingService.hide();
                const message = data.status.message.friendlyMessage;
                if (data.deleted) {
                  swal.fire("GOS FINANCIAL", message, "success").then(() => {
                    __this.getGroupedAttribute();
                  });
                } else {
                  swal.fire("GOS FINANCIAL", message, "error");
                }
              },
              err => {
                this.loadingService.hide();
               if (err.status) {
                 const message = err.status.message.friendlyMessage;
                 swal.fire("GOS FINANCIAL", message, "error");
                //  __this.getAllCreditRiskScoreCard();
               } else {
                 const message = err.message.friendlyMessage;
                 swal.fire("GOS FINANCIAL", message, "error");
               }
              }
            );
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
      });
  }

  getValue(value: any) {
    // let data = {
    //   targetId: value
    // };
    this.targetIds.push(+value);
    this.targetIds_string.push(value.toString());
  }
}
