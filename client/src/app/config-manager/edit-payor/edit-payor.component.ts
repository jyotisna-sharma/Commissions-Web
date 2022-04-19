import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PayorData } from './payorData.model'
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { CommonDataService } from '../../_services/common-data.service'
import { Guid } from 'guid-typescript'


@Component({
  selector: 'app-edit-payor',
  templateUrl: './edit-payor.component.html',
  styleUrls: ['./edit-payor.component.scss']
})
export class EditPayorComponent implements OnInit {

 // ------------------------Variable Initalize----------------------------------------------------------------------------------
  SavePayor = new FormGroup({
    PayorName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    NickName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    Type: new FormControl('', []),
    Region: new FormControl('', []),
    Status: new FormControl('', []),
    Notes: new FormControl('', [])
  });
  regionList: any[];
  userdetail: any;
  postData: any;
  showLoader: any;
  isError: any;
  errorMessage: any;
  payorID: any;
  // *************************************************************************************************************************
  constructor(
    public dialogRef: MatDialogRef<EditPayorComponent>,
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
    public commonService: CommonDataService,

    @Inject(MAT_DIALOG_DATA) public data: PayorData
  ) { }
  //----------------------------------------------------------------------------------------------------------------------------
  ngOnInit() {
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.showLoader = true;
    if (this.data.extraData && this.data.extraData.Payor) {
      const payor = this.data.extraData.Payor;
      this.SavePayor.controls.Type.setValue(payor.SourceType.toString());
      this.SavePayor.controls.Status.setValue(payor.StatusID.toString());
      this.SavePayor.controls.PayorName.setValue(payor.PayorName);
      this.SavePayor.controls.NickName.setValue(payor.NickName);
      this.payorID = payor.PayorID;
    }
    else {
      this.payorID = '';
      this.SavePayor.controls.Type.setValue('0');
      this.SavePayor.controls.Status.setValue('0');
    }

    this.commonService.GetPayorRegions().subscribe(response => {
      this.regionList = response.RegionList;
      if (this.data.extraData && this.data.extraData.Payor) {
        this.SavePayor.controls.Region.setValue(this.data.extraData.Payor.RegionID);
      }
      else {
        this.SavePayor.controls.Region.setValue(this.regionList[0].RegionId);
      }
      this.showLoader = false;
    });
  }
  // **************************************************************************************************************************
  //---------------method used for hide the validation when user click on cross icon on validation message----------------------- 
  OnClosePopup(val: boolean) {

    this.isError = false;
  }
  // *****************************************************************************************************************************
  //-----------------------------Method used for validate a form -------------------------------------------   
  OnValidateFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
        fieldName.markAsTouched({ onlySelf: true });
      }
    });
  }
  // *****************************************************************************************************************************
  //------------------------------------Method used for save the details of payor--------------------------------------------  
  OnSave() {
    this.OnValidateFormFields(this.SavePayor);
    if (!this.SavePayor.valid) {
      return;
    } else {
      this.showLoader = true;
      const ID = (this.payorID) ? this.payorID : Guid.create().toJSON().value;
      const opnType = (this.payorID) ? '1' : '0';
      this.postData = {
        'payorObject': {
          'PayorID': ID,
          'PayorName': this.SavePayor.controls.PayorName.value,
          'NickName': this.SavePayor.controls.NickName.value,
          'PayorRegionID': this.SavePayor.controls.Region.value,
          'PayorTypeID': this.SavePayor.controls.Type.value,
          'StatusID': this.SavePayor.controls.Status.value,
          'IsGlobal': true,
          'UserID': this.userdetail.UserCredentialID
        },
        'operationType': opnType
      };
      this.configService.saveDeletePayor(this.postData).subscribe(response => {
        this.showLoader = false;
        if (response.Status) {
          if (response.Status.IsError) {
            this.isError = true;
            this.errorMessage = response.Status.ErrorMessage;
          }
          else {
            this.dialogRef.close(true);
          }
        }
      });
    }
  }
  // *****************************************************************************************************************************
}
