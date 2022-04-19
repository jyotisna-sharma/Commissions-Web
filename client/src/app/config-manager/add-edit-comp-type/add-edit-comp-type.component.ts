import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { ResponseCode } from '../../response.code';
import { CommonDataService } from '../../_services/common-data.service';
export interface productData {
  Name: any;
  comptypeList: any;
  headingTitle: any;
  selectedCompTypeId: any;
  primaryButton: any;
  secondryButton: any;
  extraData: any;
  paymentTypeName: any;
  Id: any;

}
@Component({
  selector: 'app-add-edit-comp-type',
  templateUrl: './add-edit-comp-type.component.html',
  styleUrls: ['./add-edit-comp-type.component.scss']
})
export class AddEditCompTypeComponent implements OnInit {
  CompTypeDetails = new FormGroup({
    Comptype: new FormControl('', {}),
    Name: new FormControl('', [Validators.required,Validators.maxLength(100)]),
  });
  postData: any;
  showValidationMessage: Boolean = false;
  validationMessage: any;
  DialogBoxData: any = 'Create Comp type';
  constructor(
    public dialogRef: MatDialogRef<AddEditCompTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: productData,
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
    public commonsvc: CommonDataService

  ) { }

  ngOnInit() {
    this.CompTypeDetails.controls.Comptype.setValue(this.data.selectedCompTypeId == '6' ? this.data.comptypeList[1].PaymentTypeId : this.data.selectedCompTypeId);
    this.CompTypeDetails.controls.Name.setValue(this.data.Name);
  }
  OnAddUpdateCompType() {
    if (!this.CompTypeDetails.valid) {
      this.OnValidateFormField(this.CompTypeDetails);
      return;
    }
    let paymentTypeName = null;
    this.data.comptypeList.map(element => {
      if (element.PaymentTypeId == this.CompTypeDetails.controls.Comptype.value) {
        paymentTypeName = element.PaymenProcedureName;
      }
    });
    this.postData = {
      'objCompType': {
        'IncomingPaymentTypeID': this.CompTypeDetails.controls.Comptype.value,
        'PaymentTypeName': paymentTypeName,
        'Names': this.CompTypeDetails.controls.Name.value,
        'Id': this.data.Id
      }
    }
    this.configService.AddUpdateCompType(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.dialogRef.close(true);
      }
      else if (response.ResponseCode === ResponseCode.RecordAlreadyExist) {
        this.showValidationMessage = true;
        this.validationMessage = 'Entered name already exists. Please try with different name.'
      }
    });
  }
  OnCloseValidationPopup() {
    this.showValidationMessage = false;
  }
  OnValidateFormField(formgroup: FormGroup) {
    Object.keys(formgroup.controls).forEach((field) => {
      const fieldName = formgroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
        fieldName.markAsTouched({ onlySelf: true });
      }
    });
  }
}
