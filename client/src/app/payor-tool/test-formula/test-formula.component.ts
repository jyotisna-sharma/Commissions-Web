import { ResponseCode } from './../../response.code';
import { PayorToolService } from './../payor-tool.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-test-formula',
  templateUrl: './test-formula.component.html',
  styleUrls: ['./test-formula.component.scss']
})
export class TestFormulaComponent implements OnInit {
  formulaArray: FormArray = new FormArray([]);
  formulaFieldListBuilder: FormGroup = null;
  FormulaEpressionResult: Number = 0;
  FormulaEpression: String = '';
  showloading: Boolean = false;
  isExpressionValid: Boolean = true;
  constructor(
    public dialogRef: MatDialogRef<TestFormulaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public payorToolSvc: PayorToolService
  ) { }

  ngOnInit() {
    this.CreateFormGroup(this.data.formulaData);
  }

  /* CreatedBy:Ankit Khandelwal
  CreatedON:Feb24,2020
  Purpose:Create a form group for shown value in dialogbox */

  CreateFormGroup(data: any) {
    this.formulaFieldListBuilder = new FormGroup({
      formulaArray: new FormArray([])
    });
    this.ChangeFormulaListData();

  }
  /* CreatedBy:Ankit Khandelwal
  CreatedON:Feb24,2020
  Purpose:Create a formula array */
  CreateFormulaArray(data: any) {
    const operatorList: any = ['+', '-', '*', '/', '(', ')'];
    return new FormGroup({
      OperatorName: new FormControl(operatorList.includes(data.FormulaValue) ? data.FormulaValue : ''),
      TokenName: new FormControl(data.FormulaValue === '100' ? '100' : ''),
      LableName: new FormControl(operatorList.includes(data.FormulaValue) ? '' : data.FormulaValue)
    });
  }
  ChangeFormulaListData() {
    this.data.formulaData.forEach((data, index) => {
      const element = this.formulaFieldListBuilder.get('formulaArray') as FormArray
      element.push(this.CreateFormulaArray(data));
    });
  }

  /* CreatedBy:Jasmine
    CreatedON:Feb24,2020
    Purpose:Create a formula array */
  OnCloseDialogBox() {
    this.dialogRef.close();
  }
  /* CreatedBy:Jasmine
    CreatedON:Feb24,2020
    Purpose:Created for Fetch formula result */
  OnFetchFormulaResults(formulaList) {
    this.showloading = true;
    this.FormulaEpression = '';
    formulaList.forEach(data => {
      this.FormulaEpression = this.FormulaEpression + data.value['OperatorName'] + data.value['TokenName']
    });
    const postdata = {
      'expression': this.FormulaEpression
    }
    this.payorToolSvc.FetchTestFormulaResult(postdata).subscribe(response => {
      this.showloading = false;
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.isExpressionValid = response.IsResultValid;
        this.FormulaEpressionResult = response.Result;
      }

    });
  }
  OnCloseValidationPopup() {
    this.isExpressionValid = true;
  }
}
