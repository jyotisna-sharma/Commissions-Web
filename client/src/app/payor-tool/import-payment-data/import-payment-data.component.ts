import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { CommonDataService } from '../../_services/common-data.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TestFormulaComponent } from '../test-formula/test-formula.component';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ImportPaymentData } from './../payor-tool-data';
import { ResponseCode } from '../../response.code';
import { Subject } from 'rxjs/Subject';
import { operators } from 'rxjs/Rx';
@Component({
  selector: 'app-import-payment-data',
  templateUrl: './import-payment-data.component.html',
  styleUrls: ['./import-payment-data.component.scss']
})
export class ImportPaymentDataComponent implements OnInit, AfterViewInit {
  avilableFieldList: any = [];
  selectedFieldIndex: Number;
  showLoader: Boolean = false;
  selectedFieldListArray: FormArray = new FormArray([]);
  selectedFieldListBuilder: FormGroup = new FormGroup({
    selectedFieldListArray: new FormArray([])
  });
  @Input() isTemplateChange: Subject<boolean> = new Subject();
  @Input() templateId: any;
  @Input() isSaveFinishButtonShown: boolean;
  formulaFieldList: any = ['100', 'CommissionPercentage', 'Client', 'PolicyNumber',
    'PaymentReceived', 'CommissionTotal', 'InvoiceDate', '+', '-', '*', '/', '(', ')'];
  constructor(
    public commonService: CommonDataService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public getRouterParams: GetRouteParamtersService,
    public activatedRoute: ActivatedRoute,
    public router: Router,

  ) { }
  ngOnInit(): void {
    this.showLoader = true;
    this.getRouterParams.getparameterslist(this.activatedRoute);
    this.GetAvailableFieldList();

  }
  ngAfterViewInit(): void {
    this.isTemplateChange.subscribe(result => {
      if (result) {
        const data = this.selectedFieldListBuilder.get('selectedFieldListArray')['controls'];
        data.splice(0, data.length);
        this.GetImportTemplatePaymentFieldDetails();
      }
    });


  }

