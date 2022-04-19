import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { CommonDataService } from '../../_services/common-data.service';
import { PolicymanagerService } from '../policymanager.service';
import { ResponseCode } from '../../response.code';
import { ActivatedRoute } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ResponseErrorService } from '../../_services/response-error.service';
import { PolicyManagerValidationMessageService } from '../policy-manager-validation-message.service';
import { Observable, Subscription } from 'rxjs';
import { clientObject } from '../policy-manager-listing/policy-manager-listing.component';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-policy-smart-fields',
  templateUrl: './policy-smart-fields.component.html',
  styleUrls: ['./policy-smart-fields.component.scss']
})
export class PolicySmartFieldsComponent implements OnInit {
  moduleName: any;
  pagename: any;
  policyNumber: any;
  isTabDisabled: Boolean = false;
  isSearchLoading: boolean = false;
  clientList: any;
  userdetails: any;
  modifiedData: any;
  clientName: any;
  postdata: any;
  policyObject: any;
  CompTypeList: any;
  showLoader: boolean;
  buttonClicked: boolean;
  isAutoTermDateVShown: Boolean = false;
  ClientDropDown: Observable<clientObject[]>;
  previousFormContorlValue: string = '';
  formControlSubscription: Subscription;
  client = new FormGroup({
    ClientList: new FormControl('', []),
    ClientObject: new FormControl('', [Validators.required])
  });
  modeList: any = [
    { PolicyModeId: '3', Value: 'Annually' },
    { PolicyModeId: '0', Value: 'Monthly' },
    { PolicyModeId: '4', Value: 'One Time' },
    { PolicyModeId: '1', Value: 'Quarterly' },
    { PolicyModeId: '5', Value: 'Random' },
    { PolicyModeId: '2', Value: 'Semi-Annually' }
  ];
  SmartFields = new FormGroup({
    PolicyId: new FormControl('', []),
    Insured: new FormControl('', []),
    OriginalEffectiveDate: new FormControl('', []),
    PolicyModeId: new FormControl('', []),
    PAC: new FormControl('', []),
    Renewal: new FormControl('', []),
    Eligible: new FormControl('', []),
    Enrolled: new FormControl('', []),
    Coverage: new FormControl('', []),
    CompScheduleType: new FormControl('', []),
    ImportPolicyId: new FormControl('', []),
    PolicyNumber: new FormControl('', []),
    TrackFromDate: new FormControl('', []),
    Carrier: new FormControl('', []),
    PMC: new FormControl('', []),
    ModeAvgPremium: new FormControl('', []),
    PolicyTerminationDate: new FormControl('', []),
    PayorSysId: new FormControl('', []),
    CompType: new FormControl('', []),
    Link1: new FormControl('', []),
    Link2: new FormControl('', []),
    PolicyPlanID: new FormControl('', []),
    cdPolicyId: new FormControl('', []),
  });


  @ViewChild('insured',{ static: true }) public insuredRef: MatInput;

  constructor(
    public getrouteParamters: GetRouteParamtersService,
    public commonService: CommonDataService,
    public policyService: PolicymanagerService,
    public activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    public route: Router,
    public responseError: ResponseErrorService,
    public validationMesaage: PolicyManagerValidationMessageService,

  ) { }
  ngOnInit() {
    this.buttonClicked = false;
    this.showLoader = true;
    this.insuredRef.focus();
    this.SmartFields.controls.PolicyModeId.setValue('5');
    this.getrouteParamters.getparameterslist(this.activateRoute)
    this.moduleName = this.route.url.indexOf('advance-Search') > -1 ? 'Policy Manager - Advance Search ' : 'Policy manager';
    this.pagename = 'Edit Policy';


    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));


    this.policyNumber = localStorage.getItem('PolicyNumber');
    if (this.userdetails.Permissions[1].Permission === 1) {
      this.SmartFields.disable();
    }
    this.getPayTypes();
    this.FormFieldDisabled();
    // this.getClientNameFromAPI();
    this.formControlSubscription = this.client.controls.ClientObject.valueChanges.subscribe((changedValue) => {
      this.getClientSuggestList(changedValue);
    });
    // if(this.policyService.clientListing){
    //   this.clientList =  this.policyService.clientListing; //JSON.parse(localStorage.getItem('ClientList'));
    // }
    // else{
    //   this.postdata = {
    //     'licenseeId': this.userdetails['LicenseeId'],
    //     'loggedInUserId': this.userdetails['UserCredentialID']
    //   }
    //   this.policyService.getAllClientName(this.postdata).subscribe(response => {
    //   this.clientList = response.ClientList;  // JSON.parse(localStorage.getItem('ClientList'));
    //   });
    // }

  }

  /***********************Check empty client*****************/

  checkEmptyClient(){
    // if(!this.client.controls.ClientObject.value){
    //  if(this.clientName){
    //    this.client.controls.ClientObject.setValue(this.clientName);
    //  }
    //  else if(this.client.controls.ClientList.value && this.clientList){
    //  this.client.controls.ClientObject.setValue(this.clientList.filter(client => client['ClientId'] === this.getrouteParamters.ClientId)[0].Name);
    //  }
    // }
  }


