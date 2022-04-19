import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { ResponseCode } from '../../response.code';
export interface AddEditCarrierData {
  payorList: any;
  selectedPayor: any;
  selectedCarrierData: any;
  isEditScreen: Boolean;
}
@Component({
  selector: 'app-edit-carrier',
  templateUrl: './add-edit-carrier.component.html',
  styleUrls: ['./add-edit-carrier.component.scss']
})
export class AddEditCarrierComponent implements OnInit {
  carrierData = new FormGroup({
    Payor: new FormControl('', []),
    Name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    NickName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    TrackMissingMonth: new FormControl('1', []),
    TrackIncomingPer: new FormControl('1', [])
  });
  postData: any;
  DialogBoxData: any = 'Create Carrier';
  Userdetails: any;
  buttonName:any='Create';
  showValidationMessage: Boolean = false;
  validationMessage: any;
  showloading: Boolean=false;
  constructor(
    public dialogRef: MatDialogRef<AddEditCarrierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditCarrierData,
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
  ) { }

  ngOnInit() {
    this.Userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.carrierData.controls.Payor.setValue(this.data.selectedPayor);
    if (this.data.isEditScreen) {
      this.DialogBoxData = 'Edit Carrier'
      this.OnSetCarrierDetails();
      this.buttonName='Update';
    }
  }
  OnAddUpdateCarrier() {

    this.OnValidateFormFields(this.carrierData);
    if (!this.carrierData.valid) {
      return;
    } else {
      this.showloading = true;
      const controls = this.carrierData.controls;
      this.postData = {
        'CarrierDetails': {
          'CarrierId': this.data.isEditScreen ? this.data.selectedCarrierData.CarrierId : Guid.create().toJSON().value,
          'CarrierName': controls.Name.value,
          'NickName': controls.NickName.value,
          'IsTrackIncomingPercentage': controls.TrackIncomingPer.value,
          'IsTrackMissingMonth': controls.TrackMissingMonth.value,
          'CreatedBy': this.Userdetails['UserCredentialID'],
          'PayorId': controls.Payor.value,
          'ModifiedBy': this.Userdetails['UserCredentialID']
        }
      };
      this.configService.AddUpdateCarrierDetails(this.postData).subscribe(response => {
        this.showloading = false;
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.dialogRef.close(controls.Payor.value);
        } else if (response.ResponseCode === ResponseCode.User_Already_Exist) {
          this.showValidationMessage = true;
          this.validationMessage = response.Message;
          return;
        }
        else {
          this.showValidationMessage = true;
          this.validationMessage = response.Message;
        }
      });
    }

  }
  OnValidateFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
        fieldName.markAsTouched({ onlySelf: true });
      }
    });
  }
  OnSetCarrierDetails() {
    const controls = this.carrierData.controls;
    const carrierData = this.data.selectedCarrierData;
    controls.Name.setValue(carrierData.CarrierName);
    controls.Payor.setValue(carrierData.PayorId);
    controls.NickName.setValue(carrierData.NickName);
    controls.TrackIncomingPer.setValue(carrierData.IsTrackIncomingPercentage === false ? '0' : '1');
    controls.TrackMissingMonth.setValue(carrierData.IsTrackMissingMonth === false ? '0' : '1');
  }
  OnClosePopup() {
    this.dialogRef.close(false);
  }
  OnCloseValidationPopup() {
this.showValidationMessage = false;
  }
}
