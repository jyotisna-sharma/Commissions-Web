import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { ClientValidationMessageService } from '../client-validation-message.service'
import { ClientService } from '../client.service';
import { ClientAPIUrlService } from '../ClientAPIURLService';
import { Guid } from 'guid-typescript';
import { Router, ActivatedRoute } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ResponseCode } from '../../response.code';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { MatDialog } from '@angular/material/dialog';
import { LeavePageComponent } from '../../_services/dialogboxes/leave-page/leave-page.component';
import { ErrorMessageService } from '../../_services/error-message.service';
import { AppLevelDataService } from '../../_services/app-level-data.service'
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-create-new-client',
  templateUrl: './create-new-client.component.html',
  styleUrls: ['./create-new-client.component.scss']
})
export class CreateNewClientComponent implements OnInit {

  isArison: boolean = JSON.parse(localStorage.getItem('loggedUser')).LicenseeId == CONSTANTS.arisonId;
  pagename: string // for showing pagename in breadcrumb
  moduleName: string;
  Searchforstring = { SearchString: '' }
  isCreateButton: boolean;
  showNickName: string;
  createGuid: any;
  isCreateForm: boolean;
  postdata: any;
  userdetail: any;
  timer: any;
  url: any;
  buttonClicked: boolean;
  tabSequancing: any;
  showLoader: any = false;
  showloading = false;
  isClientAlreadyExist: Boolean = false;
  ClientId: any; // used for get and set  clientId
  clientForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    email: new FormControl('', [Validators.pattern(CONSTANTS.emailPattern)
    ]),
    address: new FormControl(),
    ssn: new FormControl(),
    dob: new FormControl(),
    flatno: new FormControl(),
    city: new FormControl(),
    state: new FormControl(),
    zipcode: new FormControl(),
    gender: new FormControl('None'),
    maritalStatus: new FormControl('None'),
    phone: this.CreateContactFormGroup()
  });

  // save address
  addressValue: string;
  getValue(addressV : string) {
    this.addressValue = addressV;
  }
  // save address

  @ViewChild('firstnameref', { static: true }) public firstnamefocus: MatInput
  // @ViewChild('ssnRef', { static: true }) public ssnValue: MatInput
  @ViewChild('nameInputField', { static: false }) nameInputField: ElementRef;
  constructor(
    public clientValidationMsg: ClientValidationMessageService,
    public clientService: ClientService,
    public clienturl: ClientAPIUrlService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public getRouteParamtersService: GetRouteParamtersService,
    public dialog: MatDialog,
    public erroMessage: ErrorMessageService,
    private appData: AppLevelDataService

  ) { }

  ngOnInit() {
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.userdetail) {
      this.buttonClicked = false;
      this.appData.disabledmatInupt = false;

      this.tabSequancing = '';
      this.timer = setInterval(() => {
        this.checkInitialVal(this.firstnamefocus);
      }, 500);
      if (this.userdetail.Permissions[1].Permission === 1) {
        this.clientForm.disable();
        this.appData.disabledmatInupt = true;
      }
      this.getRouteParamtersService.getparameterslist(this.activatedRoute);
      this.moduleName = 'Clients';
      this.pagename = 'Create Client';
      this.url = this.clienturl.ClientAPIRoute.GetGoogleLocationsAPIroute;
      if (this.router.url.indexOf('client/create-new') > -1) {
        this.isCreateButton = true;
        this.isCreateForm = true;
        this.clientForm.controls.gender.setValue('None');
        this.clientForm.controls.maritalStatus.setValue('None');

        this.clientForm.controls['phone']['controls'].IsFirstTimeLoad.setValue(true);
      } else if (this.router.url.indexOf('client/edit-client') > -1) {
        this.getDetailsOfUser();
      }
    }

  }
  ngAfterViewInit() {
    this.clientForm.controls.name.valueChanges.subscribe(result => {
      this.isClientAlreadyExist = false;
    });
    this.setAutoFocus();
  }

  CreateContactFormGroup() {
    let ContactDetailFormGroup: FormGroup = new FormGroup({
      PhoneNumber: new FormControl(''),
      DialCode: new FormControl(''),
      CountryCode: new FormControl(''),
      IsFormValid: new FormControl(false),
      IsFirstTimeLoad: new FormControl(false)
    });
    return ContactDetailFormGroup;
  }
  getDetailsOfUser() {
    this.ClientId = this.getRouteParamtersService.ClientId;
    this.showloading = true;
    this.isCreateButton = false;
    this.pagename = 'Edit Client';
    this.postdata = {
      'clientId': this.ClientId,
      'licenseeId': this.userdetail['LicenseeId']
    };
    this.clientService.getClientDetails(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showLoader = this.SetClientDetails(response.ClientObject)
        this.showLoader = true;
        //
        this.clientForm.controls.address.setValue(response.ClientObject.Address);
      }
    });
  }

  GetSelectedAccount(value) {
    this.clientForm.controls.address.setValue(value);
  }
  OnPageRedirection(value) {
    if (value.data.url.indexOf('/client/edit-client') > -1) {
      this.router.navigate(['/client/clientListing', value.data.parentTab, value.data.pageSize, value.data.pageIndex]);
    } else {
      this.router.navigate(['/client/clientListing', value.data.parentTab, value.data.pageSize, value.data.pageIndex]);
    }

  }
  AddUpdateClientDilog() {
    const dilogref = this.dialog.open(SuccessMessageComponent,
      {
        width: '450px',
        data: {
          Title: this.pagename !== 'Edit Client' ? 'Client Created Successfully ' : 'Client  Updated Successfully',
          subTitle: this.pagename !== 'Edit Client' ? ' Client has been  successfully created in the system.'
            : ' Client has been successfully updated in the system.',
          buttonName: 'ok',
          isCommanFunction: false
        },
        disableClose: true,
      });
  }

  fillInData($event) {
    let address = ""; let postalcode = ""; let city = ""; let state = "";

    if ($event.postal_code !== undefined) {
      postalcode = $event.postal_code;
    } else {
      postalcode = "";
    }

    if ($event.postal_code_suffix !== undefined) {
      postalcode = postalcode + $event.postal_code_suffix;
    } else {
      postalcode = "";
      //postalcode = postalcode + $event.postal_code_suffix;
      //this.clientForm.controls.zipcode.setValue(postalcode);
    }

    if ($event.locality !== undefined) {
      city = $event.locality;
    } else {
      city = "";
    }

    if ($event.administrative_area_level_1 !== undefined) {
      state = $event.administrative_area_level_1;
    } else {
      state = "";
    }
    this.clientForm.controls.zipcode.setValue(postalcode);
    this.clientForm.controls.city.setValue(city);
    this.clientForm.controls.state.setValue(state);
  }

  public SetClientDetails(getResponse) { //debugger;
    console.log('setting up form values');
    this.clientForm.controls.name.setValue(getResponse.Name);
    this.clientForm.controls.email.setValue(getResponse.Email);
    this.clientForm.controls.address.setValue(getResponse.Address);
    this.clientForm.controls.ssn.setValue(getResponse.SSN);
    this.clientForm.controls.gender.setValue(getResponse.Gender);
    this.clientForm.controls.maritalStatus.setValue(getResponse.MaritalStatus);
    this.clientForm.controls.city.setValue(getResponse.City);
    this.clientForm.controls.state.setValue(getResponse.State);
    this.clientForm.controls.zipcode.setValue(getResponse.Zip);
    this.clientForm.controls.flatno.setValue(getResponse.FlatNo);
    if (getResponse.DOBString) {
      this.clientForm.controls.dob.setValue(new Date(getResponse.DOBString));
    }
    if (getResponse.Phone) {
      this.SetContactDetails(getResponse.Phone, 'phone');
    }
    this.showNickName = '-' + this.clientForm.controls.name.value;
    this.showloading = false;
    console.log('setting up form values DONE');

  }

  SetContactDetails(details, controlName) {
    this.clientForm.controls[controlName]['controls'].PhoneNumber.setValue(details.PhoneNumber);
    this.clientForm.controls[controlName]['controls'].CountryCode.setValue(details.CountryCode);
    this.clientForm.controls[controlName]['controls'].DialCode.setValue(details.DialCode);
    this.clientForm.controls[controlName]['controls'].IsFormValid.setValue(false);
    this.clientForm.controls[controlName]['controls'].IsFirstTimeLoad.setValue(true);
    this.setAutoFocus();
  }

  setAutoFocus = (): void => {
    setTimeout((): void => {
      if (this.nameInputField) {
        this.nameInputField.nativeElement.focus();
      }
    }, 100);
  }

  updatedetails() {
    this.buttonClicked = true;
    //
    if (!this.clientForm.valid) {
      this.validateformFields(this.clientForm);
      return;
    }
    else {
      this.savedetails(this.ClientId);
    }

  }

  setDateFormat = (dateObj: Date): string => {
    if (dateObj) {
      return ((dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate()
        + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()) || '');
    }
  }
  savedetails(ClientID: any) {
    if ((this.clientForm.controls.phone.value['PhoneNumber'] &&
      this.clientForm.controls.phone.value.IsFormValid === true)) {
      //  debugger;
      return;
    }

    this.showloading = true;
    
    if (this.isArison) {
      this.postdata = {
        'client': {
          'ClientId': ClientID,
          'Name': this.clientForm.controls.name.value,
          'Email': this.clientForm.controls.email.value,

          'City':this.clientForm.controls.city.value,
          'State':this.clientForm.controls.state.value,
          'Zip':this.clientForm.controls.zipcode.value,
          'FlatNo':this.clientForm.controls.flatno.value,

          // save address
          //'Address': this.clientForm.controls.address.value, // to comment
           'Address':this.addressValue,//to uncomment
          // save address


          'LicenseeId': this.userdetail['LicenseeId'],
          'SSN': this.clientForm.controls.ssn.value,
          'Gender': this.clientForm.controls.gender.value,
          'MaritalStatus': this.clientForm.controls.maritalStatus.value,
          'Phone': this.clientForm.controls.phone.value,
          // 'DialCode': this.clientForm.controls.phone.value.DialCode,
          // 'CountryCode': this.clientForm.controls.phone.value.CountryCode,
          'DOBString': this.setDateFormat(this.clientForm.controls.dob.value)

        },
        'checkDuplicateName': 'true'
      };
    }
    else {
      // if (this.addressValue['formattedName']) {
      //   // delete this.addressValue['formattedName'];
      //   // delete this.addressValue['formattedValue'];
      // }
      this.postdata = {
        'client': {
          'ClientId': ClientID,
          'Name': this.clientForm.controls.name.value,
          'Email': this.clientForm.controls.email.value,

          'City':this.clientForm.controls.city.value,
          'State':this.clientForm.controls.state.value,
          'Zip':this.clientForm.controls.zipcode.value,
          'FlatNo':this.clientForm.controls.flatno.value,

          // save address
          //'Address': this.clientForm.controls.address.value, // to comment
          'Address':this.addressValue,//to uncomment
          // save address

          'LicenseeId': this.userdetail['LicenseeId'],
        },
        'checkDuplicateName': 'true'
      };
    }
    // let reqData = {...this.postdata};
    // if (typeof reqData.client.Address !== 'string' && reqData.client.Address.formattedName) {
    //   reqData.client.Address = reqData.client.Address.formattedName;
    // }
    //console.log("this.postdata="+JSON.stringify(this.postdata));
    //console.log('reqData',reqData);

    this.clientService.addUpdateClientdetails(this.postdata).subscribe(response => { // Create new request
      if (response.ResponseCode === ResponseCode.IssueExistWithEntity) {
        this.isClientAlreadyExist = true;
        this.showloading = false;
        this.clientForm.controls.address.setValue(this.addressValue);
        // if (this.showloading === false) {
        //   this.showloading = true;
        // Duplicate name, take confirmation

        // this.openConfirmDialogBox(ClientID, this.clientForm.controls.name.value); // Open confirm dialog
        //}
      } else if (response.ResponseCode === ResponseCode.SUCCESS) { // No issue, the request to create
        this.showloading = false;
        this.navigateToListing();
        this.AddUpdateClientDilog();
      } else {
        this.showloading = false;
        this.navigateToListing();
        this.erroMessage.OpenResponseErrorDialog(response.ExceptionMessage);
      }
    }
    )
  }


  createdetails() {
    //
    this.buttonClicked = true;
    if (!this.clientForm.valid) {
      this.validateformFields(this.clientForm);
      return;
    }
    this.showloading = true;
    this.createGuid = Guid.create();
    this.savedetails(this.createGuid.value);
  }

  openConfirmDialogBox(ClientID: any, name: any) {
    const dialogRef = this.dialog.open(LeavePageComponent, {
      data: {
        // ClientID: clientID,
        headingTitle: 'Duplicate Client Name',
        subTitle: ' Client with name ' + name + ' already exists in the system. Are you sure you want to save client with same name?',
        PrimaryButton: 'Yes, I Want',
        SecondryButton: 'No',
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.createDuplicateNameClient(ClientID)
      } else {
        this.showloading = false;
      }
    });
  }

  // Send request to save client when valid request
  createDuplicateNameClient(ClientID: any) {
    this.postdata = {
      'client': {
        'ClientId': ClientID,
        'Name': this.clientForm.controls.name.value,
        'Email': this.clientForm.controls.email.value,
        'Address': this.clientForm.controls.address.value,
        'LicenseeId': this.userdetail['LicenseeId']
      },
      'checkDuplicateName': 'false'
    }
    this.clientService.addUpdateClientdetails(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showloading = false;
        this.navigateToListing();
        this.AddUpdateClientDilog();
      }
    });
  }

  navigateToListing() {
    if (this.pagename === 'Edit Client') {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['/client/clientListing', this.getRouteParamtersService.parentTab, this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex])
    } else {
      this.router.navigate(['/client/clientListing', 3, 10, 0])
    }
  }

  onCancel() {
    this.buttonClicked = true;
    if (this.pagename === 'edit-client') {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['/client/clientListing', this.getRouteParamtersService.parentTab, this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex])
    } else {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['/client/clientListing', this.getRouteParamtersService.parentTab, this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex])
    }
  }
  checkInitialVal(elementfirstname: any) {
    if (elementfirstname) {
      setTimeout(() => {
        this.firstnamefocus.focus();
      });
      clearInterval(this.timer);
    }

  }
  validateformFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
      }
    });
  }
}
