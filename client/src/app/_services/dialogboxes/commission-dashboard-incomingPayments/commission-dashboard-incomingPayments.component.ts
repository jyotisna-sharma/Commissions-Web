import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommissionDashboardPaymentData } from './commissionPaymentData.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-commission-dashboard-incomingpayments',
  templateUrl: './commission-dashboard-incomingPayments.component.html',
  styleUrls: ['./commission-dashboard-incomingPayments.component.scss']
})
export class CommissionDashboardPaymentsComponent implements OnInit {
  AddNewPayment = new FormGroup({
    InvoiceDate: new FormControl('', []),
    PaymentReceived: new FormControl('', []),
    CommissionPer: new FormControl('', []),
    NumberOfUnits: new FormControl('', []),
    DollarPerUnit: new FormControl('', []),
    Fee: new FormControl('', []),
    SplitPer: new FormControl('', []),
    TotalPayment: new FormControl('', []),
    PaymentEntryID: new FormControl('', []),
    DEUEntryId: new FormControl('', [])
  });
  TotalAmount: any;
  userDetails: any;
  showValidationMessage: Boolean = false;
  isButtonDisabled: Boolean = true;
  effectivedate: any;
  effectiveDateShown: any;
  date = new Date(2099, 1, 1);
  maxDate = new Date(2099, 0, 1);
  constructor(
    public dialogRef: MatDialogRef<CommissionDashboardPaymentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommissionDashboardPaymentData
  ) { }

  ngOnInit() {
    if (this.data.extraData.policyData.PayorId || this.data.extraData.policyData.CarrierId) {
      this.isButtonDisabled = false;
    }
    this.userDetails = JSON.parse(localStorage.getItem('loggedUser'));

    const policydetails = this.data.extraData.CheckpolicyDetails;
    if (policydetails) {
      this.OnGettingPaymentDetails(policydetails.PaymentDetails);
      if (!policydetails.IsEntrybyCommissiondashBoard && this.userDetails.Permissions[1].Permission !== 1) {
        this.AddNewPayment.enable();
        this.AddNewPayment.controls.Fee.disable();
        this.AddNewPayment.controls.SplitPer.disable();
      } else {
        if (this.userDetails.Permissions[1].Permission === 1) {
          this.AddNewPayment.disable();
        }
      }
    }
    this.AddNewPayment.controls.InvoiceDate.valueChanges.subscribe(result => {
      if (!this.AddNewPayment.controls.InvoiceDate.value) {
        this.isButtonDisabled = true;
      } else {
        this.isButtonDisabled = false;
      }
    });
  }
  OnClosePopup() {
    this.dialogRef.close(false)
  }
  OnlyDateFormat = (dateObj: Date): string => {
    if (dateObj) {
      return (((dateObj.getMonth() + 1) + '/' + dateObj.getDate() + '/' + dateObj.getFullYear()) || '');
    }
  }
  OnCloseValidationPopup() {
    this.showValidationMessage = false;
  }
  OnGettingPaymentDetails(values) {
    this.AddNewPayment.controls.InvoiceDate.setValue(new Date(values.InvoiceDateString));
    this.AddNewPayment.controls.PaymentReceived.setValue(values.PaymentRecived.replace('$', ''));
    this.AddNewPayment.controls.CommissionPer.setValue(values.CommissionPercentage.replace('%', ''));
    this.AddNewPayment.controls.NumberOfUnits.setValue(values.NumberOfUnits);
    this.AddNewPayment.controls.DollarPerUnit.setValue(values.DollerPerUnit.replace('$', ''));
    this.AddNewPayment.controls.Fee.setValue(values.Fee.replace('$', ''));
    this.AddNewPayment.controls.SplitPer.setValue(values.SplitPer.replace('%', ''));
    this.AddNewPayment.controls.DEUEntryId.setValue(values.DEUEntryId);
    this.AddNewPayment.controls.PaymentEntryID.setValue(values.PaymentEntryID);
    this.TotalAmount = values.TotalPayment;
    this.AddNewPayment.controls.TotalPayment.setValue(this.TotalAmount);
  }
  // OnInitialValueSet() {
  //   this.AddNewPayment.controls.InvoiceDate.setValue(new Date());
  //   this.AddNewPayment.controls.PaymentReceived.setValue('0.00');
  //   this.AddNewPayment.controls.CommissionPer.setValue('0.00');
  //   this.AddNewPayment.controls.NumberOfUnits.setValue('0');
  //   this.AddNewPayment.controls.DollarPerUnit.setValue('0.00');
  //   this.AddNewPayment.controls.Fee.setValue('0.00');
  //   this.AddNewPayment.controls.SplitPer.setValue('100.00');
  //   this.TotalAmount = '$' + ' ' + '0.00';
  //   this.AddNewPayment.controls.TotalPayment.setValue(this.TotalAmount);
  // }
  // TotalPaymentCalculate() {
  //   const minusSign = '-';
  //   const value = this.AddNewPayment.controls.NumberOfUnits.value;
  //   if (value && !Number(this.AddNewPayment.controls.NumberOfUnits.value)) {
  //     this.AddNewPayment.controls.NumberOfUnits.setValue(0);
  //   } else if (this.AddNewPayment.controls.NumberOfUnits.value === '-' || this.AddNewPayment.controls.NumberOfUnits.value === '-0') {
  //     this.AddNewPayment.controls.NumberOfUnits.setValue(0);
  //   }
  //   this.TotalAmount =
  //     (Number((this.AddNewPayment.controls.PaymentReceived.value)) * Number((this.AddNewPayment.controls.CommissionPer.value / 100)) +
  //       Number((this.AddNewPayment.controls.NumberOfUnits.value) * Number(this.AddNewPayment.controls.DollarPerUnit.value)) +
  //       Number(this.AddNewPayment.controls.Fee.value)) * Number(this.AddNewPayment.controls.SplitPer.value) / 100
  //   let amount = Number(this.TotalAmount);
  //   if (isNaN(amount)) {
  //     amount = 0;
  //   }
  //   this.TotalAmount = '$' + ' ' + amount.toFixed(2);
  //   this.AddNewPayment.controls.TotalPayment.setValue(this.TotalAmount);
  // }
  OnCheckValidation() {
    if (!this.AddNewPayment.valid) {
      return;
    }
    if (this.data.extraData.policyData.OriginDateString) {
      this.effectivedate = this.data.extraData.policyData.OriginDateString;
      for (let i = 0; i < 2; i++) {
        this.effectivedate = this.effectivedate.replace('-', '/');
      }
      this.effectivedate = new Date(this.effectivedate);
      this.effectiveDateShown = this.OnlyDateFormat(new Date(this.effectivedate));
    }
    const InvoiceDate = new Date(this.AddNewPayment.controls.InvoiceDate.value);
    if (InvoiceDate < this.effectivedate) {
      this.showValidationMessage = true;
      return;
    } else {
      this.dialogRef.close(this.AddNewPayment.controls)
    }
  }

}
