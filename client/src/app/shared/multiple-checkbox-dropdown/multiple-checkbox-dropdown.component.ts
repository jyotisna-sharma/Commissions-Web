import { Subscription } from 'rxjs';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-multiple-checkbox-dropdown',
  templateUrl: './multiple-checkbox-dropdown.component.html',
  styleUrls: ['./multiple-checkbox-dropdown.component.scss']
})
export class MultipleCheckboxDropdownComponent implements OnInit {
  @ViewChild('allSelectedOptions', { static: true }) public allSelectedRef: MatOption;
  @ViewChild('SelectedOption', { static: true }) public selectedOptionRef: MatSelect;
  @Input() DropDownList: any = [];
  @Output() OnRefreshListData = new EventEmitter<Object>();
  @Input() isListRefresh: Subject<boolean> = new Subject();
  multipleCheckBox = new FormGroup({
    selectedOption: new FormControl({}, [])
  });
  selectedDisplayAry = [];
  constructor() {

  }

  ngOnInit() {
    this.DropDownList.map(item => {
      item.IsSelected = true;
    });

    this.DefaultAllValueSelected(this.DropDownList, this.multipleCheckBox);
    this.multipleCheckBox.controls.selectedOption.valueChanges.subscribe(result => {
      this.displaySelectedOptions(result);
    });

  }

  //Method used for select all dropdown values
  toggleAllSelectedOptions() {
    if (this.allSelectedRef.selected) {
      this.multipleCheckBox.controls.selectedOption.patchValue([
        ...this.DropDownList.map(item => item.Month), 0]);
      this.DropDownList.filter((item => {
        item.IsSelected = true;
        return;
      }))
    } else {
      this.multipleCheckBox.controls.selectedOption.patchValue([]);
      this.DropDownList.filter((item => {
        item.IsSelected = false;
        return;
      }))
    }
    //this.changeInVehicleList.emit({ 'indexValue': this.multipleCheckBox.controls.rowIndex.value });
  }
  displaySelectedOptions(arryContent?: any) {

    if (this.DropDownList.length > 0 && arryContent && arryContent.length > 0 && !arryContent.includes(0)) {

      this.selectedDisplayAry = arryContent.map(
        element => this.DropDownList.find(value => value.Month === element).MonthName
      );
    }
  }
  toggleSingleSelectedOption() {
    this.handleSingleSelectionValue();
    if (this.allSelectedRef.selected) {
      this.allSelectedRef.deselect();
      return false;
    }
    if (this.multipleCheckBox.controls.selectedOption.value.length == this.DropDownList.length) {
      this.allSelectedRef.select();
    }
  }
  handleSingleSelectionValue = (): void => {
    const tempSelectedArry = this.multipleCheckBox.controls.selectedOption.value || [];
    if (this.DropDownList && this.DropDownList.length > 0) {
      this.DropDownList.forEach((item?: any, index?: any) => {

        this.DropDownList[index].IsSelected = false;
        if (tempSelectedArry.length > 0) {
          tempSelectedArry.filter((selectedItem?: any) => {
            if (item.Month == selectedItem) {
              this.DropDownList[index].IsSelected = true;
            }
          })
        }
      });
    }
  }

  SearchListingData() {
    this.selectedOptionRef.close();
    let currentSelVal = this.multipleCheckBox.controls.selectedOption.value || 0;
    this.OnRefreshListData.emit({ 'Month': this.multipleCheckBox.controls.selectedOption.value });
  }

  DefaultAllValueSelected = (aryData?: any, formObject?: any): void => {
    const tempSelectionAry = [];
    if (aryData && aryData.length > 0) {
      aryData.forEach((item?: any) => {
        if (item.IsSelected) {
          tempSelectionAry.push(item.Month);
        }
      });
      if (tempSelectionAry.length == this.DropDownList.length) {
        tempSelectionAry.push(0);
      }
      if (tempSelectionAry.length > 0) {
        formObject.controls.selectedOption.setValue(tempSelectionAry);
      }
    }
  }
  onSelectedValues() {
    this.isListRefresh.subscribe(result => {
      if (!result) {
        this.DropDownList.map(item => {
          item.IsSelected = true;
        });
        this.DefaultAllValueSelected(this.DropDownList, this.multipleCheckBox);
      }
    });
  }
}

