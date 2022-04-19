import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { Guid } from 'guid-typescript';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseCode } from '../../response.code';
import { PhoneInputComponent } from '../../shared/phone-input/phone-input.component';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
@Component({
  selector: 'app-edit-payor-contact',
  templateUrl: './edit-payor-contact.component.html',
  styleUrls: ['./edit-payor-contact.component.scss']
})
export class EditPayorContactComponent implements OnInit, AfterViewInit {
  Searchforstring = { SearchString: '' };
  ModuleName: any;
  textShown: any;
  buttonClicked: Boolean = false;
  isErrorOccured: any;
  postData: any;
  showloading: Boolean = false;
  payorId: any;
  ButtonName: any;
  timer: any;
  url: any;
  isPayordetailsfound: Boolean = false;
  // ----------------------------------------
  officePhoneNumber: any;
  mobilePhoneNumber: any;
  faxNumber: any;
  officeDialCode: any;
  faxDialCode: any;
  mobileDialCode: any;
  officeCountryCode: any;
  mobileCountryCode: any;
  faxCountryCode: any;
  isEmailAlreadyExist: Boolean = false;
  addressValue: string;
  @ViewChild('officeNumber', { static: true }) public numberOfficeRef: PhoneInputComponent;
  @ViewChild('faxNumbercheck', { static: true }) public numberFaxRef: PhoneInputComponent;
  @ViewChild('firstnameref', { static: true }) firstnameRef: MatInput;
  // #########################################
  PayorContactDetails = new FormGroup({
    FirstName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
    LastName: new FormControl('', [Validators.required, , Validators.maxLength(50), Validators.minLength(3)]),
    Address: new FormControl(),
    ContactPref: new FormControl('Phone', {}),
    Priority: new FormControl(1, {}),
    EmailAddress: new FormControl('', [Validators.pattern(CONSTANTS.emailPattern)]),
    OfficePhoneNumber: this.CreateContactFormGroup(),
    MobileNumber: this.CreateContactFormGroup(),
    FaxNumber: this.CreateContactFormGroup()
  });
  contactPrefList: any = [
    {
      key: 'Phone', Value: 'Phone'
    },
    {
      key: 'Email', Value: 'Email'
    },
    {
      key: 'Fax', Value: 'Fax'
    }
  ];
  priorityList: any;
  constructor (
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
    public getRouterParametersvc: GetRouteParamtersService,
    public activatedRoute: ActivatedRoute,
    public route: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit () {
    this.url = this.configAPIURLService.ConfigAPIRoute.GetGoogleLocationsAPIroute;
    this.getRouterParametersvc.getparameterslist(this.activatedRoute);
    this.ModuleName = 'Payor contact';
    this.OnpriorityListDropdown();
    if (this.getRouterParametersvc.payorContactId && (this.route.url.indexOf('edit-payor-contact') > 0)) {
      this.ButtonName = 'Update';
      this.textShown = ' Edit payor contact';
      this.showloading = true;
      this.configService.GetPayorContactDetails({ 'payorContactId': this.getRouterParametersvc.payorContactId }).subscribe(response => {
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          if (response.PayorContactDetails) {
            this.OnsetPayorContactDetails(response.PayorContactDetails);
          }
        }
      });
    } else {
      this.isPayordetailsfound = true;
      this.ButtonName = 'Add';
      this.textShown = ' Create payor contact';
    }
  }
  ngAfterViewInit (): void {
    this.showloading = true;
    this.timer = setInterval(() => {
      this.checkInitialVal(this.firstnameRef);
    }, 500);
  }

  // save address
  getValue(addressV : string) {
    this.addressValue = addressV;
  }
  // save address

  CreateContactFormGroup () {
    const ContactDetailFormGroup: FormGroup = new FormGroup({
      PhoneNumber: new FormControl(''),
      DialCode: new FormControl(''),
      CountryCode: new FormControl(''),
      IsFormValid: new FormControl(true),
      IsFirstTimeLoad: new FormControl(false)
    });
    return ContactDetailFormGroup;
  }
  OnpriorityListDropdown () {
    this.priorityList = [];
    for (let i = 1; i <= 10; i++) {
      const key = i;
      const value = i;
      const data = {
        'key': key,
        'value': value
      };
      this.priorityList.push(data);
    }
  }
  checkInitialVal (elementfirstname: any) {
    if (elementfirstname) {
      setTimeout(() => {
        this.firstnameRef.focus();
        this.showloading = false;
      });
      clearInterval(this.timer);
    }

  }
  OnsetPayorContactDetails (getData) {
    this.PayorContactDetails.controls.FirstName.setValue(getData.FirstName);
    this.PayorContactDetails.controls.LastName.setValue(getData.LastName);
    this.PayorContactDetails.controls.EmailAddress.setValue(getData.Email);
    this.PayorContactDetails.controls.Priority.setValue(getData.Priority);
    this.PayorContactDetails.controls.ContactPref.setValue(getData.ContactPref);
    this.isPayordetailsfound = true;
    this.PayorContactDetails.controls.Address.setValue(getData.FormattedAddress);
    this.SetContactDetails(getData.OfficePhone, 'OfficePhoneNumber');
    this.SetContactDetails(getData.Fax, 'FaxNumber');

  }

