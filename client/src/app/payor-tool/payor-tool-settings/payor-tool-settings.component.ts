import { PayorData } from './../../config-manager/edit-payor/payorData.model';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpRequest, HttpEventType, HttpResponse, HttpClient } from '@angular/common/http'
import { FileDownloadService } from '../../_services/file-download.service'
import { CommonDataService } from '../../_services/common-data.service'
import { PayorToolService } from './../payor-tool.service';
import { ResponseCode } from './../../response.code';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { CdkDragDrop, CdkDragEnd, CdkDragMove, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { AddFieldComponent } from '../add-field/add-field.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { PayorTooldata } from './../payor-tool-data';
import { Guid } from 'guid-typescript';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerURLS } from './../../../assets/config/CONSTANTS';
import { TestFormulaComponent } from '../test-formula/test-formula.component';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';

@Component({
  selector: 'app-payor-tool-settings',
  templateUrl: './payor-tool-settings.component.html',
  styleUrls: ['./payor-tool-settings.component.scss']
})
export class PayorToolSettingsComponent implements OnInit {
  @ViewChild('FormulaExpression', { static: true }) FormulaExpression: ElementRef
  // ----------------------- Initalization of payorList and template list with dropdowns variables---------------------------------
  templateList: any = [];
  PayorList: any = [];
  postData: any;
  payorName: string = "";
  payorId: string = "";
  selectedTemplateName = new FormControl('', {});
  fieldList: any = [];
  selectedItemList: any = [];
  selectedfield: any;
  isdragStart: boolean = false;
  tabOrderList: any = [];
  selectedTemplateDetails: any;
  isResized: boolean = false;
  selectedIndex: any;
  formulaFields: any = ['100', '+', '-', '*', '/', '(', ')'];
  moduleName: any = 'Payor Tool Settings';
  image: any = './assets/download.png';
  pagename: any = 'Payor Name:';

  // ##############################################################################################################################
  file: any = "";
  todo: any;
  statementImage: any = '';

  checkAmountImage: any;
  fileType: any;
  percentDone: any = 0;
  isFileValid: Boolean = false;
  isValidationShown: Boolean = false;
  isValidationShownCheckImage: Boolean = false;
  validationMessage: any;
  showLoader: any = true;
  selectedTemplateID: any;
  selectedTabField: any;