  GetImportTemplatePaymentFieldDetails(): void {

    this.showLoader = true;
    const postData = {
      'payorId': this.getRouterParams.payorId,
      'templateId': this.templateId,
      'URL': 'GetImportToolPaymentDataFieldList'
    };
    this.commonService.RequestSendsToAPI(postData).subscribe(response => {
      if (response) {
        this.OnselectedFieldListBuilder(response.ImportToolPaymentSettingList);
        if (response.ImportToolPaymentSettingList.length > 0) {
          this.selectedFieldIndex = 0;
          this.DisableSelectedFieldListFields();
        } else {
          this.avilableFieldList.map(element => { element.Disabled = false; });
        }
        this.showLoader = false;
      }
    });
  }
  /*
   Createdby: Ankit Khandelwal
   CreatedOn: March 31, 2020
   purpose: Initaliza a formArray for controls 
   */
  OnselectedFieldListBuilder(data: any): void {
    data.forEach((value, index) => {
      const fieldListProperties = new FormGroup({
        ID: new FormControl(value['ID']),
        PayorID: new FormControl(value['PayorID']),
        TemplateID: new FormControl(this.templateId),
        PayorToolAvailableFeildsID: new FormControl(value['FieldsID']),
        FieldsID: new FormControl(value['FieldsID']),
        FieldsName: new FormControl(value['FieldsName']),
        Disabled: new FormControl(value['Disabled']),
        FixedColLocation: new FormControl(value['FixedColLocation']),
        FixedRowLocation: new FormControl(value['FixedRowLocation']),
        HeaderSearch: new FormControl(value['HeaderSearch']),
        RelativeColLocation: new FormControl(value['RelativeColLocation']),
        RelativeRowLocation: new FormControl(value['RelativeRowLocation']),
        PayorToolMaskFieldTypeId: new FormControl(value['PayorToolMaskFieldTypeId']),
        MaskFieldList: new FormControl(value['MaskFieldList']),
        MaskFieldType: new FormControl(value['MaskFieldType']),
        TransID: new FormControl(value['TransID']),
        TransName: new FormControl(value['TransName']),
        TranslateList: new FormControl(value['ImportToolTranslator']),
        strDefaultText: new FormControl(value['strDefaultText']),
        PartOfPrimaryKey: new FormControl(value['PartOfPrimaryKey']),
        CalculatedFields: new FormControl(value['CalculatedFields']),
        FormulaExpression: new FormControl(value['FormulaExpression']),
        isFormulaExpressionValid: new FormControl(true),
        className: new FormControl(''),
        Formula: new FormGroup({
          formulaTitle: new FormControl(''),
          formulaInputArray: this.fb.array([]),
          formulaExpressionArray: this.fb.array([])
        })

      });
      if (value['FieldsName'] === 'CommissionPercentage') {
        fieldListProperties.controls.TransID.enable();
        fieldListProperties.controls.TransID.setValue(value['ImportToolTranslator'][0].TransID);
      } else {
        fieldListProperties.controls.TransID.disable();
      }
      (this.selectedFieldListBuilder.get('selectedFieldListArray') as FormArray).push(fieldListProperties);
      if (value.CalculationFormula && value.CalculationFormula.FormulaExpressionList.length > 0) {
        value.CalculationFormula.FormulaExpressionList.forEach((formulaData: any, formulaIndex: any) => {
          this.OnPushFormulaFields(formulaData.FormulaValue);
        });
        this.OnPushFormulaFields('');
      } else {
        this.OnPushFormulaFields('');
      }

    });
  }
  /*
    Createdby: Ankit Khandelwal
    CreatedOn: March 31, 2020
    purpose: create a formulaArray for formula rendering
    */
  FormulaArrayCreate(selectedDropDownName: any): FormGroup {
    return this.fb.group({
      FormulaValue: new FormControl(selectedDropDownName)
    });
  }

  OnPushFormulaFields(data: string): void {
    const details = (this.selectedFieldListBuilder.get('selectedFieldListArray') as FormArray).controls;
    details[details.length - 1]['controls'].Formula.controls.formulaExpressionArray.push(this.FormulaArrayCreate(data));
  }


  /*
    Createdby: Ankit Khandelwal
    CreatedOn: March 31, 2020
    purpose: Getting a list of avilable fields
    */
  GetAvailableFieldList(): void {
    this.showLoader = true;
    const postData = {
      URL: 'GetImportToolAvilableFieldList'
    };
    this.commonService.RequestSendsToAPI(postData).subscribe(response => {
      if (response) {
        this.avilableFieldList = response['PayorToolFieldTypeList'];
        this.showLoader = false;
        this.GetImportTemplatePaymentFieldDetails();
      }
    });
  }
  /*
  Createdby: Ankit Khandelwal
  CreatedOn: March 31, 2020
  purpose: Move a item from available field to selected field
  */
  DropFieldInSelectedList(event: CdkDragDrop<string[]>): void {
    this.avilableFieldList[event.previousIndex].Disabled = true;
    const selectedControlData = this.avilableFieldList[event.previousIndex];
    const list = [];
    const listData: any = new ImportPaymentData();
    listData.PayorID = this.getRouterParams.payorId;
    listData.TemplateID = this.templateId;
    listData.FieldsID = selectedControlData['FieldID'];
    listData.FieldsName = selectedControlData['FieldName'];
    listData.MaskFieldList = selectedControlData.MaskFieldList;
    listData.MaskFieldType = selectedControlData.MaskFieldType;
    listData.PayorToolMaskFieldTypeId = selectedControlData.MaskFieldList[0].maskFieldID;
    listData.ImportToolTranslator = selectedControlData.ImportToolTranslator;
    listData.ID = 0;
    list.push(listData);
    this.OnselectedFieldListBuilder(list);
    this.selectedFieldIndex = this.selectedFieldListBuilder.get('selectedFieldListArray')['controls'].length - 1;
  }
  /*
  Createdby: Ankit Khandelwal
  CreatedOn: March 31, 2020
  purpose: Delete a selected item from selected field List
  */
  DeleteSelectedListItem(selectedRecordData: any, index: number): void {
    const data = this.selectedFieldListBuilder.get('selectedFieldListArray')['controls'];
    data.splice(index, 1);
    this.selectedFieldIndex = data.length - 1;
    this.avilableFieldList.map(item => {
      if (item.FieldName === selectedRecordData.value.FieldsName) {
        item.Disabled = false;
      }
    });
  }

