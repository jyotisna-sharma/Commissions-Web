import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ViewChildren, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PhoneDataObject } from '../phone-input/phone-data-object.model';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import {  Validators, ValidatorFn, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
})

export class PhoneInputComponent implements OnInit, DoCheck {
  // ----------------------------------------------------------- Variable Initalized-----------------------------------------------
  intellObject: any;
  @Input() labelName: any; // used for showing Label on phoneNumber,faxNumber,MobileNumber
  @Input() formGroupData: any;
  @ViewChild('phoneNumber', { static: true }) private Numref: ElementRef;

  // ###################################################################################################################################
  constructor() { }
  ngOnInit() {

  }
  ngDoCheck() {
    if (this.formGroupData && this.formGroupData.controls.IsFirstTimeLoad.value) {
      if (this.intellObject) {
        // 
        this.Numref.nativeElement.focus();
        this.intellObject.setCountry(this.formGroupData.controls.CountryCode.value);
        this.intellObject.setNumber(this.formGroupData.controls.PhoneNumber.value);
        this.formGroupData.controls.IsFirstTimeLoad.setValue(false);
      }
    }

  } 
  // --------------------------------------------Check the phone number is valid or not----------------------------------------------
  hasErrorInPhone(error) {
    if (this.formGroupData.controls.PhoneNumber.value) {
      this.formGroupData.controls.IsFormValid.setValue(!error);
    }
  }
  // ###################################################################################################################################
  // --------------------------------------------Method is used for autoformat number----------------------------------------------
  autoformatData() {
    // 
    this.intellObject.setNumber(this.formGroupData.controls.PhoneNumber.value);
  }
  // ###################################################################################################################################
  // --------------------------------------------get the value when we change a country----------------------------------------------
  onCountryChange(countryData) {
    this.formGroupData.controls.DialCode.setValue(countryData.dialCode);
    this.formGroupData.controls.CountryCode.setValue(countryData.iso2);
  }
  // ###################################################################################################################################
  // ----------------------------show a country and number based on dialcode and number-------------------------------------------------
  setPhoneInputObject(inputObject) {
    this.intellObject = inputObject;
  }
  // ###################################################################################################################################
  // --------------------------------------------autofocus to check the number valid or not ----------------------------------------------

}
