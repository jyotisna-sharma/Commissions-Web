import {
  Component, OnInit, Input, ViewChild, Inject, ViewChildren, QueryList,
  AfterViewInit, ElementRef, Output, EventEmitter
} from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ResponseCode } from '../../../response.code';
import { ToastrService } from 'ngx-toastr';
import { CommonMethodsService } from '../../../_services/common-methods.service';
import { CommonDataService } from '../../../_services/common-data.service';
import { DeuFieldDataCollection, DEUFormField } from '../../post-data-entry/common-classes';
import { ServerURLS } from '../../../../assets/config/CONSTANTS';
import { Subject, BehaviorSubject } from 'rxjs';
import { LearnedFieldsDetails } from '../learned-fields-details';
import { DataEntryUnitService } from '../../data-entry-unit.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShowConfirmationComponent } from '../../../_services/dialogboxes/show-confirmation/show-confirmation.component';

import { debounceTime, filter } from 'rxjs/operators';
@Component({
  selector: 'app-post-entry-section',
  templateUrl: './post-entry-section.component.html',
  styleUrls: ['./post-entry-section.component.css']
})
export class PostEntrySectionComponent implements OnInit, AfterViewInit {
  isStatmentListShown: Boolean = false;
  dEUFormFieldsArray: FormArray = new FormArray([
  ]);

  payorToolObject: any;
  statementImage: any;
  checkAmountImage: any;
  primaryKeyName: any;
  showLoader: Boolean = false;
  paymentDetails: any = {
    'policyUniqueIdentifier': '',
    'newStatementNumber': '',
    'isNewStatementCreate': false,
    'isResetbuttonClick': false
  };
  isSearchPolicyShown: Boolean = false;
  @ViewChildren('inputField') inputs: QueryList<any>;
  @ViewChild('resetButton') resetButton: ElementRef;
  @ViewChild('postButton') postButtonRef: ElementRef;
  @Input() enableDataFields: any = new BehaviorSubject<any>({});
  @Input() StatementInfoGroup: FormGroup;
  @Input() isTemplateDataShown: Subject<boolean> = new Subject<any>();
  @Input() policyLearnedFields: any = new BehaviorSubject<any>({});
  @Input() isSelectedPaymentDetails: any = new BehaviorSubject<any>({});
  @Output() PostedPaymentData: any = new EventEmitter<object>();
  @Output() afterPostPaymentEntry: any = new EventEmitter<object>();
  @Output() afterProcessPaymentEntry: any = new EventEmitter<object>();
  @Output() isNewStatementCreate: any = new Subject<Boolean>();
  @Output() IsFirstPaymentIndexSelected: any = new EventEmitter<object>();
  @Output() isNewEntryPost: any = new EventEmitter<object>();
  isuniqueIdentfierListLoad: Subject<boolean> = new Subject<boolean>();
  isPostStartDisabled: Boolean = true;
  selectedPolicyLearnedFields: any;
  isCheckAmountClicked: Boolean = false;
  tabIndexNumber: number = 1;
  userDetails: any;
  fieldHelpText: any;
  toolTipText: any = '';
  dateForComparision: any = [];
  savePostRecordField: any;
  changes: Array<{ changedAt: Date; changes: any }>;
  nextUniqueIdentifierTabIndex: any;
  isLearnFieldResponseOccur: Boolean = false;
  // intervalTime: any;
  constructor(
    public sendAPIRequest: CommonDataService,
    public toaster: ToastrService,
    public dialog: MatDialog,
    public commonMethodSvc: CommonMethodsService,
    public fb: FormBuilder,
    public dataEntryUnitSvc: DataEntryUnitService,
  ) { }