  /*
   Createdby: Ankit Khandelwal
   CreatedOn: March 31, 2020
   purpose: Save the details of payment data setting
   */
  SaveImportToolPaymentData(buttonName: any): void {
    const isAllFieldValid = this.OnValidateSelectedFields();
    const list: any = [];
    if (isAllFieldValid) {
      this.showLoader = true;
      const data = this.selectedFieldListBuilder.get('selectedFieldListArray')['controls'];
      data.forEach(recordData => {
        if (recordData.controls.CalculatedFields.value &&  recordData.controls.Formula.controls.formulaExpressionArray.controls.length>1) {
          let list = [];
          recordData.controls.Formula.controls.formulaExpressionArray.controls.forEach(item => {
            list.push(item.value);
          });
          recordData.value.FormulaExpression = this.OnGenratingFormulaExpression(list, '');
        } else {
          recordData.value.FormulaExpression = '';
        }

        if (recordData.value.FieldsName === 'CommissionPercentage') {
          recordData.value.TranslateList.filter(item => {
            if (item.TransID === recordData.value.TransID) {
              recordData.value.TransName = item.Name;
            }
          });
        }
        list.push(recordData.value);
      });
      const postData = {
        'importToolPaymentDataList': list,
        URL: 'AddUpdateImportToolPaymentDataFields'
      };
      this.commonService.RequestSendsToAPI(postData).subscribe(response => {
        this.showLoader = false;
        if (response.ResponseCode === ResponseCode.SUCCESS && response['InValidFormulaExpressionList'].length === 0) {
          if (buttonName === 'save' && this.isSaveFinishButtonShown === false) {
            this.OnPageRedirection();
          } else if (buttonName == 'saveFinish') {
            this.OnPageRedirection();
          }

        } else if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.OnValidateFormulaExpression(response['InValidFormulaExpressionList']);
        }
      });
    }
  }
  OnValidateFormulaExpression(inValidFormulaExpressionList: any): void {
    const data = this.selectedFieldListBuilder.get('selectedFieldListArray')['controls'];
    data.forEach(items => {
      inValidFormulaExpressionList.forEach(formulaData => {
        if (items.controls.FieldsName.value === formulaData.FieldsName) {
          items.controls.className.setValue('border-red');
          items.controls.isFormulaExpressionValid.setValue(false);
        }
      });
    });
  }
  OnValidateSelectedFields(): Boolean {
    let isAllFieldValid = false;
    const data = this.selectedFieldListBuilder.get('selectedFieldListArray')['controls'];
    let TotalValidFieldsCount: Number = 0;
    data.forEach(items => {
      if (!items.controls.FixedColLocation.value && !items.controls.FixedRowLocation.value &&
        !items.controls.RelativeRowLocation.value && !items.controls.RelativeColLocation.value) {
        items.controls.className.setValue('border-red');
      } else {
        items.controls.className.setValue('green-box');
        TotalValidFieldsCount = Number(TotalValidFieldsCount) + 1;
      }
    });
    if (TotalValidFieldsCount === data.length) {
      isAllFieldValid = true;
    }
    return isAllFieldValid;
  }
  OnGenratingFormulaExpression(formulaExpressionList: any, labelName: any): string {
    if (labelName === 'shownExpression') {
      let formulaExprsn = '';
      formulaExpressionList.forEach(recordData => {
        formulaExprsn = formulaExprsn + recordData.controls.FormulaValue.value + '  ';
      });
      return formulaExprsn;
    } else {
      let formulaExprsn = '';
      formulaExpressionList.forEach(recordData => {
        formulaExprsn = formulaExprsn + recordData.FormulaValue;
      });
      return formulaExprsn;
    }
  }

  OnPageRedirection(): void {
    this.router.navigate(['/payor-tool/payor-tool-import-listing', this.getRouterParams.pageSize, this.getRouterParams.pageIndex,
      this.getRouterParams.payorId]);
  }


  /*
    Createdby: Ankit Khandelwal
    CreatedOn: March 31, 2020
    purpose: Adding a formula field dropdown
    */
  AddFormulaPrimaryFields(selectedFieldIndex: any, formulaArrayIndex: any, selectedValue: any): void {
    const selectedItem = ((this.selectedFieldListBuilder.get('selectedFieldListArray') as
      FormArray).controls)[selectedFieldIndex]['controls'].Formula.controls;
    selectedItem.formulaExpressionArray.controls[formulaArrayIndex].controls.FormulaValue.setValue(selectedValue.value);
    if (selectedItem.formulaExpressionArray.controls.length === (formulaArrayIndex + 1)) {
      selectedItem.formulaExpressionArray.push(this.FormulaArrayCreate(''));
    }
  }
  RemoveFormula = (index: number): void => {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectedFieldListArray') as FormArray).controls[index];
    if (selectedFieldListArray['controls'].Formula.controls.formulaExpressionArray.controls.length > 0) {
      const selectedFieldControls = (selectedFieldListArray['controls'].Formula as FormGroup).controls;
      selectedFieldControls.formulaExpressionArray['controls'].splice(0, selectedFieldControls.formulaExpressionArray.value.length);
      selectedFieldControls.formulaExpressionArray['controls'].push(this.FormulaArrayCreate(''));
    }
  }
  OnTestFormulaDialog(testFormulaIndex: any): void {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectedFieldListArray') as FormArray).controls;
    const data = (selectedFieldListArray[testFormulaIndex]['controls'].Formula).getRawValue();
    const dialogRef = this.dialog.open(TestFormulaComponent, {
      data: {
        title: 'Test Formula',
        formulaData: data['formulaExpressionArray'],
      },
      width: '450px',
      disableClose: true,
    });
  }
  // ********************************************************************************************************************* */
  // CreatedBy:Ankit Khandelwal
  // CreatedOn:April02,2020
  // Purpose:disabled a fields from the drggable field list
  DisableSelectedFieldListFields(): void {
    const selectedItemList = (this.selectedFieldListBuilder.get('selectedFieldListArray') as FormArray).controls
    selectedItemList.forEach(element => {
      this.avilableFieldList.map(data => {
        if (data.FieldName === element.value.FieldsName) {
          data.Disabled = element.value.Disabled;
        }
      });
    });
  }
  OnValidateFormulaFields(selectedValue: any, selectedItem: any, formulaArrayIndex: any): Boolean {
    let isValidValueSelected: Boolean = false;
    if (formulaArrayIndex >= 1) {
      const data = selectedItem['formulaExpressionArray']['controls'][formulaArrayIndex - 1]['controls']['FormulaValue'];
      const operatorsList = ['+', '-', '*', '/', '(', ')'];
      const TokenList = ['100', 'CommissionPercentage', 'Client', 'PolicyNumber',
        'PaymentReceived', 'CommissionTotal', 'InvoiceDate'];

      if (TokenList.includes(data.value) && TokenList.includes(selectedValue.value)) {
        return isValidValueSelected = false;
      } else if (operatorsList.includes(data.value) && operatorsList.includes(selectedValue.value)) {
        return isValidValueSelected = false;
      } else {
        return isValidValueSelected = true;
      }
    } else {
      return isValidValueSelected = true;
    }

  }
}