/*********************Get selected client name  from API ******************************/
 getClientNameFromAPI(clientID: any){
   this.postdata = {
     'licenseeId': this.userdetails['LicenseeId'],
     'loggedInUserId': this.userdetails['UserCredentialID'],
     'clientId': clientID
   }
   this.policyService.getClientName(this.postdata).subscribe(response => {
   this.clientList = response.ClientList;  // JSON.parse(localStorage.getItem('ClientList'));
   this.SetAllFiltersValue();
   this.client.controls.ClientList.setValue(clientID);
   let name = this.clientList.filter(client => client['ClientId'] === clientID)[0].Name
   this.client.controls.ClientObject.setValue(name);
   this.clientName = name;
  //  this.setClientName();
   });
 }

  // ----------------------------------used for change the client from dropdown ---------------------------------------------------------
  OnClientChange(value) {
      this.client.controls.ClientList.setValue(value.option.value.ClientId);
      this.clientName =  value.option.value.Name;
      this.client.controls.ClientObject.setValue(value.option.value.Name);
  }

 /*********************Get clients list from Auto suggestion API ******************************/
 getClientSuggestList(searchString: any){
   this.isSearchLoading = true;
   this.postdata = {
     'licenseeId': this.userdetails['LicenseeId'],
     'loggedInUserId': this.userdetails['UserCredentialID'],
     'searchString': searchString
   }
   this.policyService.getSearchedClientName(this.postdata).subscribe(response => {
    this.isSearchLoading = false;
     this.clientList = response.ClientList;
     this.SetAllFiltersValue();
   })
 }
  // -----------------Client Filter --------------------------------------
  SetAllFiltersValue() {
    this.ClientDropDown = this.client.controls.ClientObject.valueChanges.pipe(
      startWith(''),
      debounceTime(700),
      distinctUntilChanged(),
      map(value => value ? this._Clientfilter(value) : this.clientList.slice())
    );
  }
  _Clientfilter(value: any): clientObject[]  {
    const filterValue = (value.Name) ? value.Name.toLowerCase() : value.toLowerCase();
    return this.clientList.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }
  //

  FormFieldDisabled() {
    this.SmartFields.controls.PAC.disable();
    this.SmartFields.controls.PMC.disable();
    this.SmartFields.controls.ImportPolicyId.disable();
    this.SmartFields.controls.PolicyPlanID.disable();
    this.SmartFields.controls.cdPolicyId.disable();
    if (this.userdetails.Role === 1) {
      this.SmartFields.controls.ImportPolicyId.enable();
      this.SmartFields.controls.PolicyPlanID.enable();
    }
    // this.SmartFields.controls.TrackFromDate.disable();
    this.GetSmartFieldsDetail()
  }
  getPayTypes() {
    this.postdata = {};
    this.commonService.getIncomingPaymentTypes(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.CompTypeList = response.PolicyIncomingPaymentList;
        if (this.policyObject && this.policyObject.policyDetails && this.policyObject.policyDetails.CompTypeId) {
          this.SmartFields.controls.CompType.setValue(this.policyObject.policyDetails.CompTypeId);
        } else {
          this.SmartFields.controls.CompType.setValue(this.CompTypeList[1].PaymentTypeId);
        }
      }
    });
  }
  GetSmartFieldsDetail() {
    this.postdata = { 'policyId': this.getrouteParamters.PolicyId };
    this.policyService.GetsmartFieldDetails(this.postdata).subscribe(response => {
      this.policyObject = response;
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.SetFormFieldValues(this.policyObject);
      } else {
        return;
      }

    });
  }
  SetFormFieldValues(getDetails) {
    this.modifiedData = getDetails.policyDetails.LastModifiedDetail;
    this.client.controls.ClientList.setValue(getDetails.policyDetails.ClientID);

    this.getClientNameFromAPI(getDetails.policyDetails.ClientID);


    this.SmartFields.controls.Insured.setValue(getDetails.policyDetails.Insured);
    this.SmartFields.controls.OriginalEffectiveDate.setValue(new Date(this.ChangeDateFormat(getDetails.policyDetails.OriginDateString)));
    this.SmartFields.controls.PolicyModeId.setValue(getDetails.policyDetails.PolicyModeId.toString());
    let PAC = getDetails.policyDetails.PAC.toString();
    let PMC = getDetails.policyDetails.PMC.toString();
    PAC = PAC.replace('$', '');
    PMC = PMC.replace('$', '');
    this.SmartFields.controls.PAC.setValue(Number(PAC).toFixed(2));
    this.SmartFields.controls.PMC.setValue(Number(PMC).toFixed(2));
    const renwable = Number(getDetails.policyDetails.Renewal);
    this.SmartFields.controls.Renewal.setValue(renwable.toFixed(2));
    this.SmartFields.controls.Eligible.setValue(getDetails.policyDetails.Eligible);
    this.SmartFields.controls.Enrolled.setValue(getDetails.policyDetails.Enrolled);
    this.SmartFields.controls.Coverage.setValue(getDetails.policyDetails.CoverageNickName);
    this.SmartFields.controls.CompScheduleType.setValue(getDetails.policyDetails.CompScheduleType);
    this.SmartFields.controls.ImportPolicyId.setValue(getDetails.policyDetails.ImportPolicyID);
    this.SmartFields.controls.PolicyPlanID.setValue(getDetails.policyDetails.PolicyPlanID);
    this.SmartFields.controls.cdPolicyId.setValue(getDetails.policyDetails.PolicyId);
    this.SmartFields.controls.PolicyNumber.setValue(getDetails.policyDetails.PolicyNumber);
    this.SmartFields.controls.TrackFromDate.setValue(new Date(this.ChangeDateFormat(getDetails.policyDetails.TrackDateString)));
    this.SmartFields.controls.Carrier.setValue(getDetails.policyDetails.CarrierNickName);
    const ModalAvgPremium = getDetails.policyDetails.ModalAvgPremium;
    this.SmartFields.controls.ModeAvgPremium.setValue(ModalAvgPremium.toFixed(2));
    // tslint:disable-next-line:max-line-length
    this.SmartFields.controls.PolicyTerminationDate.setValue(new Date(this.ChangeDateFormat(getDetails.policyDetails.AutoTerminationDateString)));
    this.SmartFields.controls.PayorSysId.setValue(getDetails.policyDetails.PayorSysId);
    this.SmartFields.controls.CompType.setValue(getDetails.policyDetails.CompTypeId);
    this.SmartFields.controls.Link1.setValue(getDetails.policyDetails.Link1);
    const Link2 = getDetails.policyDetails.Link2;
    this.SmartFields.controls.Link2.setValue(Link2.toFixed(2));

    this.showLoader = false;
  }
  OnUpdateSmartFields() {
    if (this.isAutoTermDateVShown === true) {
      return;
    }

    if(!this.client.controls.ClientList.valid){
      return;
    }
    this.buttonClicked = true;
    this.showLoader = true;
    if (this.SmartFields.controls.PolicyTerminationDate.value !== null &&
      (isNaN(this.SmartFields.controls.PolicyTerminationDate.value.getTime()))) {
      this.SmartFields.controls.PolicyTerminationDate.setValue(null);
    }
    if (this.SmartFields.controls.OriginalEffectiveDate.value !== null &&
      (isNaN(this.SmartFields.controls.OriginalEffectiveDate.value.getTime()))) {
      this.SmartFields.controls.OriginalEffectiveDate.setValue(null);
    }
    if (this.SmartFields.controls.TrackFromDate.value !== null &&
      (isNaN(this.SmartFields.controls.TrackFromDate.value.getTime()))) {
      this.SmartFields.controls.TrackFromDate.setValue(null);
    }
    this.showLoader = true;
    this.postdata = {
      'PolicyLearnFields': {
        'Insured': this.SmartFields.controls.Insured.value,
        'PolicyNumber': this.SmartFields.controls.PolicyNumber.value,
        'Renewal': this.SmartFields.controls.Renewal.value,
        'ModalAvgPremium': this.SmartFields.controls.ModeAvgPremium.value,
        'PolicyModeId': this.SmartFields.controls.PolicyModeId.value,
        'Enrolled': this.SmartFields.controls.Enrolled.value,
        'Eligible': this.SmartFields.controls.Eligible.value,
        'AutoTerminationDateString': (this.SmartFields.controls.PolicyTerminationDate.value) ?
          this.OnSaveDateFormat(new Date(this.SmartFields.controls.PolicyTerminationDate.value)) : null,
        'OriginDateString': (this.SmartFields.controls.OriginalEffectiveDate.value) ?
          this.OnSaveDateFormat(new Date(this.SmartFields.controls.OriginalEffectiveDate.value)) : null,
        'PayorSysId': this.SmartFields.controls.PayorSysId.value,
        'Link1': this.SmartFields.controls.Link1.value,
        'Link2': this.SmartFields.controls.Link2.value,
        'LastModifiedDateString': this.OnSaveDateFormat(new Date()),
        'LastModifiedUserCredentialId': this.userdetails['UserCredentialID'],
        'CompScheduleType': this.SmartFields.controls.CompScheduleType.value,
        'CarrierNickName': this.SmartFields.controls.Carrier.value,
        'CompTypeId': this.SmartFields.controls.CompType.value,
        'CoverageNickName': this.SmartFields.controls.Coverage.value,
        'ImportPolicyID': this.SmartFields.controls.ImportPolicyId.value,
        'cdPolicyId': this.SmartFields.controls.cdPolicyId.value,
        'PolicyPlanID': this.SmartFields.controls.PolicyPlanID.value,
        'PAC': this.SmartFields.controls.PAC.value,
        'PMC': this.SmartFields.controls.PMC.value,
        'TrackDateString': (this.SmartFields.controls.TrackFromDate.value) ?
          this.OnSaveDateFormat(new Date(this.SmartFields.controls.TrackFromDate.value)) : null,
        'ClientID': this.client.controls.ClientList.value,
        'PolicyId': this.getrouteParamters.PolicyId
      },
    }
    this.policyService.UpdateSmartFields(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.onPageRedirection();
        this.OpenUpdatedilog();
        this.showLoader = false;
      } else {
        this.responseError.OpenResponseErrorDilog(response.Message);
        this.showLoader = false;
      }

    });
  }
  ChangeDateFormat(date) {
    if (date) {
      for (let i = 0; i < 2; i++) {
        date = date.replace('-', '/');
      }
      return date;
    }
  }
  OnSaveDateFormat = (dateObj: Date): string => {
    if (dateObj) {
      return ((dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate()
        + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()) || '');
    }
  }
  OpenUpdatedilog() {
    // this.showLoader = false;
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: 'Policy Updated Successfully',
        subTitle: 'The policy has been successfully updated in the system.',
        buttonName: 'ok',
        isCommanFunction: false
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  onPageRedirection() {
    if (this.route.url.indexOf('advance-Search') > -1) {
      this.route.navigate(['policy/advance-Search', this.getrouteParamters.parentTab,
        this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
    else {
      this.route.navigate(['policy/policyListing', this.getrouteParamters.parentTab,
        this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex],
        { queryParams: { client: this.getrouteParamters.ClientId } });
    }
  }
  onCancelClick() {
    this.buttonClicked = true;
    this.onPageRedirection();
  }
  OnValidateDate(value) {
    const orignalEffectivDate = new Date(this.SmartFields.controls.OriginalEffectiveDate.value)
    const autoTermDate = new Date(this.SmartFields.controls.PolicyTerminationDate.value)
    if (orignalEffectivDate.getTime() > autoTermDate.getTime()) {
      this.isAutoTermDateVShown = true;
    } else {
      this.isAutoTermDateVShown = false;
    }
  }
}
