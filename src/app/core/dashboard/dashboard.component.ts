import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Car } from 'src/app/demo/domain/car';
import { CarService } from 'src/app/demo/service/carservice';
import { EventService } from 'src/app/demo/service/eventservice';
import { BreadcrumbService } from 'src/app/shared/common/breadcrumb.service';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { ProductService } from '../services/product.service';
import { CreditRiskScoreCardService } from '../services/creditriskscorecard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Finance } from 'financejs';
import swal from 'sweetalert2';
import { DashboardService } from '../services/dashboard.service';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  data: any;
  loanApplicationDetails: any;
  dialogVisible: boolean;
  cols: any[];

  chartData: any;

  events: any[];

  height: any = '350px';
  loanStagingHeight = '135px';
  barChartData: any;
  val: number = 0;
  interest: number;
  tenor: number;
  provisioning: number;
  doughnutChartData: {};
  eligibilityTenor: number = 0;
  eligibilityInterest: number = 0;
  eligibilityIncome: number = 0;
  eligibilityExpenses: number = 0;
  loanStagingChartData: any;
  overdueChartData: any;
  productInformation: any[] = [];
  // product: any;
  private weightedRiskScores: any[] = [];
  customerTypeArr: any[] = [];
  private form: FormGroup;
  productId: any = 0;
  customerTypeId: any = 0;
  productAttr: any[] = [];
  loanAmount: number;
  displayDialog: boolean;
  loanProduct: any;
  selectLoanProduct: any = 0;
  loanLimit: any;
  payment: number = 0;
  frequencyTypes: any[] = [];
  frequencyId: any;
  frequencyName: any;
  paymentFrequency: any;
  dob: any;
  options = {
    legend: {
      display: false,
    },
  };
  private applicationId: any;
  formatData: any;
  constructor(
    public fb: FormBuilder,
    private carService: CarService,
    private eventService: EventService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private loadingService: LoadingService,
    private productService: ProductService,
    private creditService: CreditRiskScoreCardService,
    private dashboardService: DashboardService,
    private dataService: DataService,
    public titleService: Title
  ) {
    this.breadcrumbService.setItems([{ label: '' }]);
    // this.data = {
    //     labels: [
    //         "January",
    //         "February",
    //         "March",
    //         "April",
    //         "May",
    //         "June",
    //         "July"
    //     ],
    //     datasets: [
    //         {
    //             label: "First Dataset",
    //             data: [65, 59, 80, 81, 56, 55, 40],
    //             fill: false,
    //             borderColor: "#4bc0c0"
    //         },
    //         {
    //             label: "Second Dataset",
    //             data: [28, 48, 40, 19, 86, 27, 90],
    //             fill: false,
    //             borderColor: "#565656"
    //         }
    //     ]
    // };
    // this.barChartData = {
    //     labels: [
    //         "Jan",
    //         "Feb",
    //         "Mar",
    //         "Apr",
    //         "May",
    //         "Jun",
    //         "Jul",
    //         "Aug",
    //         "Sep",
    //         "Oct",
    //         "Nov",
    //         "Dec"
    //     ],
    //     datasets: [
    //         {
    //             label: "My First dataset",
    //             backgroundColor: "#42A5F5",
    //             borderColor: "#1E88E5",
    //             data: [65, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40]
    //         }
    //         // {
    //         //     label: 'My Second dataset',
    //         //     backgroundColor: '#9CCC65',
    //         //     borderColor: '#7CB342',
    //         //     data: [28, 48, 40, 19, 86, 27, 90]
    //         // }
    //     ]
    // };
    // this.loanStagingChartData = {
    //     labels: ["January", "February", "March"],
    //     datasets: [
    //         {
    //             label: "Loan Staging",
    //             backgroundColor: "#42A5F5",
    //             borderColor: "#1E88E5",
    //             data: [65, 59, 80]
    //         }
    //         // {
    //         //     label: 'My Second dataset',
    //         //     backgroundColor: '#9CCC65',
    //         //     borderColor: '#7CB342',
    //         //     data: [28, 48, 40, 19, 86, 27, 90]
    //         // }
    //     ]
    // };
    // this.doughnutChartData = {
    //     labels: ["A", "B", "C"],
    //     datasets: [
    //         {
    //             data: [300, 50, 100],
    //             backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    //             hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    //         }
    //     ]
    // };
    // this.overdueChartData = {
    //     labels: [
    //         "0-30 days",
    //         "31-60 days",
    //         "61-90 days",
    //         "91-180 days",
    //         "Above 180 days"
    //     ],
    //     datasets: [
    //         {
    //             hoverBackgroundColor: [
    //                 "#FF6384",
    //                 "#36A2EB",
    //                 "#FFCE56",
    //                 "#ff1456",
    //                 "#6ad2eb"
    //             ],
    //             data: [300, 50, 100, 150, 90],
    //             backgroundColor: [
    //                 "#FF6384",
    //                 "#36A2EB",
    //                 "#FFCE56",
    //                 "#ff1456",
    //                 "#6ad2eb"
    //             ],

    //         }
    //     ]
    // };

    this.form = this.fb.group({
      productId: ['', Validators.required],
      customerTypeId: ['', Validators.required],
    });
  }

  ngOnInit() {
    // this.getDashboardData();
    this.setTitle('GOS ERP | Dashboard');
    this.getAllProduct();
    this.getDashboardPerformanceMetrics();
    this.getLoanApplicationDetails();
    this.getLoanConcentrationDetails();
    this.getLoanPAR();
    this.getLoanOverDue();
    this.getFrequencyTypes();
    this.getLoanStagingData();
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  getLoanConcentrationDetails(): void {
    this.loadingService.show();
    this.dashboardService.getLoanConcentrationDetails().subscribe(
      (data) => {
        this.loadingService.hide();
        const returnedData = data.loanConcentration.datasets.data;
        this.formatData = returnedData.map((item) => {
          return item.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        });
        console.log(this.formatData);
        this.doughnutChartData = {
          labels: data.loanConcentration.labels,
          datasets: [
            {
              data: data.loanConcentration.datasets.data,
              backgroundColor: data.loanConcentration.datasets.backgroundColor,
              hoverBackgroundColor:
                data.loanConcentration.datasets.hoverBackgroundColor,
            },
          ],
        };
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getLoanOverDue() {
    this.loadingService.show();
    this.dashboardService.getLoanOverDue().subscribe(
      (data) => {
        this.loadingService.hide();
        this.provisioning = data.loanOverDue.provisioning;

        this.overdueChartData = {
          labels: data.loanOverDue.labels,
          datasets: [
            {
              data: data.loanOverDue.datasets.data,
              backgroundColor: data.loanOverDue.datasets.backgroundColor,
              hoverBackgroundColor:
                data.loanOverDue.datasets.hoverBackgroundColor,
            },
          ],
        };
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getLoanPAR(): void {
    this.loadingService.show();
    this.dashboardService.getLoanPAR().subscribe(
      (data) => {
        this.loadingService.hide();
        this.barChartData = {
          labels: data.par.labels,
          datasets: [
            {
              data: data.par.datasets[0].data,
              borderColor: data.par.datasets[0].borderColor,
              backgroundColor: data.par.datasets[0].backgroundColor,
              label: data.par.datasets[0].label,
            },
          ],
        };
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getLoanApplicationDetails(): void {
    this.loadingService.show();
    this.dashboardService.getLoanApplicationDetails().subscribe(
      (data) => {
        this.loadingService.hide();
        this.loanApplicationDetails = data.loanApplicationDetail;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getDashboardPerformanceMetrics() {
    this.loadingService.show();
    this.dashboardService.getPerformanceMatrics().subscribe(
      (data) => {
        this.loadingService.hide();
        this.data = data.performanceMetric;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getAllProduct() {
    this.loadingService.show();
    this.productService.getAllProduct().subscribe(
      (data) => {
        this.loadingService.hide();
        this.productInformation = data.products;
      },
      (err) => {
        this.loadingService.hide();
      },
      () => {}
    );
  }
  getProductWeightedRiskScores(productId) {
    this.loadingService.show();
    this.creditService.getSingleWeightedRiskScore(productId).subscribe(
      (data) => {
        this.loadingService.hide();
        this.weightedRiskScores = data.creditWeightedRiskScore;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  startLoanApplication() {
    this.router.navigate(['/credit/application-list']);
  }

  initiateLoan() {
    this.router.navigate(['/credit/startloanapplication-list']);
  }

  loanAppraisal() {
    this.router.navigate(['/credit/credit-appraisal']);
  }

  loanStatus() {
    this.router.navigateByUrl('/loan-management/application');
  }

  loanBooking() {
    this.router.navigate(['/credit/loanapplications']);
  }

  loanManagement() {
    this.router.navigateByUrl('/loan-management/application');
  }

  collateralManagement() {
    this.router.navigateByUrl('/loan-management/collateral');
  }
  ngOnDestroy(): void {
    // this.getAllProduct().un
  }

  onCustomerTypeChanged() {
    if (!this.productId || this.productId == 0) {
      return swal.fire('GOS FINANCIAL', 'Select a product', 'error');
    }
    if (!this.customerTypeId || this.customerTypeId == 0) {
      return swal.fire('GOS FINANCIAL', 'Select Customer Type', 'error');
    }
    this.creditService
      .getWeightedRiskScoreByCustomerType(this.productId, this.customerTypeId)
      .subscribe(
        (data) => {
          this.productAttr = data.creditWeightedRiskScore;
        },
        (err) => {},
        () => {
          this.displayDialog = true;
        }
      );
  }

  openLoanManagement() {
    this.router.navigate(['/credit/loan-booking-approval']);
  }
  getLoanApplicationId() {
    if (this.customerTypeId !== 0 && this.productId !== 0) {
      return this.dashboardService
        .getLoanApplicationId(this.customerTypeId, this.productId)
        .subscribe(
          (data) => {
            this.applicationId = data.result.loanApplicationId;
            this.goToEligibility();
            this.dataService.fromDashboard.emit(true);
          },
          (err) => {},
          () => {
            this.router.navigate([
              '/credit/eligibility-check',
              this.applicationId,
            ]);
          }
        );
    }
  }
  goToEligibility() {
    this.router.navigate(['/credit/eligibility-check', this.applicationId]);
  }
  beginEligibilityCalculation() {
    this.onCustomerTypeChanged();
  }

  selectedProduct(event) {
    this.selectLoanProduct = event;
    this.tenor = this.selectLoanProduct.period;
    this.interest = this.selectLoanProduct.rate;
    this.loanLimit = this.selectLoanProduct.productLimit;
    this.frequencyId = this.selectLoanProduct.frequencyTypeId;

    this.frequencyTypes.forEach((item) => {
      if (item.lookupId == this.frequencyId) {
        this.paymentFrequency = item.lookupId;
        this.frequencyName = item.lookupName;
      }
    });
  }
  getFrequencyTypes() {
    return this.dashboardService.getFrequencyTypes().subscribe(
      (data) => {
        this.frequencyTypes = data.lookUp;
      },
      (err) => {},
      () => {}
    );
  }
  calculatePayment() {
    if (!this.selectLoanProduct) {
      return swal.fire('GOS FINANCIAL', 'Select a Product', 'error');
    }
    if (isNaN(this.loanAmount)) {
      return swal.fire('GOS FINANCIAL', 'Only numbers allowed', 'error');
    }
    if (!this.loanAmount) {
      return swal.fire('GOS FINANCIAL', 'Enter Loan Amount', 'error');
    }
    if (this.loanAmount > this.loanLimit) {
      return swal.fire(
        'GOS FINANCIAL',
        'Amount is greater than product limit',
        'error'
      );
    }
    let finance = new Finance();
    if (this.frequencyName == 'Yearly') {
      this.payment = finance.AM(this.loanAmount, this.interest, this.tenor, 0);
    }
    if (this.frequencyName == 'Monthly') {
      this.payment = finance.AM(this.loanAmount, this.interest, this.tenor, 1);
    }
    if (this.frequencyName == 'Weekly') {
      this.payment =
        finance.AM(this.loanAmount, this.interest, this.tenor, 0) / 12;
    }
    if (this.frequencyName == 'Twice-Monthly') {
      this.payment =
        finance.AM(this.loanAmount, this.interest, this.tenor, 0) / 24;
    }
    if (this.frequencyName == 'Daily') {
      this.payment =
        finance.AM(this.loanAmount, this.interest, this.tenor, 0) / 365;
    }
    if (this.frequencyName == 'Quarterly') {
      this.payment =
        finance.AM(this.loanAmount, this.interest, this.tenor, 0) / 4;
    }
    if (this.frequencyName == 'Thrice-Yearly') {
      this.payment =
        finance.AM(this.loanAmount, this.interest, this.tenor, 0) / 3;
    }
  }

  openPaymentsDue() {
    this.router.navigateByUrl('/loan-management/payments-due');
  }

  openOverdue() {
    this.router.navigateByUrl('/loan-management/overdue');
  }
  getLoanStagingData(): Subscription {
    this.loadingService.show();
    return this.dashboardService.getLoanStagingData().subscribe(
      (data) => {
        this.loadingService.hide();
        this.loanStagingChartData = {
          labels: data.loanStaging.labels,
          datasets: [
            {
              label: 'Loan Staging',
              backgroundColor: data.loanStaging.datasets[0].backgroundColor,
              //backgroundColor: '#42A5F5',
              //borderColor: '#1E88E5',
              data: data.loanStaging.datasets[0].data,
            },
          ],
        };
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  getDashboardData() {
    return this.dashboardService
      .requestDataFromMultipleSources()
      .subscribe((data) => {
        data.map((item) => {
          this.loanApplicationDetails = item.loanApplicationDetail;
          this.data = item.performanceMetric;
          this.loanStagingChartData = {
            labels: item.customerDashboard.labels,
            datasets: [
              {
                label: 'Loan Staging',
                backgroundColor: '#42A5F5',
                borderColor: '#1E88E5',
                data: item.customerDashboard.datasets[0].data,
              },
            ],
          };
        });
      });
  }
}
