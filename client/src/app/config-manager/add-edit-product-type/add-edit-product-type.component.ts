import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { ResponseCode } from '../../response.code';
import { CommonDataService } from '../../_services/common-data.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface productData {
  payorId: any;
  carrierId: any;
  productId: any;
  NickName: any;
  headingTitle: any;
  subTitle: any;
  primaryButton: any;
  secondryButton: any;
  extraData: any;
  CoverageNickId: any;
}
@Component({
  selector: 'app-add-edit-product-type',
  templateUrl: './add-edit-product-type.component.html',
  styleUrls: ['./add-edit-product-type.component.scss']
})
export class AddEditProductTypeComponent implements OnInit {
  SaveProductDetails = new FormGroup({
    PayorName: new FormControl('', {}),
    CarrierName: new FormControl('', {}),
    NickName: new FormControl('', [Validators.required,Validators.maxLength(50)]),
    Product: new FormControl('', [Validators.required,Validators.maxLength(50)])
  });
  carrierList: any = [];
  showLoader: Boolean = true;
  postData: any;
  loggedInDetails: any;
  iscreateProductType: any;
  filteredOptions: Observable<string[]>;
  isError: Boolean = false;
  errorMessage: any;
  ProductValue: any;
  constructor(
    public dialogRef: MatDialogRef<AddEditProductTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: productData,
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
    public commonsvc: CommonDataService,
  ) { }

  ngOnInit() {
    this.iscreateProductType = this.data.extraData.iscreate;
    this.loggedInDetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.carrierList = this.data.extraData.CarrierList;
    this.SaveProductDetails.controls.PayorName.setValue(this.data.payorId);
    this.SaveProductDetails.controls.CarrierName.setValue(this.data.carrierId);
    this.data.extraData.ProductList.map(value => {
      this.data.productId = this.data.productId === Guid.createEmpty().toJSON().value ? this.data.extraData.ProductList[0].CoverageID : this.data.productId
      if (value.CoverageID === this.data.productId) {
        this.ProductValue = value.Name
      }
    });
    this.SaveProductDetails.controls.Product.setValue(this.ProductValue);
    this.SaveProductDetails.controls.NickName.setValue(this.data.NickName);
    this.GetCarrierList();
    this.filteredOptions = this.SaveProductDetails.controls.Product.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.data.extraData.ProductList.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }
  GetCarrierList() {
    this.showLoader = true;
    this.postData = {
      'payorId': this.SaveProductDetails.controls.PayorName.value
    }
    this.commonsvc.getCarrierList(this.postData).subscribe(response => {
      this.showLoader = false;
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.carrierList = response.CarrierList;
        this.data.carrierId = this.carrierList[0].CarrierId;
        this.SaveProductDetails.controls.CarrierName.setValue(this.data.carrierId);
      }
    });
  }
  OnSaveProductdetails() {
    if (!this.SaveProductDetails.valid) {
      this.OnValidateFields(this.SaveProductDetails);
      return;
    }
    else {
      let CoverageId = null;
      this.data.extraData.ProductList.filter(value => {
        if (value.Name === this.SaveProductDetails.controls.Product.value) {
          CoverageId = value.CoverageID
        }
      });
      this.postData = {
        'coverageDetails': {
          'PayorID': this.SaveProductDetails.controls.PayorName.value,
          'CoverageID': CoverageId === null ? Guid.create().toJSON().value : CoverageId,
          'CarrierID': this.SaveProductDetails.controls.CarrierName.value,
          'NickName': this.SaveProductDetails.controls.NickName.value,
          'ModifiedBy': this.loggedInDetails['UserCredentialID'],
          'CreatedBy': this.loggedInDetails['UserCredentialID'],
          'CoverageNickId': this.iscreateProductType === 'true' ? null : this.data.CoverageNickId,
          'ProductName':   this.SaveProductDetails.controls.Product.value
        }
      }
      this.configService.AddUpdateCoverageType(this.postData).subscribe(response => {
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.dialogRef.close(true);
        }
        else if (response.ResponseCode === ResponseCode.RecordAlreadyExist) {
          this.isError = true;
          this.errorMessage = 'Entered product type already exists. Please try with different name.'
        }
      });
    }
  }
  OnValidateFields(formgroup: FormGroup) {
    Object.keys(formgroup.controls).forEach((field) => {
      const fieldName = formgroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
        fieldName.markAsTouched({ onlySelf: true });
      }
    });

  }
  OnClosePopup() {
    this.isError = false;
  }
}