  // ##############################################################################################################################
  selectFieldList: any;
  selectFieldListArray: FormArray = new FormArray([]);
  selectedFieldListBuilder: FormGroup = new FormGroup({
    selectFieldListArray: new FormArray([])
  });
  formulaArray: FormArray = new FormArray([]);
  formulaFieldListBuilder: FormGroup = new FormGroup({
    formulaArray: new FormArray([])
  });
  maskFieldList: any = [];
  // ##############################################################################################################################
  constructor(
    private http: HttpClient,
    private fileService: FileDownloadService,
    private commonService: CommonDataService,
    public payorSvc: PayorToolService,
    private dialog: MatDialog,
    public router: Router,
    private getRouterParams: GetRouteParamtersService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i,
        value: i + 1
      }
      this.tabOrderList.push(data)
    }
  }
  // ****************************************************************************************************************** */
  ngOnInit() {
    this.getRouterParams.getparameterslist(this.activatedRoute);
    this.payorId = this.getRouterParams.payorId;
    //Replace spaces - as found after redirection and refresh in URL
    let name = this.getRouterParams.payorName.replace(/25/g, '');
    name = name.replace(/%20/g, ' ');
    this.payorName = name;
    this.selectedTemplateID = this.getRouterParams.templateId;
    this.GetTemplateList();
  }
  // ####################################################################################################################
  // ***************************************************************************************************************** */
  /*
  CreatedBy:AcmeMinds
  CreatedOn:04-Feb-2020
  Purpose:Getting List of Templates based on payor name
   */
  GetTemplateList() {
    this.postData = {
      'payorId': this.payorId
    }
    this.payorSvc.GetPayorTemplateList(this.postData).subscribe(response => {
      if (ResponseCode.SUCCESS === response.ResponseCode) {
        this.templateList = response.TotalRecords;
        if (!this.selectedTemplateID) {
          this.selectedTemplateID = response.TotalRecords[0].TemplateID;
        }
        this.selectedTemplateName.setValue(this.selectedTemplateID);
        this.payorSvc.GetFieldList('').subscribe(response => {
          this.fieldList = response.PayorToolFieldTypeList;
          this.GetTemplateData(this.selectedTemplateID);
        });
      }
    });
  }
  // ################################################################################################################ */
  // *****************************************************************************************************************/
  /*
  CreatedBy:AcmeMinds
  CreatedOn:04-Feb-2020
  Purpose:Getting the  fields based on template Id
  */
  GetTemplateData(templateId: any) {
    this.isValidationShown = false;
    this.showLoader = true;
    this.selectedFieldListBuilder = new FormGroup({
      selectFieldListArray: new FormArray([])
    });
    //this.statementImage = '';
    this.postData = {
      'payorId': this.payorId,
      'templateId': templateId.value ? templateId.value : templateId
    }
    this.payorSvc.GetTemplateData(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        // 
        if (response.PayorToolObject) {
          this.selectedTemplateDetails = response.PayorToolObject;
          if (response.PayorToolObject['ToolFields']) {
            this.selectedTabField = 0;
            this.OnInitalizeSelectedListArray(response.PayorToolObject['ToolFields']);
            this.GettingFormulaFieldList();
            let statementImagePath = ServerURLS.PayorToolImageDownload + response.PayorToolObject['WebDevStatementImageFilePath'];
            let checkAmountImagePath = ServerURLS.PayorToolImageDownload + response.PayorToolObject['WebDevChequeImageFilePath'];
            if (response.PayorToolObject['WebDevStatementImageFilePath']) {

              this.ImageDownloadFromServer(statementImagePath, 'Statement');
            }
            if (response.PayorToolObject['WebDevChequeImageFilePath']) {
              //checkAmountImagePath = checkAmountImagePath.replace(/ /g, "%20");
              this.ImageDownloadFromServer(checkAmountImagePath, 'CheckAmount');
            }

          }
          this.refreshFieldList();
        } else {
          this.checkAmountImage = '';
          this.statementImage = '';
          this.fieldList.map(item => {
            item.Disabled = false;
          });
        }

      }
      this.showLoader = false;
      this.DisableSelectedFieldListFields();
    });
  }
  OnInitalizeSelectedListArray(data: any): void {
    data.forEach((value, index) => {
      const FieldProperties = new FormGroup({
        AllignedDirection: new FormControl(value['AllignedDirection']),
        AvailableFieldName: new FormControl(value['AvailableFieldName']),
        CalculationFormula: new FormControl(value['CalculationFormula']),
        ControlWidth: new FormControl(value['ControlWidth']),
        ControlHeight: new FormControl(value['ControlHeight']),
        ControlX: new FormControl(value['ControlX']),
        ControlY: new FormControl(value['ControlY']),
        CssProperties: new FormControl(''),
        DefaultValue: new FormControl(value['DefaultValue']),
        Disabled: new FormControl(value['Disabled']),
        EquivalentDeuField: new FormControl({ value: value['EquivalentDeuField'], disabled: true }),
        EquivalentIncomingField: new FormControl({ value: value['EquivalentIncomingField'], disabled: true }),
        EquivalentLearnedField: new FormControl({ value: value['EquivalentLearnedField'], disabled: true }),
        FieldOrder: new FormControl(value['FieldOrder']),
        FieldStatusValue: new FormControl(value['FieldStatusValue']),
        FieldValue: new FormControl(value['Fi-eldValue']),
        FormulaId: new FormControl(value['FormulaId']),
        FormulaExpression: new FormControl(value['CalculationFormula']),
        HelpText: new FormControl(value['HelpText']),
        TemplateID: new FormControl(value['TemplateID']),
        IsPartOfPrimaryKey: new FormControl(value['IsPartOfPrimaryKey']),
        IsOverrideOfCalcAllowed: new FormControl(value['IsOverrideOfCalcAllowed']),
        IsTabbedToNextFieldIfLinked: new FormControl(value['IsTabbedToNextFieldIfLinked']),
        IsPopulateIfLinked: new FormControl(value['IsPopulateIfLinked']),
        IsCalculatedField: new FormControl(value['IsCalculatedField']),
        IsZeroorBlankAllowed: new FormControl(value['IsZeroorBlankAllowed']),
        // IsRequired: new FormControl(value['IsRequired']),
        LabelOnField: new FormControl(value['LabelOnField']),
        MaskFieldTypeId: new FormControl(value['MaskFieldTypeId']),
        MaskFieldList: new FormControl(value['MaskFieldList']),
        MaskFieldType: new FormControl(value['MaskFieldType']),
        MaskText: new FormControl(value['MaskText']),
        PTAvailableFieldId: new FormControl(value['PTAvailableFieldId']),
        PayorFieldID: new FormControl(value['PayorFieldID']),
        PayorToolId: new FormControl(value['PayorToolId']),
        isFormulaExpressionValid: new FormControl(true),
        Formula: new FormGroup({
          formulaTitle: new FormControl(''),
          formulaExpressionArray: this.fb.array([])
        })
      });
      (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).push(FieldProperties);
      // 
      if (value.IsCalculatedField && value.CalculationFormula != null) {
        this.OnSetFormulaValues(value['CalculationFormula'], index);
      } else {
        this.OnPushFormulaFields();
      }

      this.OnPrimaryKeyClick(index);
      this.OnIsTabbedToNextFieldIfLinked(index);
      this.OnIsZeroorBlankAllowed(index);
      this.OnIsPopulateIfLinked(index);
      this.OnOverrideOfCalcAllowed(index);
      this.OnCalculatedField(index);
    });
    this.CreateControlPlacementStyle();
  }
  FormulaArrayCreate(data: any, selectedDropDownName: any): FormGroup {
    return this.fb.group({
      FormulaValue: new FormControl(selectedDropDownName)
    });
  }
  OnPushFormulaFields(): void {
    const details = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls;
    details[details.length - 1]['controls'].Formula.controls.formulaExpressionArray.push(this.FormulaArrayCreate('', ''));
  }

  OnSetFormulaValues(values, index) {
    const items = ((this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls)[index];
    items['controls'].Formula.controls.formulaTitle.setValue(values.FormulaTtitle)
    const formulaExpressionArray = items['controls'].Formula.get('formulaExpressionArray') as FormArray;
    const formulaInputArray = items['controls'].Formula.get('formulaInputArray') as FormArray;
    if (values.FormulaExpressionList) {
      values.FormulaExpressionList.forEach((data: any) => {
        formulaExpressionArray.push(this.fb.group({
          FormulaValue: new FormControl(data.FormulaValue)
        }));
      });
      formulaExpressionArray.push(this.fb.group({
        FormulaValue: new FormControl('')
      }));
    } else {
      formulaExpressionArray.push(this.fb.group({
        FormulaValue: new FormControl('')
      }));
    }

  }
  GettingFormulaFieldList() {
    this.formulaFields = ['+', '-', '*', '/', '(', ')'];
    const items = this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray;
    items.controls.forEach((records: FormGroup) => {
      this.formulaFields.push(records.value.AvailableFieldName);
    });
    if (!this.formulaFields.includes('100')) {
      this.formulaFields.push('100');
    }
  }
  ImageDownloadFromServer(data, imageName) {
    data = data.replace(/ /g, "%20");
    if (imageName === 'Statement') {
      this.statementImage = data;
    }
    else if (imageName === 'CheckAmount') {
      this.checkAmountImage = data;
    }
  }
  // #####################################################################################################################################
  CreateControlPlacementStyle() {
    const items = this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray;
    items.controls.forEach((records: FormGroup) => {
      const data = records.getRawValue();
      records.controls['CssProperties'].setValue(
        {
          'height': data.ControlHeight + 'px',
          'width': data.ControlWidth + 'px',
          'background-color': '#d4d1d1',
        }
      );
    });
  }
  // ************************************************************************************************************************************* */
  /*
  CreatedBy: Acmeminds,
  Purpose: Copy a control from field list to draggble list,
  CreatedOn: Feb 11, 2019 
  */
  DropFieldControl(event: CdkDragDrop<string[]>) {
    this.isdragStart = true;
    this.fieldList[event.previousIndex].Disabled = true;
    const list = [];
    const selectedControlData = this.fieldList[event.previousIndex];
    this.selectedfield = new PayorTooldata();
    this.selectedfield.PTAvailableFieldId = selectedControlData['FieldID'];
    this.selectedfield.PayorFieldID = Guid.create().toJSON().value;
    this.selectedfield.Disabled = true;
    this.selectedfield.AvailableFieldName = selectedControlData.FieldName;
    this.selectedfield.EquivalentDeuField = selectedControlData.EquivalentDeuField;
    this.selectedfield.EquivalentIncomingField = selectedControlData.EquivalentIncomingField;
    this.selectedfield.EquivalentLearnedField = selectedControlData.EquivalentLearnedField;
    this.selectedfield.FieldOrder = 0;
    this.selectedfield.MaskFieldList = selectedControlData.MaskFieldList;
    this.selectedfield.MaskFieldType = selectedControlData.MaskFieldType;
    this.selectedfield.MaskFieldTypeId = selectedControlData.MaskFieldList[0].maskFieldID;
    this.selectedfield.FieldStatusValue = 'Required';
    this.maskFieldList = selectedControlData.MaskFieldList;
    list.push(this.selectedfield);
    this.OnInitalizeSelectedListArray(list);
    this.CreateControlPlacementStyle();
    this.selectedTabField = this.selectedFieldListBuilder.get('selectFieldListArray')['controls'].length - 1;
    this.GettingFormulaFieldList();
  }
  // **************************************************************************************************************** */
  // ModifiedBy:Ankit Khandelwal
  // ModifiedOn:Feb22,2020
  // PUrpose:Change the controls structure
  OnMouseUp(event) {
    if (this.isdragStart) {
      let positionX = 0;
      let positionY = 0;
      if (event.layerX + 200 > 778 || event.layerY + 23 > 130) {
        positionX = positionY = 0;
      }
      else {
        positionX = event.layerX;
        positionY = event.layerY;
      }
      this.OnSetValueToControls('ControlX', positionX, this.selectedTabField);
      this.OnSetValueToControls('ControlY', positionY, this.selectedTabField);
      this.isdragStart = false;
    }
  }
  // ********************************************************************************************************************* */
  // CreatedBy:Ankit Khandelwal
  // CreatedOn:Feb22,2020
  // Purpose:disabled a fields from the drggable field list
  DisableSelectedFieldListFields() {
    const selectedItemList = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls;
    selectedItemList.forEach(element => {
      this.fieldList.map(data => {
        if (data.FieldName == element.value.AvailableFieldName) {
          data.Disabled = element.value.Disabled;
        }
      });
    });

  }
  OnSetValueToControls(controlName, value, index) {
    const selectedValues = this.selectedFieldListBuilder.get('selectFieldListArray')['controls'][index] as FormGroup
    selectedValues.controls[controlName].setValue(value);
  }
  // // **************************************************************************************************** */
  /*
  CreatedBy: Acmeminds,
  Purpose: delete a contorol from sleected field,
  CreatedOn: Feb 11, 2020
  */
  DeleteselectedField(data, index) {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls;
    if (selectedFieldListArray.length > 0) {
      selectedFieldListArray.splice(index, 1);
      this.selectedTabField = 0;
    }
    //Enable again in drag list
    this.fieldList.map(item => {
      if (item.FieldName == data.value.AvailableFieldName) {
        item.Disabled = false;
      }
    });
    //Remove if present in formula fields
    if (this.formulaFields && this.formulaFields.length > 0) {
      const idx = this.formulaFields.findIndex(item => item === data.value.AvailableFieldName);
      if (idx >= 0) {
        this.formulaFields.splice(idx, 1);
      }
    }

  }
  FieldDragEnd(event, index) {
    this.OnSetValueToControls('ControlX', event.x, index);
    this.OnSetValueToControls('ControlY', event.y, index);
  }
  OnResizeStop(event, index) {
    this.OnSetValueToControls('ControlWidth', Number(event.size.width), index);
    this.OnSetValueToControls('ControlHeight', Number(event.size.height), index);
  }
  OnDeleteField(item) {
    const dilogref = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Delete Field',
        subTitle: 'Are you sure you want to delete the selected field?'
      },
      width: '400px'
    });
    dilogref.afterClosed().subscribe(result => {
      if (result) {
        this.showLoader = true;
        let postdata = {
          'PyrToolAvalableFields': item
        }
        this.payorSvc.DeletePayorToolField(postdata).subscribe(response => {
          const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls;
          const index = selectedFieldListArray.findIndex(data => data.value.AvailableFieldName == item.FieldName);
          if (index > 0) {
            selectedFieldListArray.splice(index, 1);
            this.selectedTabField = 1;
          }
          this.refreshFieldList();
        });
      }
    });
  }
  // ************************************************************************************************************************************* */
  refreshFieldList() {
    //  this.isValidationShown=false;

    this.payorSvc.GetFieldList('').subscribe(response => {
      this.fieldList = response.PayorToolFieldTypeList;
      this.DisableSelectedFieldListFields();

      this.showLoader = false;
    });
  }
  // #####################################################################################################################################
  // ************************************************************************************************************************************* */
  OnAddingDraggableFields() {
    const dialogRef = this.dialog.open(AddFieldComponent, {
      data: {
        title: 'Add Field',
        fieldName: 'Field Name',
        type: 'Field',
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showLoader = true;
        this.refreshFieldList();
      }
    });
  }
  // #####################################################################################################################################
  /*
  CreatedBy:Ankit Khandelwal
  CreatedOn:Feb22,20202
  Purpose:Add a formula field in List 
  */
  // AddFormulaPrimaryFields(selectedFieldIndex) {
  //   const selectedItem = ((this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls)[selectedFieldIndex]['controls'];
  //   const formulaExpressionArray = selectedItem.Formula.get('formulaExpressionArray') as FormArray;
  //   if (formulaExpressionArray.length == 0) {
  //     formulaExpressionArray.push(this.FormulaArrayCreate(selectedItem.Formula.value.formulaPrimaryControl, ''));
  //     const formulaInputArray = selectedItem.Formula.get('formulaInputArray') as FormArray;
  //     formulaInputArray.push(this.FormulaArrayCreate(selectedItem.Formula.value.formulaPrimaryControl, ''));
  //     selectedItem.Formula.controls.formulaPrimaryControl.setValue('');
  //   }
  //   else if ((formulaExpressionArray.length > 0) && formulaExpressionArray.controls[formulaExpressionArray.controls.length - 1].value.LableName == '') {
  //     formulaExpressionArray.push(this.FormulaArrayCreate(selectedItem.Formula.value.formulaPrimaryControl, ''));
  //     const formulaInputArray = selectedItem.Formula.get('formulaInputArray') as FormArray;
  //     formulaInputArray.push(this.FormulaArrayCreate(selectedItem.Formula.value.formulaPrimaryControl, ''));
  //     selectedItem.Formula.controls.formulaPrimaryControl.setValue('');
  //   } else {
  //     selectedItem.Formula.controls.formulaPrimaryControl.setValue('');
  //   }
  // }
  // AddFormulaSecondryFields(selectedFieldIndex) {
  //   const selectedItem = ((this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls)[selectedFieldIndex]['controls'];
  //   const formulaExpressionArray = selectedItem.Formula.get('formulaExpressionArray') as FormArray;
  //   if (formulaExpressionArray.length == 0) {
  //     formulaExpressionArray.push(this.FormulaArrayCreate(selectedItem.Formula.value.formulaSecondryControl, 'OperatorName'));
  //     selectedItem.Formula.controls.formulaSecondryControl.setValue('');
  //   }
  //   else if ((formulaExpressionArray.length > 0) && ((formulaExpressionArray.controls[formulaExpressionArray.controls.length - 1].value.OperatorName == '') ||
  //     (selectedItem.Formula.value.formulaSecondryControl == '(') || (selectedItem.Formula.value.formulaSecondryControl == ')'))) {
  //     formulaExpressionArray.push(this.FormulaArrayCreate(selectedItem.Formula.value.formulaSecondryControl, 'OperatorName'));
  //     selectedItem.Formula.controls.formulaSecondryControl.setValue('');
  //   }
  //   else {
  //     selectedItem.Formula.controls.formulaSecondryControl.setValue('');
  //   }
  // }
  AddFormulaPrimaryFields(selectedFieldIndex: any, formulaArrayIndex: any, selectedValue: any): void {
    const selectedItem = ((this.selectedFieldListBuilder.get('selectFieldListArray') as
      FormArray).controls)[selectedFieldIndex]['controls'].Formula.controls;
    selectedItem.formulaExpressionArray.controls[formulaArrayIndex].controls.FormulaValue.setValue(selectedValue.value);
    if (selectedItem.formulaExpressionArray.controls.length === (formulaArrayIndex + 1)) {
      selectedItem.formulaExpressionArray.push(this.FormulaArrayCreate('', ''));
    }
  }
  RemoveFormula = (index: number): void => {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls[index];
    if (selectedFieldListArray['controls'].Formula.controls.formulaExpressionArray.controls.length > 0) {
      const selectedFieldControls = (selectedFieldListArray['controls'].Formula as FormGroup).controls;
      selectedFieldControls.formulaExpressionArray['controls'].splice(0, selectedFieldControls.formulaExpressionArray.value.length);
      selectedFieldControls.formulaExpressionArray['controls'].push(this.FormulaArrayCreate('', ''));
    }
  }
  // RemoveFormula(index) {
  //   const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls[index];
  //   if (selectedFieldListArray['controls'].Formula.controls.formulaExpressionArray.value.length > 0) {
  //     selectedFieldListArray['controls'].Formula.controls.
  //       formulaExpressionArray.controls.splice(0, selectedFieldListArray['controls'].Formula.controls.formulaExpressionArray.value.length);
  //     if (selectedFieldListArray['controls'].Formula.controls.
  //       formulaInputArray.value.length > 0) {
  //       selectedFieldListArray['controls'].Formula.controls.
  //         formulaInputArray.controls.splice(0, selectedFieldListArray['controls'].Formula.controls.formulaInputArray.value.length)
  //     }
  //   }
  // }

  // // ***************************************************UploadingFile**************************************************** */
  UploadAndProgress(files, selectedTab) {
    this.isValidationShownCheckImage = false;
    this.isValidationShown = false;
    this.isFileValid === false;
    if (files) {
      const allowFileType = ['jpg', 'png', 'jpeg'];
      this.file = files.currentTarget.files[0];
      this.fileType = this.file && this.file.name.substring(this.file.name.lastIndexOf('.') + 1);
      for (const fileTypeMatch of allowFileType) {
        if (fileTypeMatch == this.fileType) {
          this.isFileValid = true;
          break;
        }
      }
      if (this.isFileValid === false) {

        if (selectedTab === 'CheckAmount') {
          this.isValidationShownCheckImage = true;
          this.validationMessage = `Please Upload 'jpg', 'png', and 'jpeg' files only`;
        } else {
          this.isValidationShown = true;
          this.validationMessage = `Please Upload 'jpg', 'png', and 'jpeg' files only`;
        }
        return;
      } else if (this.file.size > 1000000) {

        if (selectedTab === 'CheckAmount') {
          this.isValidationShownCheckImage = true;
          this.validationMessage = 'Your File size exceeds the max limit';
          this.refreshFieldList();
        } else {
          this.isValidationShown = true;
          this.validationMessage = 'Your File size exceeds the max limit';
        }

      } else {
        this.SendFileToServer(this.file, selectedTab);
      }
    }
  }
  // #####################################################################################################################################
  SendFileToServer(files, selectedTab) {

    this.showLoader = true;
    const formData = new FormData();
    //  this.file = files.currentTarget.files[0];
    this.fileType = this.file.name.substring(this.file.name.lastIndexOf('.') + 1);
    const file = this.file;
    const key = 'uploadData';
    formData.append(key, file, this.file);
    formData.append('fileName', file, file.Name);
    const url = 'api/PayorTool/fileUpload'
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
    });
    this.http.request(req).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentDone = Math.round(100 * event.loaded / event.total);
        const downloadImagePath = ServerURLS.PayorToolImageDownload + file.name;
        this.ImageDownloadFromServer(downloadImagePath, selectedTab);
        this.showLoader = false;

      }

    });
  }
  // ***********************************************FormulaSectionControls********************************************* */
  SavePayorToolData() {
    this.showLoader = true;
    let list = [];
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls;
    let duplicateFieldOrderOccur = false;
    const fieldOrderlist = [];
    selectedFieldListArray.forEach((record: FormGroup) => {
      if (fieldOrderlist.includes(record.value.FieldOrder)) {
        duplicateFieldOrderOccur = true;
      }
      fieldOrderlist.push(record.value.FieldOrder);
      const PayorToolId = record.value.PayorToolId ?
        record.value.PayorToolId : selectedFieldListArray[0].value['PayorToolId'] ?
          selectedFieldListArray[0].value['PayorToolId'] : Guid.create().toJSON().value;
      list.push(this.OnSetDefaultFieldValues(record, PayorToolId));
    });
    if (duplicateFieldOrderOccur) {
      this.showLoader = false;
      this.DuplicateFieldOrderDialogBox();
      return;
    } else {
      let checkAmountImageName = null;
      let statementImage = null;
      if (this.checkAmountImage) {
        checkAmountImageName = this.checkAmountImage.replace(ServerURLS.PayorToolImageDownload, '')
        checkAmountImageName = checkAmountImageName.replace(/%20/g, " ")
      }
      if (this.statementImage) {
        statementImage = this.statementImage.replace(ServerURLS.PayorToolImageDownload, '')
        statementImage = statementImage.replace(/%20/g, " ")
      }
      const postdata = {

        payorTool: {
          'PayorToolId': list[0]['PayorToolId'],
          'ChequeImageFilePath': checkAmountImageName,
          'StatementImageFilePath': statementImage,
          'WebDevChequeImageFilePath': checkAmountImageName,
          'WebDevStatementImageFilePath': statementImage,
          'PayorID': this.getRouterParams.payorId,
          'TemplateID': this.getRouterParams.templateId,
          'Disabled': false,
          'ToolFields': list
        }
      }
      this.payorSvc.SavePayorToolData(postdata).subscribe(response => {
        this.showLoader = false;
        if (response.ResponseCode === ResponseCode.SUCCESS &&
          response['InValidFormulaExpressionList'] && response['InValidFormulaExpressionList'].length === 0) {
          this.OnPageRedirection();
          this.SavePayorToolOrderDialogBox();
        } else if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.OnValidateFormulaExpression(response['InValidFormulaExpressionList']);
        }
      });
    }
  }
  OnValidateFormulaExpression(inValidFormulaExpressionList: any): void {
    const data = this.selectedFieldListBuilder.get('selectFieldListArray')['controls'];
    data.forEach(items => {
      inValidFormulaExpressionList.forEach(formulaData => {
        if (items.controls.AvailableFieldName.value === formulaData.FieldsName) {
          items.controls.isFormulaExpressionValid.setValue(false);
        }
      });
    });
  }
  // ********************************************************************************************************************* */
  OnSetDefaultFieldValues(record, PayorToolId) {
    record.controls['PayorToolId'].setValue(PayorToolId)
    // record.controls['FieldStatusValue'].setValue(record.controls['IsRequired'].value ? 'Required' : 'Invisible');
    if (record.controls.IsCalculatedField.value) {
      record.controls['FormulaId'].setValue(record.controls['FormulaId'].value ? record.controls['FormulaId'].value : Guid.create().toJSON().value);
      record.controls['CalculationFormula'].setValue(this.OnGenerateFormulaExpression(record));
    }
    const data = record.getRawValue();
    data.Formula = null;
    data.CssProperties = null;
    data.MaskFieldList = null;
    return data;
  }
  // ******************************************************PartOfPrimaryKey******************************************************************************* */
  OnPrimaryKeyClick(index) {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls[index];
    if (selectedFieldListArray['controls'].IsPartOfPrimaryKey.value) {
      selectedFieldListArray['controls'].IsTabbedToNextFieldIfLinked.setValue(false);
      selectedFieldListArray['controls'].IsCalculatedField.setValue(false);
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.setValue(false);
      selectedFieldListArray['controls'].IsZeroorBlankAllowed.setValue(false);
      selectedFieldListArray['controls'].IsPopulateIfLinked.setValue(false);
      selectedFieldListArray['controls'].IsTabbedToNextFieldIfLinked.disable();
      selectedFieldListArray['controls'].IsCalculatedField.disable();
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.enable();
      selectedFieldListArray['controls'].IsZeroorBlankAllowed.disable();
      selectedFieldListArray['controls'].IsPopulateIfLinked.disable();
    } else {
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.setValue(false);
      selectedFieldListArray['controls'].IsTabbedToNextFieldIfLinked.disable();
      selectedFieldListArray['controls'].IsCalculatedField.enable();
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.disable();
      selectedFieldListArray['controls'].IsZeroorBlankAllowed.enable();
      selectedFieldListArray['controls'].IsPopulateIfLinked.enable();

    }
  }
  // // ******************************************************PopulatedIfLinked******************************************************************************* */
  OnIsPopulateIfLinked(index) {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls[index];
    if (selectedFieldListArray['controls'].IsPopulateIfLinked.value) {
      selectedFieldListArray['controls'].IsTabbedToNextFieldIfLinked.enable();
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.enable();
    } else {
      selectedFieldListArray['controls'].IsTabbedToNextFieldIfLinked.setValue(false);
      selectedFieldListArray['controls'].IsTabbedToNextFieldIfLinked.disable();
    }
  }

  // // ******************************************************TabbedToNextFields******************************************************************************* */
  OnIsTabbedToNextFieldIfLinked(index) {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls[index];
    selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.disable();
  }
  // // ******************************************************ZeroorBlankAllowed****************************************************************************** */
  OnIsZeroorBlankAllowed(index) {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls[index];
    if (selectedFieldListArray['controls'].IsZeroorBlankAllowed.value) {
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.disable();
      selectedFieldListArray['controls'].IsZeroorBlankAllowed.setValue(true);
    } else {
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.disable();
    }
  }
  // // ******************************************************OverrideOfCalculatedAllowed******************************************************************************* */
  OnOverrideOfCalcAllowed(index) {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls[index];
    if (selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.value) {
      selectedFieldListArray['controls'].IsTabbedToNextFieldIfLinked.disable();
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.setValue(true);
    }
    else {
      selectedFieldListArray['controls'].IsTabbedToNextFieldIfLinked.disable();
    }
  }
  // // ******************************************************CalculatedField******************************************************************************* */
  OnCalculatedField(index) {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls[index];
    if (selectedFieldListArray['controls'].IsCalculatedField.value) {
      selectedFieldListArray['controls'].IsTabbedToNextFieldIfLinked.disable();
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.enable();

    } else {
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.setValue(false);
      selectedFieldListArray['controls'].IsOverrideOfCalcAllowed.disable();
    }
  }
  OnGenerateFormulaExpression(record) {
    let formulaObject = null;
    let formulaExpression = '';
    if (record.controls.Formula.controls.formulaExpressionArray.controls.length > 1) {
      const list = [];
      record.controls.Formula.controls.formulaExpressionArray.controls.forEach(item => {
        list.push(item.value);
      });
      list.forEach(data => {
        formulaExpression = formulaExpression + data.FormulaValue;
      });
    }
    formulaObject = {
      'FormulaExpression': formulaExpression,
      'FormulaTtitle': record.value['Formula']['formulaTitle'],
      'FormulaID': record.value['FormulaId']
    }
    return formulaObject;
  }
  onTestFormulaDialog(testFormulaIndex) {
    const selectedFieldListArray = (this.selectedFieldListBuilder.get('selectFieldListArray') as FormArray).controls;

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
  /*  
  CreatedBy:Ankit Khandelwal
  CreatedOn:Feb25,20202
  Purpose:DuplicateFieldOrderDialogBox message shown 
  */
  DuplicateFieldOrderDialogBox() {
    const dilogref = this.dialog.open(SuccessMessageComponent,
      {
        width: '450px',
        data: {
          Title: 'Incorrect Field Order!',
          subTitle: 'Field order cannot be same for two fields in the list.',
          buttonName: 'ok',
          isCommanFunction: false
        },
        disableClose: true,
      });

  }
  /*
   CreatedBy:Ankit Khandelwal
    CreatedOn:Feb25,20202
    Purpose:Save PayorTool Success popup message 
    */
  SavePayorToolOrderDialogBox() {
    const dilogref = this.dialog.open(SuccessMessageComponent,
      {
        width: '450px',
        data: {
          Title: 'Payor Tool Settings',
          subTitle: ' Payor Tool Settings are saved successfully in the system',
          buttonName: 'ok',
          isCommanFunction: false
        },
        disableClose: true,
      });
    dilogref.afterClosed().subscribe(result => {


    });
  }
  // ***********************************************Cancel************************************************ */

  // *********************************************Method used for BreadCrumbs******************************************************* */
  OnPageRedirection() {
    this.router.navigate(['/payor-tool/payor-tool-listing', this.getRouterParams.pageSize, this.getRouterParams.pageIndex, this.payorId]);
  }

  // tslint:disable-next-line:max-file-line-count
}