  ngOnInit(): void {
    // this.ngxUiLoaderService.startLoader(1);
    this.userDetails = JSON.parse(localStorage.getItem('loggedUser'));
  }
  ngAfterViewInit(): void {
    this.isTemplateDataShown.subscribe(result => {
      if (result) {
        this.GetTemplateData();
      }
    });
    // this.dEUFormFieldsArray.valueChanges.subscribe(fieldData => {
    //   event.stopPropagation();
    // });

    this.isSelectedPaymentDetails.subscribe(result => {

      if (result && this.dataEntryUnitSvc.buttonText === 'End Edit') {
        this.paymentDetails.isResetbuttonClick = false;
        this.paymentDetails.isNewStatementCreate = false;
        this.paymentDetails.policyUniqueIdentifier = null;
        this.PostedPaymentData.emit({ DEUFieldDetails: this.paymentDetails });
        this.OnRepostSelectedPayment(result.selectedPaymentDetails);
      } else if (result && this.dataEntryUnitSvc.buttonText === 'Start Edit') {
        this.OnPostReset();
      }
    });
    // this.isuniqueIdentfierListLoad.subscribe(result => {
    //   if (result) {
    //     const timeout = setInterval(() => {
    //       this.inputs.filter((item: any, index: number): any => {
    //         debugger;
    //         if (item['nativeElement'] && item['nativeElement'].tabIndex === this.nextUniqueIdentifierTabIndex) {
    //           this.inputs.toArray()[index].nativeElement.focus();
    //           if (this.isLearnFieldResponseOccur) {
    //             clearInterval(timeout);
    //           }
    //         }
    //       });
    //     });
    //   }
    // });
    // this.policyLearnedFields.subscribe(result => {
    // this.selectedPolicyLearnedFields = result ? result : '';
    // this.isLearnFieldResponseOccur = true;
    // clearInterval(this.intervalTime);
    // this.inputs.filter((item: any, index: number): any => {
    //   if (item['nativeElement'] && item['nativeElement'].tabIndex === this.nextUniqueIdentifierTabIndex) {
    //     this.inputs.toArray()[index].nativeElement.focus();
    //   }
    // });
    // if (result) {
    //   this.inputs.filter((item: any, index: number): any => {
    //     if (item['nativeElement'] && item['nativeElement'].tabIndex === this.nextUniqueIdentifierTabIndex) {
    //       this.inputs.toArray()[index].nativeElement.focus();
    //     }
    //   });
    // } else {
    //   this.isLearnFieldResponseOccur = false;
    //   this.nextUniqueIdentifierTabIndex = '';
    // }

    //});
    this.policyLearnedFields.subscribe(result => {
      //   this.dEUFormFieldsArray.enable();
      // // console.log('setEnableDataFields Call 2 for Enabled');
      this.setEnableDataFields(true);
      try{
    //  // // console.log('try getting API response: ');
      let fieldIndex = 0;
      this.inputs.filter((item: any, index: number): any => {
        if (item['nativeElement'] && item['nativeElement'].tabIndex === this.nextUniqueIdentifierTabIndex) {
          fieldIndex = index;
        }
      });
      this.selectedPolicyLearnedFields = result ? result : '';
      if (result && fieldIndex) {
        //this.inputs.toArray()[fieldIndex].nativeElement.focus();
        this.FocusOnCalculateFormula(this.dEUFormFieldsArray.controls[this.nextUniqueIdentifierTabIndex - 1],
          this.nextUniqueIdentifierTabIndex - 1);

      } else {
        this.nextUniqueIdentifierTabIndex = '';
      }
      }
      catch(e){
        // console.log('Exception getting learned fields response: ' + e );
      }
     
    });

    // this.enableDataFields.subscribe(result => {
    //   //  this.setEnableDataFields(true);
    // });
  }

  setEnableDataFields( value: Boolean) : void {
   // this.dEUFormFieldsArray.disable();
     // this.inputs.forEach(element => {
       // element.nativeElement.disabled  = !value;
      //});
      // // console.log('setEnableDataFields: Entered enable fields with value: ' + value);
      if(!value){
         this.dEUFormFieldsArray.disable();
          // console.log('setEnableDataFields: Disabled');
      }
      else{
         this.dEUFormFieldsArray.enable();
          // console.log('setEnableDataFields: Enabled');
      }
      if(this.inputs && this.tabIndexNumber){
        if(this.inputs.toArray()[this.tabIndexNumber]){
          this.inputs.toArray()[this.tabIndexNumber].nativeElement.focus();
          }
      }
  }

