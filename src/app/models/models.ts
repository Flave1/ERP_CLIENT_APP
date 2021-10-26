export interface SearchColumn {
  header: string;
  field: string;
}

export interface ClassificationSetup {
  classificationsetupId: number;
  name: string;
  description: string;
  expenseGL: number;
  payablesGL: number;
  // classifications: [];
}

export interface CostCentre {
  description: string;
  costCenterId: number;
  name: string;
  structures: number;
  // costCentreList: [];
}

export interface Requisition {
  departmentId: number;
  requisitionStatusName: string;
  requestByName: string;
  deparmentmentName: string;
  requisitionStatus: number;
  statusId: number;
  requisitionId: number;
  erNnumber: string;
  requestBy: number;
  deparmentment: number;
  description: string;
  requestDate: Date;
  totalAmount: number;
  modeOfPayment: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  otherModeOfPayComment: string;
  comment: string;
  location: string;
  expectedDeleiveryDate: Date;
  addEdit_requisitiondetails: ExpenseDetails[];
  // requisitionList: [];
}

export interface ExpenseDetails {
  costCenterId: number;
  requisitionDetailId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  classificationsetupId: number;
  subTotal: number;
  isBudgeted: boolean;
  costCentreId: any;
}
// loan fee
export interface LoanFee {
  loanApplicationId: number;
  approvedProductId: number;
  productAmount: number;
  productName: string;
  productFeeId: number;
  createdBy: string;
}

export interface PaymentProposal {
  departmentId: number;
  requisitionId: number;
  requisitionPaymentId: number;
  ernNumber: number;
  description: string;
  requestedBy: string;
  department: string;
  structureId: number;
  requistionDate: Date;
  totalAmount: number;
  expectedDeliveryDate: Date;
  status: string;
}

export interface Retirement {
  erNumber: string;
  retirementId: number;
  requisitionId: number;
  ernNumber: string;
  totalAmountApproved: number;
  requisitionDate: Date;
  retirementDate: Date;
  description: string;
  amountUsed: number;
  balance: number;
  account: string;
}

export interface Approval {
  approvalStatus: number;
  approvalComment: string;
  targetId: number;
  referredStaffId: number;
  workflowToken: string;
}

export interface Claim {
  costCentreId: number;
  newClaimID: number;
  claimNo: string;
  employee: number;
  requestByName: string;
  requestByEmail: string;
  dept: number;
  departmentName: string;
  amountRequesting: number;
  purposeOfExpense: string;
  dateRequested: Date;
  costCentre: number;
  costCentreName: string;
  accountToFundName: string;
  accountToFundNumber: string;
  accountToFundBankName: string;
  evidence?: any;
  classificationsetupId: number;
  classificationsetupQuery: ClassificationSetup;
  approvalDetailsQuery: any[];
}

export interface Collection {
  collectionID: number;
  ernnumber: string;
  refundBy: string;
  modeOfRefund: number;
  amountToFund: number;
  amountUsed: number;
  requisitionApprovedAmount: number;
  balance: number;
  classificationsetupId: number;
  companyBank: number;
  companyBankName: number;
}

export interface RequisitionClaim {
  claimsId: number;
  claimNo: string;
  requestingOfficer: number;
  dept: number;
  department: string;
  amountRequested: number;
  description: string;
  dateRequested: Date;
  accountToFundName: string;
  accountToFundNumber: string;
  accountToFundBankName: string;
  evidence?: any;
  classificationsetupId: number;
  classificationsetupQuery: ClassificationSetup;
  approvalDetailsQuery: any[];
}
