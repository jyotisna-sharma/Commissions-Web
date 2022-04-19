import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { ResponseCode } from '../../response.code';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface productData {
  ProductId: any;
  Name: any;
  headingTitle: any;
  subTitle: any;
  primaryButton: any;
  secondryButton: any;
  extraData: any;
}
@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit {
  ProductDetails = new FormGroup({
    Name: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });
  isError: boolean = false;
  errorMessage: any;
  postData: any;
  constructor(
    public dialogRef: MatDialogRef<AddEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: productData,
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
  ) { }

  ngOnInit() {
    this.ProductDetails.controls.Name.setValue(this.data.Name);
  }
  OnSaveProductdetails() {
    if (!this.ProductDetails.valid) {
      this.OnValidateFormField(this.ProductDetails);
      return;
    }
    else {
      this.postData = {
        'coverageDetails':
          {
            'CoverageID': this.data.ProductId === null ? Guid.create().toJSON().value : this.data.ProductId,
            'Name': this.ProductDetails.controls.Name.value
          }
      }
      this.configService.AddUpdateCoverage(this.postData).subscribe(response => {
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.dialogRef.close(true);
        }
        else if (response.ResponseCode === ResponseCode.RecordAlreadyExist) {
          this.isError = true;
          this.errorMessage = 'Entered product name already exists. Please try with different name. '
        }
      });
    }
  }
  OnValidateFormField(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
        fieldName.markAsTouched({ onlySelf: true });
      }
    });
  }
  OnClosePopup()
  {
    this.isError = false;
  }
}