  OnRepostSelectedPayment(selectedResult: any): void {
    if (selectedResult) {
      const postData = {
        deuEntryId: selectedResult.DEUENtryID,
        payorToolId: this.dEUFormFieldsArray.controls[0]['controls'].PayorToolId.value,
        'URL': 'GettingPaymentDetails'
      };
      this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {

        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.dEUFormFieldsArray.controls[this.dEUFormFieldsArray.controls.length - 1]
          ['controls'].DefaultValue.setValue(selectedResult.DEUENtryID);
          this.dEUFormFieldsArray.controls.forEach(item => {
            response.DEUList.forEach(fieldDetails => {
              if (fieldDetails.DeuFieldName === item['controls']['EquivalentDeuField'].value) {
                // if (item['controls'].DEUMaskFieldType.DEUMaskTypeId === 1) {
                // } else {
                if (fieldDetails.DeuFieldName === 'CompType') {
                  const mapTolearnedFields: LearnedFieldsDetails = new LearnedFieldsDetails();
                  item['controls']['DefaultValue'].setValue(mapTolearnedFields.GetCompType(Number(fieldDetails.DeuFieldValue)));
                } else {
                  item['controls']['DefaultValue'].setValue(fieldDetails.DeuFieldValue);
                }
                // }

              }
            });
          });
        }
      });
    }
  }
  /*
     CreatedBy:AcmeMinds
     CreatedOn:04-Feb-2020
     Purpose:Getting the  fields based on template Id
     */
  GetTemplateData(): void {
    this.nextUniqueIdentifierTabIndex = '';
    this.dateForComparision.splice(0, this.dateForComparision.length);
    this.isPostStartDisabled = true;
    const postData = {
      'payorId': this.StatementInfoGroup.controls.PayorId.value,
      'templateId': this.StatementInfoGroup.controls.TemplateId.value
    };
    postData['URL'] = 'DEUGetTemplateDetails';
    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      this.payorToolObject = response.PayorToolObject;
      if (response.PayorToolObject && response.PayorToolObject.ToolFieldList.length > 0) {
        this.primaryKeyName = response.uniqueIDs;
        this.OnCreateFormArray(response.PayorToolObject);
      } else {
        this.dEUFormFieldsArray.controls.splice(0, this.dEUFormFieldsArray.controls.length);
      }
      this.savePostRecordField = JSON.parse(JSON.stringify(this.dEUFormFieldsArray.getRawValue()));
	  this.OnStatementCheckAmountImageRender();
    });
  }
  OnStatementCheckAmountImageRender(): void {
    this.statementImage = this.payorToolObject.StatementImageFilePath ?
      this.payorToolObject.StatementImageFilePath.replace(/ /g, '%20') : '';
    this.statementImage = this.statementImage ? ServerURLS.PayorToolImageDownload + this.statementImage : '';
    this.checkAmountImage = this.payorToolObject.ChequeImageFilePath ?
      this.payorToolObject.ChequeImageFilePath.replace(/ /g, '%20') : '';
    this.checkAmountImage = this.checkAmountImage ? ServerURLS.PayorToolImageDownload + this.checkAmountImage : '';
  }
  OnCreateFieldCss(fieldDetails: any): Object {
    const properties = {
      width: fieldDetails.ControlWidth + 'px',
      height: '20px',
      'font-size': '9px',
      'text-align': fieldDetails.AllignedDirection,
    };
    return properties;
  }
  OnCreateOuterFieldCss(fieldDetails: any): Object {
    const properties = {
      transform: `translate(` + fieldDetails.ControlX + 'px' + ',' + fieldDetails.ControlY + 'px' + `)`,
      width: fieldDetails.ControlWidth + 'px',
      height: fieldDetails.ControlHeight + 'px',
      'font-size': '9px',
      'margin-top': '-19px',
      'font-weight': 700,
    };
    return properties;
  }
  OnCreateFormArray(payorToolObject: any): void {
    if (this.dEUFormFieldsArray.controls.length > 1) {
      this.dEUFormFieldsArray.controls.splice(0, this.dEUFormFieldsArray.controls.length);
    }
    payorToolObject.ToolFieldList.forEach(item => {
      item.CssProperties = this.OnCreateFieldCss(item);
      item.OuterCssProperties = this.OnCreateOuterFieldCss(item);
      item.IsValidFeldValue = true;
      item.DefaultFieldValueList = item.DefaultValue;
      this.dEUFormFieldsArray.push(this.OnCreateFormGroup(item));
    });

  }
  OnCreateFormGroup(data: any): FormGroup {
    const keys = Object.keys(data);
    let group: FormGroup;
    group = this.fb.group({});
    keys.forEach(keyName => {
      if (keyName === 'DefaultValue') {
        group.addControl(keyName, this.fb.control(data[keyName], [Validators.required]));
      } else {
        group.addControl(keyName, new FormControl(data[keyName]))
      }
    });
    return group;
  }
  // ##########################################################################################################################
  OnValidateFormFieldValue(data: any, index: number, fieldValue: any): void {//;
    this.isPostStartDisabled = this.OnFieldMarkAsDirty(data, index);
    this.OnValidateDEUMaskFieldValues(data, fieldValue);
    this.tabIndexNumber = index + 1;
	
    //Code to set the field value in selected policy list object as well, so that
    // it is not lost on focus function [ALT/Tab scenario]
    if(this.selectedPolicyLearnedFields.searchedPolicyList){
      const mapTolearnedFields: LearnedFieldsDetails = new LearnedFieldsDetails();
      let fieldName = mapTolearnedFields.MapLearnedFieldToText(data.controls.EquivalentLearnedField.value);
      if(this.selectedPolicyLearnedFields.searchedPolicyList[fieldName])
      {
      if(fieldName === 'CompTypeId')
      {
        this.selectedPolicyLearnedFields.searchedPolicyList[fieldName] = mapTolearnedFields.GetCompTypeID(data.controls.DefaultValue.value);
      }
      else if(fieldName === 'PolicyModeId')
      {
        this.selectedPolicyLearnedFields.searchedPolicyList[fieldName] = mapTolearnedFields.GetPolicyModeID(data.controls.DefaultValue.value);
      }
      else{
        this.selectedPolicyLearnedFields.searchedPolicyList[fieldName] = data.controls.DefaultValue.value;
      }
      }	
    }
    
    if (data.controls.IsPartOfPrimaryKey.value && data.controls.DefaultValue.value) {
      //   this.dEUFormFieldsArray.disable();
      //debugger;
      // // console.log('setEnableDataFields Call 1 for Disabled');
      this.setEnableDataFields(false);
      this.OnGettingPolicyUniqueIdentifiers(data, fieldValue);
    }

    const dirtyFieldCount = 0;
  }
  OnValidateDEUMaskFieldValues(data: any, fieldValue: any): void {
    if (data.controls.DEUMaskFieldType.value.DEUMaskTypeId == 2) {
      const result = data.controls.DefaultValue.value ? Number(data.controls.DefaultValue.value) : 0;

      if (!((result - Math.floor(result)) !== 0)) {
        data.controls.DefaultValue.setValue(result.toFixed(2));
      }
    } else if (data.controls.DEUMaskFieldType.value.DEUMaskTypeId === 1 && data.controls.DefaultValue.value) {
      const value = fieldValue.target.value;
      this.OnValidateDateField(data, value, data.controls.DEUMaskFieldType.value.MaskFieldType);

    }
  }
  // Createdby:Ankit khandelwal
  // Createdon:20/05/2020
  // Purpose:Validate all form Fields
  OnValidateDateField(data: any, date: any, format: any): void {
    this.isPostStartDisabled = true;
    const postData = {
      'date': date,
      'format': format
    };
    postData['URL'] = 'ValidateDateFieldService';
    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        data.controls.IsValidFeldValue.setValue(response.IsDateValid);
        if (data.controls.IsValidFeldValue.value) {

          const dateObject = {
            'AvailableFieldName': data.controls.AvailableFieldName.value,
            'DefaultValue': response.FormattedDate
          };
          const isRecordExist = this.dateForComparision.find(item => item.AvailableFieldName == dateObject.AvailableFieldName);
          if (!isRecordExist && response.FormattedDate) {
            this.dateForComparision.push(dateObject);
          } else {
            const recordIndex = this.dateForComparision.findIndex(item => item.AvailableFieldName == dateObject.AvailableFieldName);
            this.dateForComparision[recordIndex].DefaultValue = dateObject.DefaultValue;
          }

          // // console.log('validate date:' + date);
          data.controls.DefaultValue.setValue(date);
        }
      } else {
        this.toaster.error('Exception occurs while converting date.');
      }
    });
  }
  OnFieldMarkAsDirty(data: any, fieldIndex: any): Boolean {
    this.toolTipText = '';
    let isFieldInValid: Boolean = false;
    let count = 1;
    this.dEUFormFieldsArray.controls.forEach((item, index) => {
      if (data['controls']['AvailableFieldName'].value !== item['controls']['AvailableFieldName'].value) {
        item['controls']['DefaultValue'].markAsPristine({ onlyself: true });
      }
      if (count === 1) {
        if (this.dEUFormFieldsArray.controls[index]['controls']['DefaultValue'].errors &&
          this.dEUFormFieldsArray.controls[index]['controls']['DefaultValue'].errors.required) {
          this.dEUFormFieldsArray.controls[index]['controls']['DefaultValue'].markAsDirty({ onlyself: true });
          count += count;
          isFieldInValid = true;
        }
      }
    });

    this.dEUFormFieldsArray.controls.forEach((item, index) => {
      if (item['controls']['DEUMaskFieldType'].value.DEUMaskTypeId === 1 && item['controls']['IsValidFeldValue'].value === false) {
        this.toolTipText = 'Please enter valid' + ' ' + item['controls']['LabelOnField'].value + '.';
        isFieldInValid = true;
      } else if (item['controls']['DEUMaskFieldType'].value.DEUMaskTypeId === 2) {
        if (!item['controls'].IsZeroorBlankAllowed.value) {
          if (item['controls'].DefaultValue.value && Number(item['controls'].DefaultValue.value) === 0) {
            this.toolTipText = item['controls']['LabelOnField'].value + ' ' + 'cannot be blank or zero';
            isFieldInValid = true;
          }
        }
      }
    });
    if (this.dateForComparision.length > 1 && isFieldInValid === false) {
      const effectiveDateindex = this.dateForComparision.findIndex(field => field.AvailableFieldName === 'EffectiveDate');
      const invoiceDateindex = this.dateForComparision.findIndex(field => field.AvailableFieldName === 'InvoiceDate');
      const effectiveDate = new Date(this.dateForComparision[effectiveDateindex].DefaultValue);
      const invoiceDate = new Date(this.dateForComparision[invoiceDateindex].DefaultValue);
      if (effectiveDate > invoiceDate) {
        isFieldInValid = true;
        this.toolTipText = 'Effective date cannot be greater than Invoice date.';

      }
    }
    // } else if (!this.dEUFormFieldsArray.controls[index]['controls']['DefaultValue'].valid) {
    //   // // // console.log('invalid');
    // }
    return isFieldInValid;
  }
  // *************************************************************************************************  */
  OnGettingPolicyUniqueIdentifiers(fieldDetails: any, event: any = ''): any {
    this.isLearnFieldResponseOccur = false;
    this.nextUniqueIdentifierTabIndex = fieldDetails.value.FieldOrder + 1;
    const uniqueIdentifiers = [];
    this.dEUFormFieldsArray.controls.forEach(item => {
      if (item.value.IsPartOfPrimaryKey) {
        uniqueIdentifiers.push({
          'ColumnName': item.get('AvailableFieldName').value,
          'Text': item.get('DefaultValue').value,
          'MaskedText': item.get('DEUMaskFieldType').value.MaskFieldType
        });
      }
    });

    this.paymentDetails.policyUniqueIdentifier = uniqueIdentifiers;
    this.paymentDetails.isResetbuttonClick = false;
    this.paymentDetails.isNewStatementCreate = false;
    this.PostedPaymentData.emit({ DEUFieldDetails: this.paymentDetails });
    // let fieldIndex = 0;
    // this.inputs.filter((item: any, index: number): any => {
    //   if (item['nativeElement'] && item['nativeElement'].tabIndex === this.nextUniqueIdentifierTabIndex) {
    //     fieldIndex = index;
    //   }
    // });
    // const intervalTime = setInterval(() => {

    //   if (this.isLearnFieldResponseOccur) {
    //     // console.log('clearInterval');
    //     clearInterval(intervalTime);
    //     this.FocusOnCalculateFormula(this.dEUFormFieldsArray.controls[fieldDetails.value.FieldOrder], fieldDetails.value.FieldOrder);
    //   } else {
    //     this.inputs.toArray()[fieldIndex].nativeElement.focus();
    //   }
    // });

  }
  /* 
  CreatedBy:Ankit Khandelwal
  CreatedOn:04/05/2020
  Purpose:Calculate Formula Field Value 
  */
  FocusOnCalculateFormula(data: any, index: Number): void {
    // // console.log('FocusOnCalculateFormula');
    this.fieldHelpText = data.controls.HelpText.value;
    this.dEUFormFieldsArray.controls.forEach((item, fieldindex) => {
      if (index !== fieldindex) {
        this.dEUFormFieldsArray.controls[fieldindex]['controls']['DefaultValue'].markAsPristine({ onlyself: true });
      }
    });
    if (data.controls.IsCalculatedField.value) {
      let formulaExpression = data.controls.FormulaExpression.value;
      const formulaArray = data.controls.FormulaExpression.value.split(/[-!$%^&*/()+|~=`{}[:;<>?,.@#\]]/g);
      if (formulaArray.length > 0) {
        formulaArray.forEach(keyName => {
          this.dEUFormFieldsArray.controls.forEach(item => {
            const fieldValue = item['controls'].AvailableFieldName.value;
            if (keyName === fieldValue) {
              const valueForReplaced = item['controls'].DefaultValue.value ? item['controls'].DefaultValue.value : 0;
              formulaExpression = formulaExpression.replace(keyName, valueForReplaced);
            }
          });
        });
      }

      this.APICallToCalculateFormula(formulaExpression, data);
    }
    this.OnAutoPopulateValue(data);
  }
  OnAutoPopulateValue(data: any): void {
    if (data.controls.IsPopulateIfLinked.value && this.selectedPolicyLearnedFields.searchedPolicyList
      && data.controls.DefaultValue.value !== this.selectedPolicyLearnedFields.searchedPolicyList) {
      const mapTolearnedFields: LearnedFieldsDetails = new LearnedFieldsDetails();
      const value = mapTolearnedFields.MapTextToLearnedField(data.controls.EquivalentLearnedField.value,
        this.selectedPolicyLearnedFields.searchedPolicyList);
      if (data.controls.EquivalentLearnedField.value === 'Effective' && data.controls.DefaultValue.value) {
        this.OnValidateDateField(data, data.controls.DefaultValue.value, data.controls.DEUMaskFieldType.value.MaskFieldType);
      } else {
        data.controls.DefaultValue.setValue(value);
      }
	//  this.savePostRecordField = JSON.parse(JSON.stringify(this.dEUFormFieldsArray.getRawValue()));
    }
  }
  APICallToCalculateFormula(formulaExpression: any, selectedFieldDetails: FormGroup): void {
    this.showLoader = true;
    const postData = {
      'expression': formulaExpression
    };
    postData['URL'] = 'FetchTestFormulaResult';
    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showLoader = false;
        const result = response.Result ? Number(response.Result).toFixed(2) : response.Result;
        selectedFieldDetails.controls.DefaultValue.setValue(result);
      }
    });
  }


  OnPostReset(): void {
    this.savePostRecordField = JSON.parse(JSON.stringify(this.dEUFormFieldsArray.getRawValue()));
    // // // console.log('Inside OnPostReset');
    this.paymentDetails.policyUniqueIdentifier = undefined;
    this.dEUFormFieldsArray.controls.forEach(item => {
      if (item['controls']['DefaultFieldValueList'].value) {
        item['controls']['DefaultValue'].setValue(item['controls']['DefaultFieldValueList'].value);
      } else {
        item['controls']['DefaultValue'].setValue('');
        item['controls']['DefaultValue'].markAsPristine({ onlyself: false });
      }
    });
    if (this.dEUFormFieldsArray.controls.length > 0) {
      this.dEUFormFieldsArray.controls[this.dEUFormFieldsArray.controls.length - 1]
      ['controls'].DefaultValue.setValue(Guid.createEmpty().toJSON().value);
    }
    // this.paymentDetails.isResetbuttonClick = true;
    this.PostedPaymentData.emit({ DEUFieldDetails: this.paymentDetails });
    this.dataEntryUnitSvc.buttonText = 'Start Edit';
    this.isPostStartDisabled = true;
    this.setEnableDataFields(true); // In case filds remain disabled due to any unforeseen exception 
  }
  OnValidateFields(): Boolean {
    // // // console.log('Inside OnValidateFields');

    let isPostStartValid: Boolean = true;
    if (!this.StatementInfoGroup.controls.PayorId.value || !this.StatementInfoGroup.controls.PayorName.value) {
      this.toaster.error('Please select Payor Name.');
      isPostStartValid = false;
    }
    if (!this.StatementInfoGroup.controls.StatementId.value ||
      (this.StatementInfoGroup.controls.StatementId.value === Guid.createEmpty().toJSON().value)) {
      this.toaster.error('Please select statement number.');
      isPostStartValid = false;
    }
    if (!this.StatementInfoGroup.controls.BatchId.value ||
      (this.StatementInfoGroup.controls.BatchId.value === Guid.createEmpty().toJSON().value)) {
      this.toaster.error('Please select statement number.');
      isPostStartValid = false;
    }
    if (this.StatementInfoGroup.controls.StatementStatusId.value === 2) {
      this.toaster.error(`Statement# ` + this.StatementInfoGroup.controls.StatementNumber.value
        + ` is closed and payment entry cannot be made in closed statement.`);
      isPostStartValid = false;

    }
    for (const item of this.dEUFormFieldsArray.controls) {
      if (item.value.DEUMaskFieldType.DEUMaskTypeId === 2) {
        const value: any = parseInt(item.value.DefaultValue, 10).toString();

        //  value = (parseInt(value.replace(/,/g, ''), 10)).toString();
        if (value.length > 11) {
          this.toaster.error('Invalid amount entered in ' + `'` + item.value.LabelOnField + `'` + ' ' + 'field');
          isPostStartValid = false;
          break;

        }
      }
    }
    // // // console.log('Inside OnValidateFields completed');
    return isPostStartValid;
  }



  OnCreateDEUFieldObject(): DEUFormField {
    const deuObject: DEUFormField = new DEUFormField();
    deuObject.BatchId = this.StatementInfoGroup.controls.BatchId.value;
    deuObject.BatchIdField = this.StatementInfoGroup.controls.BatchId.value;
    deuObject.CurrentUser = this.userDetails.UserCredentialID;
    deuObject.CurrentUserField = this.userDetails.UserCredentialID;
    deuObject.DeuEntryId = Guid.createEmpty().toJSON().value;
    deuObject.DeuEntryIdField = Guid.createEmpty().toJSON().value;
    deuObject.DeuFieldDataCollection = this.OnCreateDeuFieldDataCollection();
    deuObject.DeuFieldDataCollectionField = {};
    deuObject.LicenseeId = this.userDetails.LicenseeId;
    deuObject.LicenseeIdField = this.userDetails.LicenseeId;
    deuObject.PayorId = this.StatementInfoGroup.controls.PayorId.value;
    deuObject.PayorIdField = this.StatementInfoGroup.controls.PayorId.value;
    deuObject.ReferenceNo = 1;
    deuObject.ReferenceNoField = 1;
    deuObject.StatementId = this.StatementInfoGroup.controls.StatementId.value;
    deuObject.StatementIdField = this.StatementInfoGroup.controls.StatementId.value;
    deuObject.TemplateID = this.StatementInfoGroup.controls.TemplateId.value ===
      Guid.createEmpty().toJSON().value ? null : this.StatementInfoGroup.controls.TemplateId.value;
    deuObject.TemplateIDField = this.StatementInfoGroup.controls.TemplateId.value;
    return deuObject;
  }
  OnCreateDeuFieldDataCollection(): any {
    const list = [];
    this.dEUFormFieldsArray.controls.forEach(item => {
      const data: DeuFieldDataCollection = new DeuFieldDataCollection();

      if (item.value.DEUMaskFieldType.DEUMaskTypeId === 1 && this.dateForComparision.length > 0) {
        const index = this.dateForComparision.findIndex(field => field.AvailableFieldName === item.value['AvailableFieldName']);
        data.DeuFieldName = item.value['AvailableFieldName'];
        data.DeuFieldType = item.value.DEUMaskFieldType.DEUMaskTypeId;
        data.DeuFieldValue = this.dateForComparision[index].DefaultValue;
        data.DeuFieldMaskType = item.value.DEUMaskFieldType.MaskFieldType;

      } else {
        data.DeuFieldName = item.value['AvailableFieldName'];
        data.DeuFieldType = item.value.DEUMaskFieldType.DEUMaskTypeId;
        data.DeuFieldValue = item['controls'].DefaultValue.value;
        data.DeuFieldMaskType = item.value.DEUMaskFieldType.MaskFieldType;
      }
      list.push(data);
    });
    return list;
  }

  OnFocusChange(event: any, val: any, i: any, item1: any): any {
    // // console.log('hi i am focus fields');
   this.OnValidateFormFieldValue(item1, i, event);
   if (this.inputs.toArray().length !== val) {
      this.inputs.filter((item: any, index: number): any => {
        if (item['nativeElement'] && item['nativeElement'].tabIndex === val) {
          this.inputs.toArray()[index].nativeElement.focus();
        }
      });
    } else {
      //this.OnValidateFormFieldValue(item1, i, event);
      if (this.postButtonRef && !this.isPostStartDisabled) {
        this.postButtonRef['_elementRef'].nativeElement.focus();
      } else if (this.resetButton && this.isPostStartDisabled) {
        this.resetButton['_elementRef'].nativeElement.focus();
      }
    }
  }
  OnDeleteFieldValue(selectedField: any): void {
    selectedField.controls.DefaultValue.setValue('');
  }

  OnPostDEUEntry(): void {
    if (this.OnValidateFields()) {

      let isNewStatementCreate = false;
      if (this.StatementInfoGroup.controls.PaymentEntriesCount.value > 0 &&
        this.StatementInfoGroup.controls.PayorId.value !== this.StatementInfoGroup.controls.OldPayorId.value) {
        isNewStatementCreate = true;
      }
      if (isNewStatementCreate) {
        this.OnPostInNewStatement();
      } else {
        this.OnPostInSameStatement();
      }
      this.inputs.toArray()[0].nativeElement.focus();
    }
  }

  OnPostInNewStatement(): void {
    // // // console.log('In OnPostInNewStatement');
    this.showLoader = true;
    const deuEntryId = this.dEUFormFieldsArray.controls[this.dEUFormFieldsArray.controls.length - 1]
    ['controls'].DefaultValue.value;
    const postData = {
      '_PostEntryProcess': deuEntryId === Guid.createEmpty().toJSON().value ? 1 : 2,
      'deuFields': this.OnCreateDEUFieldObject(),
      deuEntryId: deuEntryId,
      userId: this.userDetails.UserCredentialID,
      userRole: this.userDetails.Role,
      URL: 'DEUPostStartWrapper',
      'isNewStatementCreate': true
    };
    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      // // // console.log('in post new stmt response');

      this.showLoader = false;
      this.isPostStartDisabled = true;
      this.paymentDetails.isNewStatementCreate = true;
      this.paymentDetails.newStatementNumber = response.PostStatus.StatementNumber;
      this.paymentDetails.policyUniqueIdentifier = null;
      this.OnPostReset();
      this.PostedPaymentData.emit({ DEUFieldDetails: this.paymentDetails });
      // // // console.log('in post new stmt response completed ');
    });
    //  }
  }

  // Posts the entry in same statement
  OnPostInSameStatement(): void {
    // // // console.log('in post same stmt start ');

    this.showLoader = true;
    let isUserOnsecondPage: Boolean = false;
    const deuEntryId = this.dEUFormFieldsArray.controls[this.dEUFormFieldsArray.controls.length - 1]
    ['controls'].DefaultValue.value;
    const isNewEntry = deuEntryId === Guid.createEmpty().toJSON().value ? true : false;
    // if(isNewEntry)
    // {
    //   this.dataEntryUnitSvc.isErrorListDEUEntry=false;
    // }

    if (this.dataEntryUnitSvc.paymentPageDetails &&
      this.dataEntryUnitSvc.paymentPageDetails.nextIndex !== 0 && isNewEntry) {
      // this.dataEntryUnitSvc.paymentPageDetails = '';
      // this.dataEntryUnitSvc.isFirstPaymentListFetch = false;
      // // // console.log('in post same stmt -  IsFirstPaymentIndexSelected');

      isUserOnsecondPage = true;
      this.dataEntryUnitSvc.isPaymentListRefresh = false;
      this.IsFirstPaymentIndexSelected.emit({ pageIndex: this.dataEntryUnitSvc.paymentPageDetails.nextIndex });
    }
    const objDEU = this.OnCreateDEUFieldObject();
    const postData = {
      'deuFields': objDEU,
      deuEntryId: deuEntryId,
      URL: 'PostDEUEntry',
      'isNewStatementCreate': false
    };
    // // // console.log('in post same stmt -  Sending 1st API request');

    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      if (ResponseCode.SUCCESS !== response.ResponseCode) {
        // // // console.log('in post same stmt -   1st API error response');

        this.showLoader = false;
        this.toaster.error(response.ExceptionMessage);
        if (response.ResponseCode === ResponseCode.RecordAlreadyExist) {
          return;
        } else {

          this.afterPostPaymentEntry.emit({
            'isNewEntry': isNewEntry,
            'oldDEUEntryId': deuEntryId,
            // case when old entry not editable message , shoudl not be set red , so true sent.
            // this flag required only for failure case and will tell if old entry was paid/semi-paid or not, hence to show red or not 
            'isSuccess': ResponseCode.SUCCESS === response.Failure ? false : true,
            // case when old entry not editable message , shoudl not be set red , so true sent.
            'isPaidEntry': ResponseCode.RecordAlreadyExist === response.Failure ? true : false
          });
        }
      } else {
        const entry = response.DEUEntry;
        this.paymentDetails.newStatementNumber = 0;
        this.paymentDetails.isNewStatementCreate = false;
        this.isPostStartDisabled = true;
        if (isUserOnsecondPage) {
          const timeout = setInterval(() => {
            if (this.dataEntryUnitSvc.isPaymentListRefresh) {
              this.dataEntryUnitSvc.postedEntryObject = {
                'DEUFieldDetails': entry,
                'EnteredAmount': response.enteredAmount,
                'isNewEntry': isNewEntry,
                'oldDEUEntryId': deuEntryId,
                'isSuccess': true
              };
              this.showLoader = false;
              this.isNewEntryPost.emit({ data: this.dataEntryUnitSvc.postedEntryObject });
              objDEU.DeuEntryId = entry.DEUENtryID;
              const postDataValue = {
                '_PostEntryProcess': isNewEntry ? 1 : 2,
                'deuFields': objDEU,
                'deuEntryId': deuEntryId,
                URL: 'ProcessPaymentEntry'
              };
              // // // console.log('in post same stmt -   2nd API request sending');

              this.sendAPIRequest.RequestSendsToAPI(postDataValue).subscribe(getresponse => {
                // // // console.log('in post same stmt -   2nd API response received');

                if (ResponseCode.SUCCESS !== response.ResponseCode) {
                  // // // console.log('in post same stmt -   2nd API response error');

                  this.toaster.error(response.ExceptionMessage);
                  // this.afterProcessPaymentEntry.emit();//to set processing flag back to false;
                } else {

                  if (getresponse.PostStatus) {
                    this.afterProcessPaymentEntry.emit({
                      EnteredAmount: getresponse.PostStatus.EnteredAmount,
                      IsSuccess: getresponse.PostStatus.IsSuccess,
                      deuEntryId: getresponse.PostStatus.DeuEntryId,
                      StatementStatusID: getresponse.PostStatus.StatementStatusID,
                      StatementStatusName: getresponse.PostStatus.StatementStatusName,
                      BatchStatusID: getresponse.PostStatus.BatchStatusID,
                      BatchStatusName: getresponse.PostStatus.BatchStatusName,
                      CompletePercent: getresponse.PostStatus.CompletePercent,
                      TemplateId: getresponse.PostStatus.TemplateId,
                      PayorId: getresponse.PostStatus.PayorId,
                      ErrorCount: getresponse.PostStatus.ErrorCount
                    });

                  } else {
                    this.toaster.error('An error occurred in posting payment. Please try again.');
                  }
                }
              });
              clearInterval(timeout);
            }
          }, 1000);

        } else {
          // // // console.log('in post same stmt -   isUseronsamePage');
          this.showLoader = false;
          this.afterPostPaymentEntry.emit({
            'DEUFieldDetails': entry,
            'EnteredAmount': response.enteredAmount,
            'isNewEntry': isNewEntry,
            'oldDEUEntryId': deuEntryId,
            'isSuccess': true
          });
          objDEU.DeuEntryId = entry.DEUENtryID;
          const postDataValue = {
            '_PostEntryProcess': isNewEntry ? 1 : 2,
            'deuFields': objDEU,
            'deuEntryId': deuEntryId,
            URL: 'ProcessPaymentEntry'
          };
          // // // console.log('in post same stmt -   2nd API request sending');

          this.sendAPIRequest.RequestSendsToAPI(postDataValue).subscribe(getresponse => {
            // // // console.log('in post same stmt -   2nd API response received');

            if (ResponseCode.SUCCESS !== response.ResponseCode) {
              // // // console.log('in post same stmt -   2nd API response error');
              this.toaster.error(response.ExceptionMessage);
              // this.afterProcessPaymentEntry.emit();//to set processing flag back to false;
            } else {

              if (getresponse.PostStatus) {
                this.afterProcessPaymentEntry.emit({
                  EnteredAmount: getresponse.PostStatus.EnteredAmount,
                  IsSuccess: getresponse.PostStatus.IsSuccess,
                  deuEntryId: getresponse.PostStatus.DeuEntryId,
                  StatementStatusID: getresponse.PostStatus.StatementStatusID,
                  StatementStatusName: getresponse.PostStatus.StatementStatusName,
                  BatchStatusID: getresponse.PostStatus.BatchStatusID,
                  BatchStatusName: getresponse.PostStatus.BatchStatusName,
                  CompletePercent: getresponse.PostStatus.CompletePercent,
                  TemplateId: getresponse.PostStatus.TemplateId,
                  PayorId: getresponse.PostStatus.PayorId,
                  ErrorCount: getresponse.PostStatus.ErrorCount
                });

              } else {
                this.toaster.error('An error occurred in posting payment. Please try again.');
              }
            }
          });
        }

      }
    });

    this.OnPostReset();
  }
  OnLastFieldTabPress(event: any, val: any, i: any, item1: any): void {
	this.OnValidateFormFieldValue(item1, i, event);
    if (this.inputs.toArray().length === val
    && this.isPostStartDisabled) {
    let fieldIndex = 0;
    this.inputs.filter((item: any, index: number): any => {
     
      if (item['nativeElement'] && item['nativeElement'].tabIndex === val) {
        fieldIndex = index;
      }
    });
    const intervalTime = setInterval(() => {
      if (!this.showLoader) {
        clearInterval(intervalTime);
        //this.OnValidateFormFieldValue(item1, i, event);
        if (this.postButtonRef && !this.isPostStartDisabled) {
          this.postButtonRef['_elementRef'].nativeElement.focus();
        }
      } else {
        
        this.inputs.toArray()[fieldIndex].nativeElement.focus();
      }
    });

  }
  }
  OnUndoPreviousValue(index: any, event: any, tabIndex: any): any {
    event.preventDefault();
    //debugger;
    if (this.savePostRecordField &&
      this.savePostRecordField[index]   //&&
      // (!this.dEUFormFieldsArray.controls[index]['controls'].DefaultValue.value ||
        //Number(this.dEUFormFieldsArray.controls[index]['controls'].DefaultValue.value) === 0
        //)
        ) 
      {
      this.dEUFormFieldsArray.controls[index]['controls'].DefaultValue.setValue(this.savePostRecordField[index].DefaultValue);

    }
  }
  OnPostResetConfirmation(): void {

    const dilogref = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Reset fields',
        subTitle: 'Are you sure you want to reset  all form fields?'
      },
      width: '400px'
    });
    dilogref.afterClosed().subscribe(result => {
      if (result) {
        this.OnPostReset();
      }
    });
  }

 /* processKeyPress(event, index, item, order): void {
     // console.log(event.key + ' , alt key: '  + event.altKey);
      switch(event.key){
       case 'alt':
          // console.log('alt pressed');
          break;
       case 'enter':
          this.OnFocusChange(event,order+1,index,item);
          break;
       case 'delete':
          this.OnDeleteFieldValue(item) ;
          break;
       case 'Tab':
        // console.log('tab pressed');
          if(event.altKey === false){
            this.OnValidateFormFieldValue(item,index,event)
            this.OnLastFieldTabPress($event,item.controls.FieldOrder.value,i,item)
          }
          break;
       case 'z':
          break;
       default:
          break;


      }
  }*/
}