  SetContactDetails (details, controlName) {
    this.PayorContactDetails.controls[controlName]['controls'].PhoneNumber.setValue(details.PhoneNumber ? details.PhoneNumber : '');
    this.PayorContactDetails.controls[controlName]['controls'].CountryCode.setValue(details.CountryCode);
    this.PayorContactDetails.controls[controlName]['controls'].DialCode.setValue(details.DialCode);
    this.PayorContactDetails.controls[controlName]['controls'].IsFormValid.setValue(false);
    this.PayorContactDetails.controls[controlName]['controls'].IsFirstTimeLoad.setValue(true);
  }




  GetSelectedAccount (selectedData) {
    this.PayorContactDetails.controls.Address.setValue(selectedData);
  }
  Oncreate () {
    if (!this.PayorContactDetails.valid) {
      this.OnValidateForm(this.PayorContactDetails);
      return;
    } else {
      // Check if any phone input has invalid value
      if ((this.PayorContactDetails.controls.OfficePhoneNumber.value && this.PayorContactDetails.controls.OfficePhoneNumber.value.IsFormValid === true) ||
        (this.PayorContactDetails.controls.FaxNumber.value && this.PayorContactDetails.controls.FaxNumber.value.IsFormValid === true)) {
        return;
      }

      this.buttonClicked = true;
      this.showloading = true;
      this.postData = {
        'PayorData': {
          'PayorContactId': this.getRouterParametersvc.payorContactId ?
            this.getRouterParametersvc.payorContactId : Guid.create().toJSON().value,
          'GlobalPayorId': this.getRouterParametersvc.payorId,
          'FirstName': this.PayorContactDetails.controls.FirstName.value,
          'LastName': this.PayorContactDetails.controls.LastName.value,
          'Email': this.PayorContactDetails.controls.EmailAddress.value,
          'Priority': this.PayorContactDetails.controls.Priority.value,
          'ContactPref': this.PayorContactDetails.controls.ContactPref.value,
          'OfficePhone': this.PayorContactDetails.controls.OfficePhoneNumber.value,
          'Fax': this.PayorContactDetails.controls.FaxNumber.value,
          //'FormattedAddress': this.PayorContactDetails.controls.Address.value
          'FormattedAddress': this.addressValue
        }
      };
      this.configService.AddUpdatePayorContactDetails(this.postData).subscribe(response => {
        this.showloading = false;
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.route.navigate(['config-manager/payor-contacts',
            this.getRouterParametersvc.payorId, this.getRouterParametersvc.parentTab, this.getRouterParametersvc.pageSize, this.getRouterParametersvc.pageIndex]);
          this.OpenPayorCreationdilog();
        } else if (response.ResponseCode === ResponseCode.EMAIL_ALREADY_EXISTS) {
          this.PayorContactDetails.controls.Address.setValue(this.addressValue);
          this.isEmailAlreadyExist = true;
          return;
        } else {
          return;
        }

      });
    }
  }
  OnValidateForm (formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
        fieldName.markAsTouched({ onlySelf: true });
      }
    });
  }
  OnPageRedirection (name) {
    if (name === 'Cancel') {
      this.buttonClicked = true;
    }
    this.route.navigate(['config-manager/payor-contacts', this.getRouterParametersvc.payorId, this.getRouterParametersvc.parentTab, this.getRouterParametersvc.pageSize, this.getRouterParametersvc.pageIndex]);
  }
  OpenPayorCreationdilog () {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: this.getRouterParametersvc.payorContactId ? ' Payor Contact Updated Successfully' : 'Payor  Contact Successfully ',
        subTitle: this.getRouterParametersvc.payorContactId ? 'Payor contact has been successfully updated in the system.' :
          'Payor contact has been successfully added in the system.',
        primarybuttonName: 'Create Another Payor Contact',
        secondryButtonName: 'Go to Payor contact List', // 'Go to Smart Fields/Notes',
        isCommanFunction: true,
        numberofButtons: this.getRouterParametersvc.payorContactId ? '1' : '2'
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.route.navigate(['config-manager/add-payor-contact', this.getRouterParametersvc.payorId, 3, this.getRouterParametersvc.pageSize, this.getRouterParametersvc.pageIndex]);
      } else {

      }
    });
  }
}
