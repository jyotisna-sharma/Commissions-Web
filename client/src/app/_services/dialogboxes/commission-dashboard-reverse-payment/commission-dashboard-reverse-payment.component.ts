import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommissionOutgoingPaymentData } from './CommisssionOutgoingPaymentData.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-commission-dashboard-reverse-payment',
  templateUrl: './commission-dashboard-reverse-payment.component.html',
  styleUrls: ['./commission-dashboard-reverse-payment.component.scss']
})
export class CommissionDashboardReversePaymentComponent implements OnInit {
  ReversePayment = new FormGroup({
    CommissionPaid: new FormControl('', []),
    ReverseFromAgent: new FormControl('', []),
    UserName: new FormControl('', [Validators.required])
  });
  isValidationShown: Boolean = false;
  userList: any;
  userDetails: any;
  requiredField: Boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CommissionOutgoingPaymentData,
    public dialogRef: MatDialogRef<CommissionDashboardReversePaymentComponent>
  ) { }

  ngOnInit() {
    this.userList = this.data.extraData.userList;
    this.OnSetFormFieldsValues();
    this.userDetails = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.userDetails.Permissions[1].Permission === 1) {
      this.ReversePayment.disable();
    } else {
      this.ReversePayment.controls.CommissionPaid.disable();
    }
  }
  OnUpdatePayment() {
    if (!this.ReversePayment.valid) {
      this.ValidateFormField(this.ReversePayment);
      this.requiredField = true;
      return;
    }
    if (this.ReversePayment.controls.ReverseFromAgent.value <= 0) {
      this.isValidationShown = true;
      return;
    } else {
      this.dialogRef.close(this.ReversePayment.controls);
    }
  }
  ValidateFormField(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsTouched({ onlySelf: true });
        fieldName.markAsDirty({ onlySelf: true });
      }
    });
  }
  OnSetFormFieldsValues() {
    const Data = this.data.extraData.rowData;
    // this.ReversePayment.controls.UserName.setValue(Data.RecipientUserCredentialId);
    const amount = Data.PaidAmount.replace('$', '');
    this.ReversePayment.controls.CommissionPaid.setValue(amount);
    this.ReversePayment.controls.ReverseFromAgent.setValue(0.00);
  }
  OnCloseValidationPopup() {
    this.isValidationShown = false;
  }
  OnClosePopup() {
    this.dialogRef.close(false)
  }
}
