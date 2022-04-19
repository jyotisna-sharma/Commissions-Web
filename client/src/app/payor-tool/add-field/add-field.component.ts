import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PayorToolService } from '../payor-tool.service';
import { PayorToolUrlService } from '../payor-tool-url.service';
import { Guid } from 'guid-typescript';
import { ResponseCode } from '../../response.code';
import { ResponseErrorService } from '../../_services/response-error.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss']
})
export class AddFieldComponent implements OnInit {
  postdata: any;
  showloading = false;
  payorToolForm = new FormGroup({
    templateName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    IsForceImport: new FormControl(false, [])
  });
  errorMsg: any = '';
  isValidationShown: Boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddFieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private payorToolSvc: PayorToolService,
    public responseError: ResponseErrorService,
    public getrouteParamters: GetRouteParamtersService,
    public activatedRoute: ActivatedRoute

  ) { }

  ngOnInit() {
    if (this.data.templateName) {
      this.payorToolForm.controls.templateName.setValue(this.data.templateName);
      this.payorToolForm.controls.IsForceImport.setValue(this.data.forceImport);
    }
  }
  OnclosePopup() {
    this.dialogRef.close(false);
  }


  OnAddField() {
    if (!this.payorToolForm.valid) {
      this.payorToolForm.controls.templateName.markAsTouched({ onlySelf: true });
      this.payorToolForm.controls.templateName.markAsDirty({ onlySelf: true });
      return;
    } else {
      if (this.data.type == 'Template') {
        this.OnCreateTemplate();
      }
      else if (this.data.type == 'Field') {
        this.OnCreatePayorToolField();;
      }

    }
  }
  // *******************************************************************************************************************
  /*
   CreatedBY:Ankit Khandelwal
  CreatedOn:Feb19 2020
  PUrpose:Create a template for payor 
  */

  OnCreateTemplate() {
    if (this.payorToolForm.controls.templateName.value.toUpperCase() == 'Default'.toUpperCase()) {
      this.isValidationShown = true;
      this.errorMsg = 'Template cannot be added with "Default" name.';
      return;
    } else {
      this.postdata = {
        'templateId': this.data.templateId ? this.data.templateId : Guid.create().toJSON().value,
        'templateName': this.payorToolForm.controls.templateName.value,
        'payorId': this.data.payor,
        'isPayorImportTemplate': this.data.isPayorImportTemplate,
        'isForceImport': this.payorToolForm.controls.IsForceImport.value,
      }
      this.payorToolSvc.addTemplate(this.postdata).subscribe(response => {
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.dialogRef.close(true);
        } else if (response.ResponseCode === ResponseCode.RecordAlreadyExist) {
          this.isValidationShown = true;
          this.errorMsg = 'Template already exist with same name in this payor';
          return;
        }
        else {
          this.dialogRef.close(true);
          this.responseError.OpenResponseErrorDilog(response.Message);
        }
      });
    }
  }

  // #############################################################################################################################
  /*
    CreatedBY:Ankit Khandelwal
   CreatedOn:Feb19 2020
   PUrpose:Create a template for payor 
   */

  OnCreatePayorToolField() {
    let postData = {
      'PyrToolAvalableFields': {
        'FieldName': this.payorToolForm.controls.templateName.value,
        'FieldDiscription': 'XML DeuField',
        'EquivalentDeuField': this.payorToolForm.controls.templateName.value
      }

    };
    this.payorToolSvc.AddPayorToolField(postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.dialogRef.close(true);
      }
      else if (response.ResponseCode === ResponseCode.RecordAlreadyExist) {
        this.isValidationShown = true;
        this.errorMsg = ' Field Name already exist with same name';
        return;
      }
      else {
        this.responseError.OpenResponseErrorDilog(response.Message);;
      }
    });
  }

}
