import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { PolicymanagerService } from '../policymanager.service';
import { ResponseCode } from '../../response.code';
import { PolicyManagerValidationMessageService } from '../policy-manager-validation-message.service';
import { CommonDataService } from '../../_services/common-data.service';
import { Guid } from 'guid-typescript';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { ShowConfirmationComponent } from 'src/app/_services/dialogboxes/show-confirmation/show-confirmation.component';
import { ListingComponent } from '../../_services/dialogboxes/listing/listing.component';
import { MatInput } from '@angular/material/input';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { TableDataSource } from 'src/app/_services/table.datasource';
import { Subject } from 'rxjs/Subject';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { PolicyManagerUrlService } from '../policy-manager-url.service';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { CommonDataUrlService } from '../../_services/common-data-url.service';
import { ResponseErrorService } from '../../_services/response-error.service';
import { distinct } from 'rxjs-compat/operator/distinct';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { ClientInfoComponent } from '../../_services/dialogboxes/client-info/client-info.component';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';


export class CustomModeData {
  static Mode: any;
  static FirstYearPercentage: any;
  static RenewalPercentage: any;
  static CustomType: any;
  static GradedSchedule: any;
  static NonGradedSchedule: any;
}
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { clientObject } from '../policy-manager-listing/policy-manager-listing.component';

enum tieredErrorMsg {
  InvalidTier,
  MissingTier1,
  HouseErrorTier1,
  HouseErrorTier2,
  MultipleHouseInBasic,
  None
};
enum customScheduleErrorMsg {
  MissingEffDate,
  InvalidDate,
  InvalidPercentage,
  InvalidPremium,
  None
}

@Component({
  selector: 'app-create-new-policy',
  templateUrl: './create-new-policy.component.html',
  styleUrls: ['./create-new-policy.component.scss']
})

export class CreateNewPolicyComponent implements OnInit, AfterViewInit {
  // ******************************************Variable Initalization starts****************************************************
  
  router: any;
  postdata: any;
  policyId: any;
  clientId: any;
  isCreateButton: boolean;
  payorList: any;
  segmentList: any;
  defaultSegmentId: any;
  defaulteSegment: any;
  defaultPayorID: any;
  productsList: any;
  productTypes: any;
  accExecList: any;
  userdetail: any;
  submittedThrough: any = [];
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  showLoader: boolean;
  terminationReasonList: any;
  payTypesList: any;
  // isTermReasonDisabled: boolean; // for disbled Term Reason Dropdown based on PolicyStatusId
  timer: any;
  buttonClicked: boolean;
  carrierList: any;
  clientListing: any;
  ClientDropDown: Observable<clientObject[]>; ;
  pagename: any = 'Create new policy'; // used for show a page name in bread crumbs
  moduleName: any // used for show a moduole name
  isTrackDateNotEmpty: Boolean = true;
  isFormFieldDisabled: Boolean = false;
  isSplitEvenlyDisabled: Boolean = true;
  isNamedScheduleExist: Boolean = false;
  SplitPercentSumValid: Boolean = true;
  isCarrierSettingUsed: Boolean = false;
  isAddPayeeDisabled: Boolean = false;
  isTabDisable: Boolean = true;;
  isTrackDateVShown: boolean  // used for shown validation message for track date is less than orignal effective date
  ispolicyTermVShown: boolean  // used for shown validation message for track date is less than orignal effective date
  oldClientId: boolean // used for retain the client value when change client from dopdown.
  isScheduleFormEnabled: boolean;
  isHouseAccountExist: boolean;
  isTabEnabled: boolean;
  isCustomSchedule: boolean; // used for show hide custom schedule controls.
  isPercentOfPremium: boolean;
  isSearchLoading: boolean;
  clientName: any;
  policyObject: any;
  //AnnualExpected: any // used for set the value in Annual Expected.
  // TypeList: any;
  primaryAgentList: any;
  incomingScheduleID: any;
  SumbitbuttonText: any = 'Create';
  PAC: any;
  isReplacebuttonShown// used for shown Replace button.
  outgoingSchedule: any;
  customSchedule: any;
  //focus: any;
  firstYearScheduleSum: any = 0; // used for check the sum of first year outgoing schedule
  renewablesYearScheduleSum: any = 0; // used for showing a sum of Renewable year outgoing schedule
  isScheduleValid: boolean; // used for check is submit button enable or disbaled
  CreatePolicyId: any;
  otherData: any = {} // any data to be passed to pop up window
  replacedPolicyData: any;
  invalidScheduleMsg: any;
  getTrackDate: Date;
  isGetTrackDate: boolean;
  ispolicyDuplicated: any;
  getDuplicatePolicyId: any;
  isCreateDate: any;
  ReplacedPolicyOutgoingSchedule: any;
  isHouseAccBttnDisabled: boolean;
  isManuallyChanged: boolean;
  //getIsManuallyChanged: boolean;
  isPolicyTypeFunctionCalled: boolean = false;
  //isOrginalEffectiveDateProducyChangeFunctionCalled: boolean = false;
  PolicyTypeValue: string;
  // splitPercentSum: any = 0;
  invalidDateRange: any;
  saveCustomScheduleList = [];
  //StrRenewableValue: any
  policyName: any;
  // isIncomingScheduleVaild: boolean;
  tierErrorType: tieredErrorMsg;
  customScheduleErrorType: customScheduleErrorMsg;
  selectedTier: any;
  arison: boolean = JSON.parse(localStorage.getItem('loggedUser')).LicenseeId == CONSTANTS.arisonId;
  previousFormContorlValue: string = '';
  formControlSubscription: Subscription;
  
  //@Output('closed') closedStream: EventEmitter<any>;
  @ViewChild('orignalEffective', { static: true }) OrignalEffDate: MatInput;
  @ViewChild('policyTermDate', { static: true }) policyTerminationDate: MatSelect;
  @ViewChild('insured', { static: true }) public insuredRef: ElementRef
  @ViewChild('firstYearper', { static: true }) public firstYearPercent: ElementRef
  modeList: any = [
    { PolicyModeId: '3', Value: 'Annually' },
    { PolicyModeId: '0', Value: 'Monthly' },
    { PolicyModeId: '4', Value: 'One Time' },
    { PolicyModeId: '1', Value: 'Quarterly' },
    { PolicyModeId: '5', Value: 'Random' },
    { PolicyModeId: '2', Value: 'Semi-Annually' }
  ];
  createEmptyGuid = Guid.createEmpty().toJSON().value;
  createNewPolicy = new FormGroup({
    PolicyId: new FormControl('', []),
    PayorId: new FormControl('', []),
    PayorName: new FormControl('', []),
    PolicyStatusId: new FormControl('0', []),
    Insured: new FormControl('', []),
    OriginalEffectiveDate: new FormControl('', [Validators.required]),
    PolicyModeId: new FormControl('0', []),
    CoverageId: new FormControl('', []),
    SubmittedThrough: new FormControl('', []),
    Eligible: new FormControl('', []),
    Enrolled: new FormControl('', []),
    AccoutExec: new FormControl('', []),
    PolicyType: new FormControl('New', []),
    PolicyNumber: new FormControl('', []),
    TrackFromDate: new FormControl('', []),
    ModeAvgPremium: new FormControl('0.00', []),
    CarrierID: new FormControl('', []),
    ProductType: new FormControl('', []),
    PolicyTerminationDate: new FormControl('', []),
    TerminationReasonId: new FormControl('', []),
    SegmentId: new FormControl('', [])
  });
  // --------------------------------------form Group for Schedule tab--------------------------------------------
  createSchedule = new FormGroup({
    IsTrackMissingMonth: new FormControl(true, []),
    IsTrackIncomingPercentage: new FormControl(true, []),
    IsTrackPayment: new FormControl(true, []),
    Type: new FormControl('', []),
    FirstYearPercentage: new FormControl('', []),
    RenewalPercentage: new FormControl('', []),
    ScheduleTypeId: new FormControl('1', []),
    SplitPercentage: new FormControl('100', []),
    Advance: new FormControl('', []),
    CustomSplit: new FormControl(false, []),
    Tier: new FormControl(false, []),
    SplitSchedule: new FormControl('2', []),
    PrimaryAgent: new FormControl('', []),
    SplitBasedSchedule: new FormControl('Invoice', []),
    IncomingPaymentTypeId: new FormControl('', []),
    FirstYearPerUnit: new FormControl('', []),
    RenewalPerUnit: new FormControl('', [])
  });
  client = new FormGroup({
    ClientList: new FormControl('', []),
    ClientObject: new FormControl('', [Validators.required])
  });
  PayorListing: any;
  submittedThroughAPIResponse: any;
  SegmentListing: any;

  // -----------------------Used for outgoing basic schedule---------------------------------------------
  basicScheduleColumnLabels: string[] = ['Payee', 'First Year', 'Renewal', '']
  basicScheduleTierColumnLabels: string[] = ['Payee', 'First Year', 'Renewal', 'Tier#', '']
  basicScheduleDisplayedColumns: string[] = ['PayeeName', 'FirstYearPercentage', 'RenewalPercentage', 'Action'];
  basicScheduleTierDisplayedColumns: string[] = ['PayeeName', 'FirstYearPercentage', 'RenewalPercentage', 'TierNumber', 'Action'];
  basicScheduleColumnIsSortable: string[] = ['false', 'false', 'false', 'false'];
  basicScheduleTierColumnIsSortable: string[] = ['false', 'false', 'false', 'false', 'false', 'false'];
  // -----------------------Used for outgoing basic schedule----------------------------------------------
  customeScheduleColumnLabels: string[] = ['Payee', 'Start date', 'Split %', '']
  customeScheduledisplayedColumns: string[] = ['PayeeName', 'CustomStartDate', 'splitpercentage', 'Action'];
  customeSchedulecolumnIsSortable: string[] = ['false', 'false', 'false', 'false'];
  customeScheduleTierColumnLabels: string[] = ['Payee', 'Start date', 'Split %', 'Tier#', '']
  customeScheduledTierisplayedColumns: string[] = ['PayeeName', 'CustomStartDate', 'splitpercentage', 'TierNumber', 'Action'];
  customeScheduleTiercolumnIsSortable: string[] = ['false', 'false', 'false', 'false', 'false'];

  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  miEditList: MiProperties = new MiProperties();
  // ----------------------------------------------------Editable grid--------------------------------------------------
  //#####################################################################################################################

  // ---------------------------Custom Scheule variable intalization-----------------------------------------------------
  customScheduleData: any = {
    'isPercentOfPremium': true,
    'isSaveButtonClicked': false,
    'isScheduleDataFound': false,
    'ScheduleData': null,
    'formScheduleData': FormGroup,
    'isPercentOfPremiumClicked': false,
    'isPolicyTabChange': false,
    'isSplitEvenlyClicked': false
  };
  validationData: any = {
    'isValidationShown': false,
    'validationMessage': ''

  };
  isScheduleCreated: Boolean = false;
  validationMessagetext: any = '';
  isPayorLoaderShown: Boolean = true;
  // ########################################################################################################################

  constructor(
    public getURL: CommonDataUrlService,
    public route: Router,
    public activatedRoute: ActivatedRoute,
    public getRouteParamtersService: GetRouteParamtersService,
    public policyService: PolicymanagerService,
    public commonService: CommonDataService,
    public validationMesaage: PolicyManagerValidationMessageService,
    public dialog: MatDialog,
    public appData: AppLevelDataService,
    public policyManagerUrl: PolicyManagerUrlService,
    public errorDilog: ResponseErrorService,
    

  ) {
    this.router = route;

  }
  ngOnInit() {
    this.isManuallyChanged = false;
    this.isCarrierSettingUsed = true;
    this.isScheduleValid = true;
    this.isPercentOfPremium = true;
    this.PAC = '$0.00';
    this.isTabEnabled = false;
    this.isScheduleFormEnabled = false;
    this.buttonClicked = false;
    this.moduleName = this.router.url.indexOf('advance-Search') > -1 ? 'Policy Manager - Advance Search ' : 'Policy manager';
    this.createNewPolicy.controls.CarrierID.disable();
    this.createNewPolicy.controls.ProductType.disable();
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.userdetail && this.userdetail && this.userdetail && this.userdetail.Permissions[1].Permission === 1) {
      this.createNewPolicy.disable();
      this.createSchedule.disable();
      this.client.disable();
      this.isFormFieldDisabled = true;
    }
    // this.isTermReasonDisabled = true;
    this.getRouteParamtersService.getparameterslist(this.activatedRoute);
    // debugger;
    // if(this.policyService.clientListing){
    //   this.clientListing = this.policyService.clientListing;  // JSON.parse(localStorage.getItem('ClientList'));
    //   this.SetAllFiltersValue();
    //   this.client.controls.ClientList.setValue(this.getRouteParamtersService.ClientId);
    //   this.client.controls.ClientObject.setValue(this.clientListing.filter(client => client['ClientId'] === this.clientId)[0].Name);
    //   this.setClientName();
    // }
    // else{
      
    //first time name for new as well as edit policy
      this.getClientNameFromAPI();

      //this.SetAllFiltersValue();
      //subscribe for auto suggestion 
      this.formControlSubscription = this.client.controls.ClientObject.valueChanges.subscribe((changedValue) => {
        //if ((this.client.controls.ClientObject.value as string).length >= 3 && this.previousFormContorlValue != this.client.controls.ClientObject.value) {
          this.getClientSuggestList(changedValue);
        //} 
        // else if ((this.client.controls.Client.value as string).length < 3) {
        //   // this.ClientListing
        // }
      });

      // this.ClientDropDown = this.client.controls.ClientObject.valueChanges.pipe(
      //   startWith(''),
      //   map(value => typeof value === 'string' ? value : value.Name),
      //   map(name => name ? this._filter(name) : this.clientListing.slice())    
      // )
    
    
    this.GetAllAPIResonse();
    if (this.getRouteParamtersService.PolicyId) {
      this.pagename = 'Edit Policy';
      this.isTabDisable = false;
    } else {
      this.getPayorList('');
      this.OncheckNamedSchdeuleExist();
    }
    this.CreatePolicyId = (this.getRouteParamtersService.PolicyId &&
      !this.getRouteParamtersService.IsDuplicate) ? this.getRouteParamtersService.PolicyId : Guid.create().toJSON().value;
    this.OnPolicyStatusChanged();
  }

  /***********************Check empty client*****************/
  // _filter(name: string): clientObject[] {
  //   const filterValue = name.toLowerCase();
  //   return this.clientListing.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  // }

  displayFn(user: clientObject): string {
    return user && user.Name ? user.Name : '';
  }

   checkEmptyClient(){
     if(!this.client.controls.ClientObject.value){
      if(this.clientName){
        this.client.controls.ClientObject.setValue(this.clientName);
      }
      else if(this.client.controls.ClientList.value && this.clientListing){
      this.client.controls.ClientObject.setValue(this.clientListing.filter(client => client['ClientId'] === this.getRouteParamtersService.ClientId)[0].Name);
      }
     }
   }
   

  /*********************Get default first or selected client name  from API ******************************/
  getClientNameFromAPI(){
    this.postdata = {
      'licenseeId': this.userdetail['LicenseeId'],
      'loggedInUserId': this.userdetail['UserCredentialID'],
      'clientId': this.getRouteParamtersService.ClientId
    }
    this.policyService.getClientName(this.postdata).subscribe(response => {
    this.clientListing = response.ClientList;  // JSON.parse(localStorage.getItem('ClientList'));
    this.SetAllFiltersValue();
    this.client.controls.ClientList.setValue(this.getRouteParamtersService.ClientId);
    let name = this.clientListing.filter(client => client['ClientId'] === this.getRouteParamtersService.ClientId)[0].Name
    this.client.controls.ClientObject.setValue(name);
    this.clientName = name;   
    this.setClientName();
    });
  }

  /*********************Get clients list from Auto suggestion API ******************************/
  getClientSuggestList(searchString: any){
    this.isSearchLoading = true;
    this.postdata = {
      'licenseeId': this.userdetail['LicenseeId'],
      'loggedInUserId': this.userdetail['UserCredentialID'],
      'searchString': searchString
    }
    this.policyService.getSearchedClientName(this.postdata).subscribe(response => {
      this.clientListing = response.ClientList;  
      this.SetAllFiltersValue();
      this.isSearchLoading = false;
     // this.client.controls.ClientList.setValue(this.getRouteParamtersService.ClientId);
      // this.client.controls.ClientObject.setValue(this.clientListing.filter(client => client['ClientId'] === this.getRouteParamtersService.ClientId)[0].Name);
        
      // this.setClientName();
    })
  }
  
  /****************************************** *************************/
  /* 
  AuthorName:
  CreatedOn: 27-12-2019
  Purpose: To getAll Api dropdown Response in one single call */
  GetAllAPIResonse() {
    this.showLoader = true;
    const submittedThrough = this.commonService.getGlobalPayorCarriers({ 'LicenseeID': this.userdetail && this.userdetail['LicenseeId'] });
    const accountExecList = this.commonService.getAccountExecByLicensee({ 'licensssID': this.userdetail && this.userdetail['LicenseeId'] })
    const productList = this.commonService.getProductsList({ 'LicenseeID': this.userdetail && this.userdetail['LicenseeId'] });
    const termReason = this.commonService.getListOfTermReason({});
    const payType = this.commonService.getIncomingPaymentTypes({});
    const segmentList = this.policyService.GetSegmentsForPolicies( {'LicenseeId': this.userdetail && this.userdetail['LicenseeId'] });
    forkJoin([submittedThrough, accountExecList, productList, termReason, payType, segmentList]).subscribe(response => {
      this.submittedThrough = response[0]['SubmittedThroughList'];
      this.accExecList = response[1]['UsersList'];
      this.productsList = response[2]['DisplayCoverageList'];
      this.terminationReasonList = response[3]['PolicyTerminationReasonList'];
      this.payTypesList = response[4]['PolicyIncomingPaymentList'];
      this.segmentList = response[5]['SegmentList'];
      this.getAccoutExecList();
      this.getSubmittedThrough();
      this.getPayTypes();
      if (this.getRouteParamtersService.PolicyId) {
        this.getPolicyDetails();
      } else {
        this.showLoader = false;
      }
    });
  }
  //###########################################################################################################################################

  getAccoutExecList() {
    if (this.accExecList.length === 0) {
      this.createNewPolicy.controls.AccoutExec.disable();
    } else {
      if (this.userdetail && this.userdetail.Permissions[1].Permission !== 1) {
        this.createNewPolicy.controls.AccoutExec.enable();
      }
    }
  }
  //###########################################################################################################################################
  getSubmittedThrough() {
    if (this.policyObject && this.policyObject.PayorName) {
      if (this.submittedThrough.indexOf(this.policyObject.PayorName) === -1) {
        this.submittedThrough.push(this.policyObject.PayorName);
      }
    }
  }
  // ###########################################################################################################################
  getPayTypes() {
    // 
    if (!this.createSchedule.controls.IncomingPaymentTypeId.value && this.createSchedule.controls.IncomingPaymentTypeId.value !== 0) {
      if (this.policyObject && this.policyObject.IncomingPaymentTypeId >= 0) {
        this.createSchedule.controls.IncomingPaymentTypeId.setValue(this.policyObject.IncomingPaymentTypeId);
      } else {
        this.createSchedule.controls.IncomingPaymentTypeId.setValue(this.payTypesList[1].PaymentTypeId);
      }
    }
  }
  // ###########################################################################################################################
  getPrimaryAgents() {
    this.postdata = {
      licenseeId: this.userdetail && this.userdetail['LicenseeId'],
      roleIdToView: 3,
      listParams: '',
      loggedInUser: this.createEmptyGuid
    };
    this.commonService.getPrimaryAgent(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.primaryAgentList = response.TotalRecords;
        if (this.policyObject && this.policyObject.PrimaryAgent && this.getRouteParamtersService.IsDuplicate != '1') {
          this.createSchedule.controls.PrimaryAgent.setValue(this.policyObject.PrimaryAgent);
        }
      }
    });
  }
  // ###########################################################################################################################
  getPayorList(val) {
    this.commonService.getPayorsList({ 'LicenseeID': this.userdetail && this.userdetail['LicenseeId'] }).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.isPayorLoaderShown = false;
        this.payorList = response.PayorList;
        this.PayorListing = this.createNewPolicy.controls.PayorName.valueChanges.pipe(
          startWith(''),
          map(value => this._Payorfilter(value))
        );
        this.defaultPayorID = this.payorList[0].PayorID;

      }
    });

  }
  // ###########################################################################################################################
  //##############################################################################################
  getSegmentList(val) { debugger;
    this.postdata = {
      'LicenseeId': this.userdetail['LicenseeId']
    }
    this.policyService.GetSegmentsForPolicies(this.postdata).subscribe(response => {
     if (response.ResponseCode === ResponseCode.SUCCESS) {
       this.segmentList = response.SegmentList;
       if(this.segmentList.length === 0) {
        this.createNewPolicy.controls.SegmentId.disable();
       } else {
         this.createNewPolicy.controls.SegmentId.enable();
       }
     }
   });
 }
  //##############################################################################################
  getCarrierList(defaultValue, payorChangedValue) {
    this.productTypes = [];
    // this.getProductType('');
    if (this.payorList) {
      this.payorList.filter(item => {
        if (item.PayorName === this.createNewPolicy.controls.PayorName.value) {
          defaultValue = item.PayorID;
        }
      });
      this.payorList.filter(item => {
        if (item.PayorName === this.createNewPolicy.controls.PayorName.value) {
          payorChangedValue = item.PayorID;
          this.createNewPolicy.controls.PayorId.setValue(payorChangedValue);
        }
      });
    }
    if (defaultValue) {
      defaultValue = this.createNewPolicy.controls.PayorId.value
    }
    if (defaultValue === '' && payorChangedValue !== '') {
      this.postdata = { 'payorId': payorChangedValue.value }
    } else { this.postdata = { 'payorId': defaultValue } }
    if (defaultValue != null) {
      this.commonService.getCarrierList(this.postdata).subscribe(response => {
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.carrierList = response.CarrierList;
        }
        if (this.carrierList.length === 0) {
          this.createNewPolicy.controls.CarrierID.disable();
        } else {
          if (this.userdetail && this.userdetail.Permissions[1].Permission !== 1) {
            this.createNewPolicy.controls.CarrierID.enable();
          }
        }
        this.getProductType('');
      });
    }
  }
  // ###########################################################################################################################
  getProductType(text) {
    //alert("getProductType");
    if(!this.isManuallyChanged) {
      this.postdata = {
        'CoverageId': this.createNewPolicy.controls.CoverageId.value,
        'LicenseeId': this.userdetail['LicenseeId']
      }
      this.policyService.GetSegmentsOnCoverageId(this.postdata).subscribe(response => {
        if(response.ResponseCode === ResponseCode.SUCCESS) {
          let segmentId = response.SegmentId;
          this.createNewPolicy.controls.SegmentId.setValue(segmentId);
          this.defaulteSegment = segmentId;
        } else {
          this.createNewPolicy.controls.SegmentId.setValue('');
        }
      })
    }
    this.productTypes = [];
    if (text === 'carrier-change') {
      this.carrierList.filter(getdata => {
        if (getdata.CarrierId === this.createNewPolicy.controls.CarrierID.value) {
          this.createSchedule.controls.IsTrackMissingMonth.setValue(getdata.IsTrackMissingMonth);
          this.createSchedule.controls.IsTrackIncomingPercentage.setValue(getdata.IsTrackIncomingPercentage);
        }
      });
    }
    this.createNewPolicy.controls.ProductType.disable();
    const PayorId = this.createNewPolicy.controls.PayorId.value;
    const CarrierID = this.createNewPolicy.controls.CarrierID.value;
    const CoverageId = this.createNewPolicy.controls.CoverageId.value;
    this.postdata = {
      'PayorId': this.createNewPolicy.controls.PayorId.value,
      'CarrierId': this.createNewPolicy.controls.CarrierID.value === '' ?
        this.createEmptyGuid.value : this.createNewPolicy.controls.CarrierID.value,
      'CoverageId': this.createNewPolicy.controls.CoverageId.value === '' ?
        this.createEmptyGuid.value : this.createNewPolicy.controls.CoverageId.value
    }
    if (PayorId && CarrierID && CoverageId) {
      this.commonService.getProductTypes(this.postdata).subscribe(response => {
        ;
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.productTypes = response.CoverageNickNameList;
          if (this.productTypes.length > 0) {
            if (this.userdetail && this.userdetail.Permissions[1].Permission !== 1) {
              this.createNewPolicy.controls.ProductType.enable();
            }
          }
        }
      });
    }


    //alert("this.isPolicyTypeFunctionCalled="+this.isPolicyTypeFunctionCalled);
    //alert("this.isManuallyChanged="+this.isManuallyChanged);
    if(this.isPolicyTypeFunctionCalled === false && this.isManuallyChanged === false)
    {
      //alert("in");
      this.policyId = this.CreatePolicyId;
      this.clientId = this.getRouteParamtersService.ClientId;
      this.postdata = {
        'ClientId': this.clientId,
        'CoverageId': this.createNewPolicy.controls.CoverageId.value,
        'LicenseeId': this.userdetail && this.userdetail['LicenseeId'],
        'EffectiveDate': this.createNewPolicy.controls.OriginalEffectiveDate.value,
        'PolicyId': this.policyId
      };

      this.policyService.getPolicyType(this.postdata).subscribe(response => {
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          //alert("productchange");
            //alert("response.PolicyTypeproduct="+response.PolicyType);

            //this.isOrginalEffectiveDateProducyChangeFunctionCalled = true;
            if(response.PolicyType != "")
            {
              //alert("in2PolicyType");
              this.createNewPolicy.controls.PolicyType.setValue(response.PolicyType);
            }
        }
      });
    }
  }

  OnSegmentChange() {
      if(this.isManuallyChanged === false) {
        const dialogRef = this.dialog.open(ShowConfirmationComponent, {
          width: '450px',
          data: {
            headingTitle: 'Segment Change',
            subTitle: 'Are you sure you want to change the Business Segment?',
          },
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if(result === true){
            this.isManuallyChanged = true;
          } else {
            this.createNewPolicy.controls.SegmentId.setValue(this.defaulteSegment);
          }
        });
      }
  }
  // ###########################################################################################################################
  ngAfterViewInit() {
    this.createNewPolicy.controls.PolicyType.valueChanges.subscribe(results => {
      if (results) {
        this.isReplacebuttonShown = this.createNewPolicy.controls.PolicyType.value === 'New' ? false : true;
      }
    });
    this.ValidAllDatesFields();
    this.createSchedule.controls.CustomSplit.valueChanges.subscribe(result => {
      this.isCustomSchedule = result;
      if (result === true) {
        this.isAddPayeeDisabled = false;
      }
    });
    this.createSchedule.controls.SplitSchedule.valueChanges.subscribe(result => {
      this.updateOutgoingScheduleType();
    });
  }
  // ###########################################################################################################################
  OnPolicyStatusChanged() {
    if (this.userdetail && this.userdetail.Permissions[1].Permission === 1) {
      this.createNewPolicy.controls.TerminationReasonId.disable();
    }
    if (this.createNewPolicy.controls.PolicyStatusId.value == 1) {
      const firstIndexTermData = this.terminationReasonList && this.terminationReasonList[4].TerminationReasonId;
     if(!this.createNewPolicy.controls.TerminationReasonId)
     {
      this.createNewPolicy.controls.TerminationReasonId.setValue(firstIndexTermData);
     }
      this.createNewPolicy.controls.TerminationReasonId.enable();
      this.createNewPolicy.controls.PolicyTerminationDate.enable();
      this.createNewPolicy.controls.PolicyTerminationDate.setValidators([Validators.required]);
      this.createNewPolicy.controls.PolicyTerminationDate.markAsTouched();
      this.createNewPolicy.controls.PolicyTerminationDate.updateValueAndValidity();
    }
    else {
      this.createNewPolicy.controls.TerminationReasonId.setValue('');
      this.createNewPolicy.controls.TerminationReasonId.disable();
      this.createNewPolicy.controls.PolicyTerminationDate.setValue('');
      this.createNewPolicy.controls.PolicyTerminationDate.disable();
      this.createNewPolicy.controls.PolicyTerminationDate.setValidators([]);
      this.createNewPolicy.controls.PolicyTerminationDate.updateValueAndValidity();
      this.ispolicyTermVShown = false;

    }
  }
  // ###########################################################################################################################
  OncheckNamedSchdeuleExist() {
    this.postdata = {
      'licenseeId': this.userdetail['LicenseeId']
    }
    this.policyService.CheckNamedScheduleExist(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.isNamedScheduleExist = response.isExist;
      }
    });
  }
  // ###########################################################################################################################
  onChangeEffectDate = (eventObj: any): void => {
    //alert("onChangeEffectDate");
    if (eventObj && eventObj.value instanceof Date) {
      //alert("onChangeEffectDate1");
      this.createNewPolicy.controls.TrackFromDate.setValue(eventObj.value);

      //alert("this.isPolicyTypeFunctionCalled="+this.isPolicyTypeFunctionCalled);
      //alert("this.isManuallyChanged="+this.isManuallyChanged);
      this.policyId = this.CreatePolicyId;
      this.clientId = this.getRouteParamtersService.ClientId;
      if(this.isPolicyTypeFunctionCalled === false && this.isManuallyChanged === false)
      {
        //alert("in2onChangeEffectDate");
        //alert("in1");
        this.postdata = {
          'ClientId': this.clientId,
          'CoverageId': this.createNewPolicy.controls.CoverageId.value,
          'LicenseeId': this.userdetail && this.userdetail['LicenseeId'],
          'EffectiveDate': this.createNewPolicy.controls.OriginalEffectiveDate.value,
          'PolicyId': this.policyId
        };

        this.policyService.getPolicyType(this.postdata).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            //alert("onChangeEffectiveDate");
            //alert("response.PolicyTypeED="+response.PolicyType);
            //this.isOrginalEffectiveDateProducyChangeFunctionCalled = true;
            if(response.PolicyType != "")
            {
              //alert("in1PolicyType");
              this.createNewPolicy.controls.PolicyType.setValue(response.PolicyType);
            }
          }
        });
      }
    }
  }
  getScheduleList() {
    const url = this.policyManagerUrl.PolicyDetails.GetOutgoingSchedule;
    this.miEditList.url = url;
    if (this.createSchedule.controls.CustomSplit.value === true) {
      this.miEditList.cachedList = (this.customSchedule) ? this.customSchedule : [];
    } else {
      this.miEditList.cachedList = (this.outgoingSchedule) ? this.outgoingSchedule : [];
    }
    this.miEditList.miDataSource = new TableDataSource(this.policyService);
    // -----------------------------------Column Shown in Grid---------------------------------------------------------------------------
    this.miEditList.columnLabels = this.createSchedule.controls.CustomSplit.value === false ?
      this.createSchedule.controls.Tier.value === true ? this.basicScheduleTierColumnLabels : this.basicScheduleColumnLabels
      : this.createSchedule.controls.Tier.value === true ? this.customeScheduleTierColumnLabels : this.customeScheduleColumnLabels;
    // ----------------------------------- column values Names  Binding to dataBase-------------------------------------------------------
    this.miEditList.displayedColumns = this.createSchedule.controls.CustomSplit.value === false ?
      this.createSchedule.controls.Tier.value === true ? this.basicScheduleTierDisplayedColumns : this.basicScheduleDisplayedColumns :
      this.createSchedule.controls.Tier.value === true ? this.customeScheduledTierisplayedColumns : this.customeScheduledisplayedColumns;
    // ----------------------------------- columns for Sorting Purpose--------------------------------------------------------------------
    this.miEditList.columnIsSortable = this.createSchedule.controls.CustomSplit.value === false ?
      this.createSchedule.controls.Tier.value === true ? this.basicScheduleTierColumnIsSortable : this.basicScheduleColumnIsSortable
      : this.createSchedule.controls.Tier.value === true ? this.customeScheduleTiercolumnIsSortable : this.customeSchedulecolumnIsSortable;
    this.miEditList.refreshHandler = this.needRefresh;
    this.miEditList.showPaging = true;
    this.miEditList.resetPagingHandler = this.needPageReset;
    this.miEditList.pageSize = this.getRouteParamtersService.pageSize
    this.miEditList.initialPageIndex = this.getRouteParamtersService.pageIndex;
    this.miEditList.miListMenu = new MiListMenu();
    this.miEditList.miListMenu.visibleOnDesk = true;
    this.miEditList.miListMenu.visibleOnMob = false;
    this.miEditList.showPaging = false;
    this.miEditList.isEditablegrid = true;
    this.miEditList.isRowClickable = false;
    if (this.createSchedule.controls.Tier.value === true) {
       if (this.createSchedule.controls.ScheduleTypeId.value === '2' && this.createSchedule.controls.SplitSchedule.value === '1') 
       {
        this.miEditList.fieldType = {
          'FirstYearPercentage': new MiListFieldType('FirstYear', 'FirstYearPercentage', '', 'inline-box',
            'inputDecimalNum', '', '', '', '', '', '$', ''),
          'RenewalPercentage': new MiListFieldType('Renewal', 'RenewalPercentage', '', 'inline-box',
            'inputDecimalNum', '', '', '', '', '', '$', ''),
          'CustomStartDate': new MiListFieldType('Start date', 'CustomStartDate', '', '', 'DatePicker', '', '', '', '', '', '', ''),
          'splitpercentage': new MiListFieldType('Split %', 'splitpercentage', '', 'inline-box', 'inputDecimalNum', '',
            '', '', '', '', '$', ''),
          'TierNumber': new MiListFieldType('Tier#', 'TierNumber', '', '', 'inputNum', '', '', '', '', '', '', ''),
        };
      }
      else  
      {
        this.miEditList.fieldType = {
          'FirstYearPercentage': new MiListFieldType('FirstYear', 'FirstYearPercentage', '', 'inline-box',
            'inputDecimalNum', '', '', '', '', '', '%', ''),
          'RenewalPercentage': new MiListFieldType('Renewal', 'RenewalPercentage', '', 'inline-box',
            'inputDecimalNum', '', '', '', '', '', '%', ''),
          'CustomStartDate': new MiListFieldType('Start date', 'CustomStartDate', '', '', 'DatePicker', '', '', '', '', '', '', ''),
          'splitpercentage': new MiListFieldType('Split %', 'splitpercentage', '', 'inline-box', 'inputDecimalNum', '',
            '', '', '', '', '%', ''),
          'TierNumber': new MiListFieldType('Tier#', 'TierNumber', '', '', 'inputNum', '', '', '', '', '', '', ''),
        };
      }
    } else {

      if (this.createSchedule.controls.ScheduleTypeId.value === '2' && this.createSchedule.controls.SplitSchedule.value === '1') 
      {
        this.miEditList.fieldType = {
          'FirstYearPercentage': new MiListFieldType('FirstYear', 'FirstYearPercentage', '', 'inline-box', 'inputDecimalNum',
            '', '', '', '', '', '$', ''),
          'RenewalPercentage': new MiListFieldType('Renewal', 'RenewalPercentage', '', 'inline-box', 'inputDecimalNum',
            '', '', '', '', '', '$', ''),
          'CustomStartDate': new MiListFieldType('Start date', 'CustomStartDate', '', '', 'DatePicker', '', '', '', '', '', '', ''),
          'splitpercentage': new MiListFieldType('Split %', 'splitpercentage', '', 'inline-box', 'inputDecimalNum',
            '', '', '', '', '', '$', '')
        };
      }
      else
      {  
        this.miEditList.fieldType = {
          'FirstYearPercentage': new MiListFieldType('FirstYear', 'FirstYearPercentage', '', 'inline-box', 'inputDecimalNum',
            '', '', '', '', '', '%', ''),
          'RenewalPercentage': new MiListFieldType('Renewal', 'RenewalPercentage', '', 'inline-box', 'inputDecimalNum',
            '', '', '', '', '', '%', ''),
          'CustomStartDate': new MiListFieldType('Start date', 'CustomStartDate', '', '', 'DatePicker', '', '', '', '', '', '', ''),
          'splitpercentage': new MiListFieldType('Split %', 'splitpercentage', '', 'inline-box', 'inputDecimalNum',
            '', '', '', '', '', '%', '')
        };
      }
    }
    this.miEditList.miListMenu.menuItems =
      [
        new MiListMenuItem('Delete', 3, true, true, this.IsdeleteDisable, 'img-icons delete-icn')
      ];
    this.miEditList.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && isloadingDone.length > 0) {
        this.OnDisabledHouseAccount();
      }
    });
  }
  OnDisabledHouseAccount() {
    let count = 0;
    this.miEditList.miDataSource.tableData.filter(element => {
      if (this.createSchedule.controls.CustomSplit.value === false) {
        if (this.createSchedule.controls.Tier.value === true) {
          if (element.PayeeUserCredentialId === this.userdetail.HouseAccountDetails.UserCredentialId) {
            this.isHouseAccBttnDisabled = true;
            count++;
            if (count === 2) {
              this.isHouseAccBttnDisabled = true;
            } else {
              this.isHouseAccBttnDisabled = false;
            }
          }
        } else {
          if (element.PayeeUserCredentialId === this.userdetail.HouseAccountDetails.UserCredentialId) {
            this.isHouseAccBttnDisabled = true;
          }
        }
      }
    });
  }
  // -----------------------------------when custom split value changed and Custom split on/off ------------------------
  onScheduleChanged(value) {
    if (value.checked === true) {
      this.isHouseAccBttnDisabled = false;
      this.miEditList.cachedList = (this.customSchedule) ? this.customSchedule : [];
      this.isScheduleValid = true;
      this.invalidScheduleMsg = '';
    } else {
      this.miEditList.cachedList = (this.outgoingSchedule) ? this.outgoingSchedule : [];
      if (this.miEditList.cachedList.length > 0) {
        for (const schedules of this.miEditList.cachedList) {
          if (schedules.PayeeUserCredentialId === this.userdetail.HouseAccountDetails['UserCredentialId']) {
            this.isHouseAccBttnDisabled = true;
          }
        }
      }
      if (this.miEditList.cachedList.length === this.primaryAgentList.length - 1) {
        // if (this.createSchedule.controls.CustomSplit.value === false) {

        this.isAddPayeeDisabled = true;
        // }
      }
      this.isScheduleValid = true;
      // this.iscustomScheduleValid = true;
      this.invalidScheduleMsg = '';
    }
    this.getScheduleList();
    this.miEditList.refreshHandler.next(true);
  }
  // ######################################################################################################################
  // -----------------------when user have not write  to delete user or user have only read permission ---------------------
  IsdeleteDisable() {
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    return this.userdetail && this.userdetail.Permissions[1].Permission === 1 ? true : false;
  }
  // ########################################################################################################################
  ParamtersForListing() {
    this.postdata = {
      'PolicyID': this.getRouteParamtersService.PolicyId
    }
    this.miEditList.requestPostData = this.postdata;
    this.miEditList.refreshHandler.next(true);
  }
  // #######################################################################################################################################
  // ----------------------------------this function is used for set the value in client Dropdown----------------------------------
  setClientName() {
    this.clientListing.filter(element => {
      if (element.ClientId === this.client.controls.ClientList.value) {
        this.createNewPolicy.controls.Insured.setValue(element.Name);
      }
    });
  }
  // #######################################################################################################################################
  OnReplacePolicy(value) {
    this.PolicieslistingDilogBox()
  }
  // ##############################################################################################################################
  // ----------------------------------this function used for Check isdategreater or not---------------------------------------------
  CheckAllValidations(getFirstDate, getSeconddate) {
    const firstDate = new Date(getFirstDate);
    const secondDate = new Date(getSeconddate);
    return firstDate.getTime() < secondDate.getTime() ? true : false;
  }
  // ######################################################################################################################################
  // ----------------------------------Validate all date fields  ---------------------------------------------------------
  ValidAllDatesFields() {
    if (this.createNewPolicy.controls.TrackFromDate.value) {
      this.isTrackDateVShown = this.CheckAllValidations(this.createNewPolicy.controls.TrackFromDate.value,
        this.createNewPolicy.controls.OriginalEffectiveDate.value);
    } else {
      this.isTrackDateVShown = false;
      this.isTrackDateNotEmpty = true;
      this.createNewPolicy.controls.TrackFromDate.setValidators([]);
      this.createNewPolicy.controls.TrackFromDate.updateValueAndValidity();
    }

    if (this.createNewPolicy.controls.PolicyTerminationDate.value) {
      this.ispolicyTermVShown = this.CheckAllValidations(this.createNewPolicy.controls.PolicyTerminationDate.value,
        this.createNewPolicy.controls.OriginalEffectiveDate.value);
    } else if (this.createNewPolicy.controls.PolicyTerminationDate.value === null) {
      this.ispolicyTermVShown = false;
      if (this.createNewPolicy.controls.PolicyStatusId.value !== '1') {
        this.createNewPolicy.controls.PolicyTerminationDate.setValidators([]);
        this.createNewPolicy.controls.PolicyTerminationDate.updateValueAndValidity();
      }
    }
  }
  // #######################################################################################################################################
  // ----------------------------------get list of Account exec ---------------------------------------------------------

  // ----------------------------------used for change the client from dropdown ---------------------------------------------------------
  OnClientChange(value) {
    this.oldClientId = this.clientId;
    // this.clientName =  value.option.value.Name;  //value.source.selected.viewValue;
    this.client.controls.ClientObject.setValue(value.option.value.Name);
    if (this.pagename !== 'Create new policy') {
      this.OpenClientChangedilog(value, value.option.value.ClientId, this.oldClientId);
    }
    else{
      this.clientId = value.option.value.ClientId;
      this.client.controls.ClientList.setValue(value.option.value.ClientId);
      this.clientName =  value.option.value.Name;
    }
  }
  _Payorfilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.payorList.filter(option =>
      option.PayorName.toLowerCase().indexOf(filterValue) === 0);
  }
  _Segmentfilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.segmentList.filter(option =>
      option.SegmentId.toLowerCase().indexOf(filterValue) === 0);
  }
  OnCheckIncomingScheduleExist(value) {
    this.postdata = {
      'parameters': {
        'CarrierID': this.createNewPolicy.controls.CarrierID.value,
        'PayorID': this.createNewPolicy.controls.PayorId.value,
        'CoverageID': this.createNewPolicy.controls.CoverageId.value,
        'ProductType': this.createNewPolicy.controls.ProductType.value,
        'IncomingPaymentTypeID': this.createSchedule.controls.IncomingPaymentTypeId.value,
        'LicenseeID': this.userdetail && this.userdetail['LicenseeId']
      }
    }
    this.policyService.checkIncomingScheduleExist(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        if (response.ScheduleDetails.IncomingScheduleID !== this.createEmptyGuid) {
          this.ShownIncomingScheduleDilogBox(response.ScheduleDetails);
        }
      }
    });
  }
  ShownIncomingScheduleDilogBox(ScheduleDetails) {
    const dialogRef = this.dialog.open(ShowConfirmationComponent, {
      width: '450px',
      data: {
        headingTitle: 'Overwrite Incoming Schedule',
        // tslint:disable-next-line:max-line-length
        subTitle: 'Please note that "Incoming Schedule" configuration for selected payor exists. Do you want to use these settings?',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.customScheduleData['isPercentOfPremium'] = ScheduleDetails.ScheduleTypeId == 1 ? true : false;
        if (ScheduleDetails.CustomType == '1') {
          this.createSchedule.controls.SplitSchedule.disable();
          this.createSchedule.controls.SplitSchedule.setValue('2');
        }
        else {
          this.createSchedule.controls.SplitSchedule.enable();
        }
        this.customScheduleData.isScheduleDataFound = true;
        this.customScheduleData['isPolicyTabChange'] = false;
        this.createSchedule.controls.ScheduleTypeId.setValue(ScheduleDetails.ScheduleTypeId.toString());
        this.customScheduleData.ScheduleData = ScheduleDetails;
        this.createSchedule.controls.Advance.setValue(ScheduleDetails.Advance);
        this.createSchedule.controls.SplitPercentage.setValue(Number(ScheduleDetails.SplitPercentage).toFixed(2));
      }
    });
  }
  CloseValidationMessage() {
    this.isScheduleValid = true;
    this.invalidScheduleMsg = '';
  }
  // ###########################################################################################################################
  OnBeforeCreatePolicy() {
    this.getScheduleList();
    this.ParamtersForListing();
    // this.buttonClicked = true;

    if (!this.client.valid && this.userdetail && this.userdetail.Permissions[0].Permission === 2) {
      this.validateformFields(this.client);
      return;
    }
    if (!this.createNewPolicy.valid && this.userdetail && this.userdetail.Permissions[0].Permission === 2) {
      this.validateformFields(this.createNewPolicy);
      return;
    } else if (this.isTrackDateVShown || this.ispolicyTermVShown) {
      if (this.createNewPolicy.controls.TrackFromDate.value || this.createNewPolicy.controls.PolicyTerminationDate.value) {
        return;
      } else {
        if (this.isTrackDateVShown === true) {
          this.isTrackDateVShown = false;
        } else {
          this.ispolicyTermVShown = false;
        }
      }
    } else {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.isScheduleFormEnabled = true;
      this.isTabEnabled = true;
    }
    this.getPrimaryAgents();
  }
  // ###########################################################################################################################
  OnTabChange(value) {

    if (value === 'Tab1' && this.isTabEnabled === true) {
      this.customScheduleData['isPolicyTabChange'] = true;
      this.customScheduleData.isScheduleDataFound = true;
      this.isScheduleFormEnabled = false;
      if (this.createSchedule.controls.CustomSplit.value === true) {
        this.customSchedule = this.miEditList.miDataSource.tableData;

      }
    } else if ((this.isTabEnabled === true && value === 'Tab2') || this.policyObject) {
      //this.customScheduleData['isPolicyTabChange'] = false;
      this.OnBeforeCreatePolicy();

    }
  }
  OnGettingScheduleData(data) {
    this.customScheduleData.formScheduleData = data;
  }
  // ------------------------------------------------Validate a form fields  ----------------------------------------------------
  validateformFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
        fieldName.markAsTouched({ onlySelf: true });
      }
    });
  }
  // ####################################################################################################################################
  // ------------------------------------------------getting a details of policy---------------------------------------------------------
  getPolicyDetails() {
    // 
    this.policyId = this.getRouteParamtersService.PolicyId;
    this.clientId = this.getRouteParamtersService.ClientId;
    this.isCreateButton = false;
    if (this.getRouteParamtersService.IsDuplicate === '1') {
      this.SumbitbuttonText = 'Create';
      this.pagename = 'Create new policy';
      this.isTabDisable = true;
    } else {
      this.SumbitbuttonText = 'Update';
      this.pagename = 'Edit Policy';
    }
    this.postdata = {
      'policyId': this.policyId,
      'licenseeId': this.userdetail && this.userdetail['LicenseeId'],
      'clientId': this.clientId
    };
    this.policyService.getPolicyDetails(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        //this.getIsManuallyChanged =
        this.isManuallyChanged = response.PolicyObject.IsManuallyChanged;

        //alert("this.isManuallyChanged1="+this.isManuallyChanged);

        if (response.PolicyObject.DuplicateFrom) {
          this.ispolicyDuplicated = true;
          this.getDuplicatePolicyId = response.PolicyObject.DuplicateFrom;
        }
        if (response.PolicyObject != null) {
          this.policyObject = response.PolicyObject;
          this.getPayTypes();
          this.OnSetOutgoingSchedules(response);
          if (this.outgoingSchedule && this.outgoingSchedule.length > 0) {
            this.createSchedule.controls.SplitSchedule.setValue(this.outgoingSchedule[0]['ScheduleTypeId'].toString());
          }
          if (this.customSchedule && this.customSchedule.length > 0) {

            this.createSchedule.controls.SplitSchedule.setValue(this.customSchedule[0]['ScheduleTypeId'].toString());
          }
          // These parameter not set in case of Duplicate policy
          if (this.getRouteParamtersService.IsDuplicate != '1') {
            if (response.PolicyIncomingSchedule) {
              this.incomingScheduleID = response.PolicyIncomingSchedule.IncomingScheduleID;
              this.customScheduleData['isPercentOfPremium'] = response.PolicyIncomingSchedule.ScheduleTypeId == 1 ? true : false
              this.customScheduleData.isScheduleDataFound = true;
              this.createSchedule.controls.ScheduleTypeId.setValue(response.PolicyIncomingSchedule.ScheduleTypeId.toString());
              this.customScheduleData.ScheduleData = response.PolicyIncomingSchedule;
              if (response.PolicyIncomingSchedule.Mode == 1 && response.PolicyIncomingSchedule.CustomType == '1') {
                this.createSchedule.controls.SplitSchedule.disable();
              } else {
                this.createSchedule.controls.SplitSchedule.enable();
              }
            }
            this.createNewPolicy.controls.PolicyNumber.setValue(response.PolicyObject.PolicyNumber);
            this.policyName = response.PolicyObject.PolicyNumber ? '-' + ' ' + response.PolicyObject.PolicyNumber :
              '-' + ' ' + ' [Policy# not entered]';
            localStorage.setItem('PolicyNumber', this.policyName);
            this.createNewPolicy.controls.AccoutExec.setValue(response.PolicyObject.AccoutExec);
            const ProductType = !response.PolicyObject.ProductType ? null : response.PolicyObject.ProductType.toLowerCase();
            this.createNewPolicy.controls.ProductType.setValue(ProductType);
          }
          this.PAC = response.PolicyObject.PAC;
          this.PAC = this.PAC.replace("$", '');
          this.PAC = '$' + this.PAC;
          if (!this.clientName) {
            this.createNewPolicy.controls.Insured.setValue(response.PolicyObject.Insured);
          }
          this.createSchedule.controls.IncomingPaymentTypeId.setValue(response.PolicyObject.IncomingPaymentTypeId);
          this.createNewPolicy.controls.PolicyStatusId.setValue(response.PolicyObject.PolicyStatusId.toString());
          this.createNewPolicy.controls.PolicyType.setValue(response.PolicyObject.PolicyType.toString());
          this.PolicyTypeValue = response.PolicyObject.PolicyType.toString();
          //alert("this.PolicyTypeValue="+this.PolicyTypeValue);
          this.createNewPolicy.controls.ModeAvgPremium.setValue(response.PolicyObject.ModalAvgPremium);
          this.createNewPolicy.controls.Enrolled.setValue(response.PolicyObject.Enrolled);
          this.createNewPolicy.controls.Eligible.setValue(response.PolicyObject.Eligible);
          this.createNewPolicy.controls.PolicyModeId.setValue(response.PolicyObject.PolicyModeId.toString());
          this.createNewPolicy.controls.CoverageId.setValue(response.PolicyObject.CoverageId);
          this.createNewPolicy.controls.SegmentId.setValue(response.PolicyObject.SegmentId);
          if(response.PolicyObject.SegmentId) {
            let segmentId = response.PolicyObject.SegmentId;
            this.createNewPolicy.controls.SegmentId.setValue(segmentId);
            this.defaulteSegment = segmentId;
          } else {
            this.createNewPolicy.controls.SegmentId.setValue('');
          }

          this.getPayorList(response.PolicyObject.PayorId);
          this.createNewPolicy.controls.PayorId.setValue(response.PolicyObject.PayorId);
          this.createNewPolicy.controls.PayorName.setValue(response.PolicyObject.PayorName);
          this.createNewPolicy.controls.CarrierID.setValue(response.PolicyObject.CarrierID);
          this.getCarrierList(response.PolicyObject.PayorName, '');
          const value = response.PolicyObject.SubmittedThrough
          this.createNewPolicy.controls.SubmittedThrough.setValue(value);

          if (response.PolicyObject.TrackDateString) {
            this.isGetTrackDate = true;
            for (let i = 0; i < 2; i++) {
              response.PolicyObject.TrackDateString = response.PolicyObject.TrackDateString.replace('-', '/');
            }
            this.getTrackDate = new Date(response.PolicyObject.TrackDateString)
            this.createNewPolicy.controls.TrackFromDate.setValue(this.getTrackDate);
          }
          if (response.PolicyObject.OriginDateString) {
            for (let i = 0; i < 2; i++) {
              response.PolicyObject.OriginDateString = response.PolicyObject.OriginDateString.replace('-', '/');
            }
            const effDate = new Date(response.PolicyObject.OriginDateString);
            this.createNewPolicy.controls.OriginalEffectiveDate.setValue(effDate);
          }
          if (response.PolicyObject.PolicyStatusId === 1) {
            if (response.PolicyObject.PolicyTerminationDate) {
              for (let i = 0; i < 2; i++) {
                response.PolicyObject.AutoTerminationDateString = response.PolicyObject.AutoTerminationDateString.replace('-', '/');
              }
              const termdate = new Date(response.PolicyObject.AutoTerminationDateString)
              this.createNewPolicy.controls.PolicyTerminationDate.setValue(termdate);
            }
            if (response.PolicyObject.TerminationReasonId) {
              this.createNewPolicy.controls.TerminationReasonId.setValue(response.PolicyObject.TerminationReasonId);
            }
          }
          this.OnPolicyStatusChanged();
          // Named schedules exist
          this.isNamedScheduleExist = response.isScheduleExist;
          this.createSchedule.controls.CustomSplit.setValue(response.PolicyObject.IsCustomBasicSchedule);
          this.createSchedule.controls.Tier.setValue(response.PolicyObject.IsTieredSchedule);
          this.createSchedule.controls.SplitBasedSchedule.setValue(response.PolicyObject.CustomDateType);
          this.createSchedule.controls.SplitPercentage.setValue
            (response.PolicyObject.SplitPercentage ? response.PolicyObject.SplitPercentage : 0.00);
          this.createSchedule.controls.Advance.setValue(response.PolicyObject.Advance);
          this.createSchedule.controls.IsTrackMissingMonth.setValue(response.PolicyObject.IsTrackMissingMonth);
          this.createSchedule.controls.IsTrackPayment.setValue(response.PolicyObject.IsTrackPayment);
          this.createSchedule.controls.IsTrackIncomingPercentage.setValue(response.PolicyObject.IsTrackIncomingPercentage);
        }
      }
      this.showLoader = false;
    });
  }
  // ###########################################################################################################################
  OnSetOutgoingSchedules(response) {
    let isValid = true; //to handle invalid schedule from handle 
    if (response.PolicyObject.IsCustomBasicSchedule === true) {
      
      const customScheduleList = [];
      for (let schedule = 0; schedule < response.PolicyOutgoingSchedules.length; schedule++) {
        this.customSchedule = response.PolicyOutgoingSchedules[schedule];

        if(!this.customSchedule.CustomStartDateString)  { 
          this.outgoingSchedule = response.PolicyOutgoingSchedules; 
          isValid = false;
          break;
        }

        for (let i = 0; i < 2; i++) {
          this.customSchedule.CustomStartDateString = this.customSchedule.CustomStartDateString.replace('-', '/');
        }
        this.customSchedule.CustomStartDate = new Date(this.customSchedule.CustomStartDateString);
        customScheduleList.push(this.customSchedule);
      }
      if(isValid){
      this.customSchedule = customScheduleList;
      }
    } else {
      this.outgoingSchedule = response.PolicyOutgoingSchedules;
      this.isSplitEvenlyDisabled = false;
    }
  }
  // ###########################################################################################################################
  setDateFormat = (dateObj: Date): string => {
    if (dateObj) {
      return ((dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate()
        + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()) || '');
    }
  }
  OnlyDateFormat = (dateObj: Date): string => {
    if (dateObj) {
      return ((dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate()) || '');
    }
  }
  mmDDyyyFormat = (date: Date): string => {
    ;
    if (date) {
      return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
    }
  }
  // ###########################################################################################################################
  /*Set default form values */
  setDefaultScheduleValues() {
    this.createSchedule.controls.ScheduleTypeId.setValue('2');
  }
  // ###########################################################################################################################

  OnSavePolicyDetails() {
    this.customScheduleData.isSaveButtonClicked = true;

  }
  /*********************************************************************Save policy***************************************************** */
  OnCreatePolicy() {
    // ------------------------ Add a code for validate a incoming schedule-------------------------------------------------

    this.isScheduleCreated = false;
    this.validationData.isValidationShown = false;
    this.validationData.validationMessage = "";
    // #####################################################################################################################
    if (this.createSchedule.controls.CustomSplit.value === true && this.miEditList.miDataSource.tableData.length > 0) {
      for (const schedule of this.miEditList.miDataSource.tableData) {
        if (schedule.CustomStartDate === null) {
          this.isScheduleValid = false;
          this.invalidScheduleMsg = 'Start date cannot be blank.';
          return;
        }
      }
      const distinctDates = this.distinct(this.miEditList.miDataSource.tableData, (item) => this.OnlyDateFormat(item.CustomStartDate));
      let houseAddedCount = 0;
      for (let i = 0; i < distinctDates.length; i++) {
        houseAddedCount = 0;
        for (const item of this.miEditList.miDataSource.tableData) {
          const date = this.OnlyDateFormat(item.CustomStartDate);
          if (date == distinctDates[i] && item.PayeeUserCredentialId === this.userdetail.HouseAccountDetails['UserCredentialId']) {
            {
              const invalidDate = new Date(distinctDates[i].replace('-', '/'));
              this.invalidDateRange = this.mmDDyyyFormat(invalidDate)
              houseAddedCount++;
            }
          }
        }
        if (houseAddedCount > 1) {
          break;
        }
      }

      this.isScheduleValid = this.OnValidateCustomSchedule();
      if (!this.isScheduleValid) {
        if (this.customScheduleErrorType === customScheduleErrorMsg.MissingEffDate) {
          this.invalidScheduleMsg = 'Outgoing schedule must include the effective date' + ' ' +
            this.mmDDyyyFormat(this.createNewPolicy.controls.OriginalEffectiveDate.value) + ' '
            + 'of the policy.';
          return;
        } else if (this.customScheduleErrorType === customScheduleErrorMsg.InvalidDate) {
          this.invalidScheduleMsg = 'Outgoing schedule cannot start before the effective date' + ' ' +
            this.mmDDyyyFormat(this.createNewPolicy.controls.OriginalEffectiveDate.value) + ' ' + 'of the policy.';
          return;
        } else if (this.createSchedule.controls.Tier.value === true && this.tierErrorType !== tieredErrorMsg.None) {
          this.ShowTieredErrorMessage();
          return;
        } else if (this.customScheduleErrorType === customScheduleErrorMsg.InvalidPercentage) {
          this.invalidScheduleMsg = (this.selectedTier) ?
            'Sum of split percentage is not equal to 100% in ' +
            this.selectedTier + ' for the date range starting from ' +
            this.invalidDateRange + '.' : 'Sum of split percentage is not equal to 100% for the date range starting from ' + ' '
            + this.invalidDateRange + '.'
          return;
        } else if (this.customScheduleErrorType === customScheduleErrorMsg.InvalidPremium) {
          this.invalidScheduleMsg = this.invalidScheduleMsg = (this.selectedTier) ?
            'Sum of split percentage is not equal to incoming schedule in ' +
            this.selectedTier + ' for the date range starting from' +
            this.invalidDateRange +
            '.' : 'Sum of split percentage is not equal to incoming schedule for the date range starting from' + ' ' +
            this.invalidDateRange + '.'
          return;
        }
        else {
          this.isScheduleValid = true;
        }
      } else if (houseAddedCount > 1 && !this.createSchedule.controls.Tier.value) { //This is only to show when not tiered, as tiered case is already handled above
        
        this.isScheduleValid = false;
        this.invalidScheduleMsg = `House account is added more than once in the outgoing schedule of  '` + this.invalidDateRange + `'. Please make sure that house account appears only once in schedule.`;
        return;
      }
      else {
        let scheduleList = [];
        scheduleList = this.miEditList.miDataSource.tableData.map(item => ({ ...item }));
        for (const schedule of scheduleList) {
          schedule.CustomStartDateString = this.OnlyDateFormat(schedule.CustomStartDate);
          schedule.CustomStartDate = null
          this.saveCustomScheduleList.push(schedule);
        }
      }
    } else {
      this.isScheduleValid = this.OnValidateOutgoingSchedule();
      if (this.isScheduleValid === false) {
        this.ShowTieredErrorMessage();
        return;
      }
      else {
        this.isScheduleValid = true;
      }
    }
    this.showLoader = true;
    // this.showloading = false;
    this.createNewPolicy.controls.PolicyId.setValue(this.CreatePolicyId.value);
    //this.isCreateDate =
    let AccountExecUserCredentialsId = null;
    if (this.accExecList) {
      this.accExecList.filter(item => {
        if (item.NickName == this.createNewPolicy.controls.AccoutExec.value) {
          AccountExecUserCredentialsId = item.UserCredentialID
        }
      });

    }
    this.postdata = {
      'PolicyDetails': {
        'PolicyId': this.CreatePolicyId,
        'SegmentId': this.createNewPolicy.controls.SegmentId.value ? this.createNewPolicy.controls.SegmentId.value : null,
        'IsManuallyChanged': this.isManuallyChanged,
        'ClientId': this.client.controls.ClientList.value,
        'PolicyLicenseeId': this.userdetail && this.userdetail['LicenseeId'],
        'CreatedBy': this.userdetail && this.userdetail['UserCredentialID'],
        'ModifiedBy': this.userdetail && this.userdetail['UserCredentialID'],
        'PayorId': this.createNewPolicy.controls.PayorId.value ? this.createNewPolicy.controls.PayorId.value : null,
        'PolicyStatusId': this.createNewPolicy.controls.PolicyStatusId.value,
        'Insured': this.createNewPolicy.controls.Insured.value,
        'OriginDateString': this.setDateFormat(this.createNewPolicy.controls.OriginalEffectiveDate.value),
        'PolicyModeId': this.createNewPolicy.controls.PolicyModeId.value,
        'CoverageId': this.createNewPolicy.controls.CoverageId.value ?
          this.createNewPolicy.controls.CoverageId.value : null,
        'SubmittedThrough': this.createNewPolicy.controls.SubmittedThrough.value,
        'Eligible': this.createNewPolicy.controls.Eligible.value,
        'Enrolled': this.createNewPolicy.controls.Enrolled.value,
        'PolicyType': this.createNewPolicy.controls.PolicyType.value,
        'PolicyNumber': this.createNewPolicy.controls.PolicyNumber.value,
        'TrackDateString': this.setDateFormat(this.createNewPolicy.controls.TrackFromDate.value),
        'ModeAvgPremium': this.createNewPolicy.controls.ModeAvgPremium.value ? this.createNewPolicy.controls.ModeAvgPremium.value : 0,
        'CarrierID': this.createNewPolicy.controls.CarrierID.value ?
          this.createNewPolicy.controls.CarrierID.value : null,
        'ProductType': this.createNewPolicy.controls.ProductType.value,
        'AutoTerminationDateString': this.setDateFormat(this.createNewPolicy.controls.PolicyTerminationDate.value),
        'TerminationReasonId': (this.createNewPolicy.controls.TerminationReasonId.value ||
          this.createNewPolicy.controls.TerminationReasonId.value === 0) ?
          this.createNewPolicy.controls.TerminationReasonId.value : null,
        'AccoutExec': this.createNewPolicy.controls.AccoutExec.value,
        'DuplicateFrom': ((this.getRouteParamtersService.IsDuplicate === '1'))
          ? this.getRouteParamtersService.PolicyId : this.ispolicyDuplicated === true ? this.getDuplicatePolicyId : null,
        'SplitPercentage': (this.createSchedule.controls.SplitPercentage.value) ?
          this.createSchedule.controls.SplitPercentage.value : 0,
        'Advance': (this.createSchedule.controls.Advance.value) ? (this.createSchedule.controls.Advance.value) : null,
        'IncomingPaymentTypeId': this.createSchedule.controls.IncomingPaymentTypeId.value,
        'IsTrackMissingMonth': this.createSchedule.controls.IsTrackMissingMonth.value === '' ?
          false : this.createSchedule.controls.IsTrackMissingMonth.value,
        'IsTrackIncomingPercentage': this.createSchedule.controls.IsTrackIncomingPercentage.value === '' ? false :
          this.createSchedule.controls.IsTrackIncomingPercentage.value,
        'IsTrackPayment': this.createSchedule.controls.IsTrackPayment.value === '' ? false :
          this.createSchedule.controls.IsTrackPayment.value,
        'IsIncomingBasicSchedule': true,
        'IsOutGoingBasicSchedule': true,
        'PrimaryAgent': (this.createSchedule.controls.PrimaryAgent.value) ? this.createSchedule.controls.PrimaryAgent.value : null,
        'ReplacedBy': !this.replacedPolicyData ? null : this.replacedPolicyData.listData.PolicyId,
        'IsCustomBasicSchedule': this.createSchedule.controls.CustomSplit.value,
        'CustomDateType': this.createSchedule.controls.CustomSplit.value === true ?
          this.createSchedule.controls.SplitBasedSchedule.value : null,
        'IsTieredSchedule': this.createSchedule.controls.Tier.value === null ? false : this.createSchedule.controls.Tier.value,
        'LastModifiedBy': this.userdetail && this.userdetail['UserCredentialID'],
        'UserCredentialId': AccountExecUserCredentialsId,
      },
      'ReplacedPolicy':
        (this.createNewPolicy.controls.PolicyType.value === 'New') ? null : !this.replacedPolicyData ? {} : {
          'PolicyId': this.replacedPolicyData.listData.PolicyId,
          'PolicyStatusId': this.replacedPolicyData.PolicyStatusId,
          'AutoTerminationDateString': this.replacedPolicyData.PolicyTerminationDate,
          'TerminationReasonId': this.replacedPolicyData.TerminationReasonID
        },
      'strRenewal': (this.createSchedule.controls.ScheduleTypeId.value === '1') ?
        (this.createSchedule.controls.RenewalPercentage.value ? this.createSchedule.controls.RenewalPercentage.value : null)
        : (this.createSchedule.controls.RenewalPerUnit.value ? this.createSchedule.controls.RenewalPerUnit.value : null),
      'strCoverageNickName': this.createNewPolicy.controls.ProductType.value,
      'policyScheduleDetails':
      {
        'policyIncomingSchedule': {
          'PolicyId': this.CreatePolicyId,
          'ScheduleTypeId': this.createSchedule.controls.ScheduleTypeId.value,
          // tslint:disable-next-line: max-line-length
          'IncomingScheduleID': (this.incomingScheduleID) && this.getRouteParamtersService.IsDuplicate !== '1' ? this.incomingScheduleID : Guid.create().toJSON().value,
          'Mode': CustomModeData.Mode,
          'FirstYearPercentage': !CustomModeData.FirstYearPercentage ? 0 : CustomModeData.FirstYearPercentage,
          'RenewalPercentage': !CustomModeData.RenewalPercentage ? 0 : CustomModeData.RenewalPercentage,
          'CustomType': CustomModeData.CustomType,
          'GradedSchedule': CustomModeData.GradedSchedule,
          'NonGradedSchedule': CustomModeData.NonGradedSchedule
        },
        'OutgoingSchedule': (this.createSchedule.controls.CustomSplit.value === true && (this.saveCustomScheduleList.length > 0)) ?
          this.saveCustomScheduleList : this.miEditList.miDataSource.tableData
      }
    }
      

    const value = '';
    if (this.getRouteParamtersService.IsDuplicate === '1') {
      {
        this.postdata.policyScheduleDetails['OutgoingSchedule'] =
          this.OnChangeOutgoingSchedules(this.postdata.policyScheduleDetails['OutgoingSchedule'],
            this.postdata.PolicyDetails['PolicyId'])
      }
    }
    
debugger;
    this.policyService.savePolicyDetails(this.postdata).subscribe(reponse => {
      if (reponse.ResponseCode === ResponseCode.SUCCESS) {
        this.showLoader = false;
        this.showLoader = true;
        this.OnPageRedirection(value, '');
        if (this.router.url.indexOf('advance-Search') <= 0) {
          this.OpenPolicyCreationdilog()
        }
      } else {
        this.showLoader = false;
        this.errorDilog.OpenResponseErrorDilog(reponse.Message);
      }
    });
  }
  OnChangeOutgoingSchedules(list: any, policyId: any) {
    const outgoingList = [];
    if (this.outgoingSchedule && this.outgoingSchedule.length > 0 && this.getRouteParamtersService.IsDuplicate === '1') {
      for (const schedule of list) {
        const newId = Guid.create().toJSON().value;
        schedule.OutgoingScheduleId = newId;
        schedule.PolicyId = policyId;
        outgoingList.push(schedule);

      }
      return outgoingList;
    }
  }
  // ###########################################################################################################################
  updateOutgoingScheduleType() {
    if (this.miEditList.miDataSource && this.miEditList.miDataSource.tableData && this.miEditList.miDataSource.tableData.length > 0) {
      for (let i = 0; i < this.miEditList.miDataSource.tableData.length; i++) {
        this.miEditList.miDataSource.tableData[i]['ScheduleTypeId'] = this.createSchedule.controls.SplitSchedule.value;
      }
    }
  }
  distinct(items, mapper) {
    if (!mapper) {
      mapper = (item) => item;
    }
    return items.map(mapper).reduce((acc, item) => {
      if (acc.indexOf(item) === -1) {
        acc.push(item);
      }
      return acc;
    }, []);
  }
  /********************* Common function to validate tiered schedule **************/
  ValidateTieredSchedule(schedule, house) {
    // Check if schedule has valid tier numbers
    const distinctTiers = this.distinct(schedule, (item) => item.TierNumber);
    const invalidTiers = distinctTiers.filter(function (x) {
      return (x !== '1' && x !== '2' && x !== 1 && x !== 2);
    })

    if (invalidTiers.length > 0) {
      this.tierErrorType = tieredErrorMsg.InvalidTier;
      return false;
    }

    // Check that if tier 2 configured, 1 must be there
    if (distinctTiers.indexOf('1') === -1 && distinctTiers.indexOf(1) === -1) {
      this.tierErrorType = tieredErrorMsg.MissingTier1;
      return false;
    }

    // Check no 2 house accounts to exist in tier 1
    const houseTier1 = schedule.filter(function (x) { //  console.log(x);
      return ((x.TierNumber === '1' || x.TierNumber === 1) && x.PayeeUserCredentialId === house);
    })

    if (houseTier1.length > 1) {
      this.tierErrorType = tieredErrorMsg.HouseErrorTier1;
      return false;
    }
    // Check no 2 house accounts to exist in tier 2
    const houseTier2 = schedule.filter(function (x) {
      return ((x.TierNumber === '2' || x.TierNumber === 2) && x.PayeeUserCredentialId === house);
    })

    if (houseTier2.length > 1) {
      this.tierErrorType = tieredErrorMsg.HouseErrorTier2;
      return false;
    }
    return true;
  }
  // ###########################################################################################################################
  OnValidateOutgoingSchedule(): boolean {
    if (this.createSchedule.controls.CustomSplit.value === false && this.miEditList.miDataSource.tableData.length > 0) {
      this.firstYearScheduleSum = 0;
      this.renewablesYearScheduleSum = 0;
      this.tierErrorType = tieredErrorMsg.None;
      this.customScheduleErrorType = customScheduleErrorMsg.None;
      this.selectedTier = '';
      this.invalidDateRange = '';
      const house = this.userdetail && this.userdetail.HouseAccountDetails.UserCredentialId;
      for (const OutgoingSchedule of this.miEditList.miDataSource.tableData) {
        // Add condition for tiered schedule
        if (this.createSchedule.controls.Tier.value === true) {
          // Check if schedule has valid tier numbers
          const distinctTiers = this.distinct(this.miEditList.miDataSource.tableData, (item) => item.TierNumber);

          if (!this.ValidateTieredSchedule(this.miEditList.miDataSource.tableData, house)) {
            return false;
          }
          // Check if tiers have valid configuration
          if (distinctTiers.length === 1) { // 2 tiers configured
            this.selectedTier = 'Tier 1';
            if (OutgoingSchedule.TierNumber === '1' || OutgoingSchedule.TierNumber === 1) {
              this.firstYearScheduleSum += Number(OutgoingSchedule.FirstYearPercentage);
              this.renewablesYearScheduleSum += Number(OutgoingSchedule.RenewalPercentage);
            }
          } else {
            this.selectedTier = 'Tier 2';
            if (OutgoingSchedule.TierNumber === '2' || OutgoingSchedule.TierNumber === 2) {
              this.firstYearScheduleSum += Number(OutgoingSchedule.FirstYearPercentage);
              this.renewablesYearScheduleSum += Number(OutgoingSchedule.RenewalPercentage);
            }
          }
        } else { // Basic schedule - without tier
          // Check no two house account entries in basic schedule
          const houseCount = this.miEditList.miDataSource.tableData.filter(function (x) {
            return (x.PayeeUserCredentialId === house);
          })
          if (houseCount.length > 1) {
            this.tierErrorType = tieredErrorMsg.MultipleHouseInBasic;
            return false;
          }

          this.firstYearScheduleSum += Number(OutgoingSchedule.FirstYearPercentage);
          this.renewablesYearScheduleSum += Number(OutgoingSchedule.RenewalPercentage);
        }
      }
      if (CustomModeData.Mode === 0 || (CustomModeData.Mode === 1 && CustomModeData.CustomType === 1)) {
        if (this.createSchedule.controls.SplitSchedule.value === '1') {
          if (this.createSchedule.controls.ScheduleTypeId.value === '1') {
            return this.isScheduleValid = this.firstYearScheduleSum ===
              Number(this.createSchedule.controls.FirstYearPercentage.value)
              && this.renewablesYearScheduleSum === Number(this.createSchedule.controls.RenewalPercentage.value) ? true : false;
          } else {
            return this.isScheduleValid = this.firstYearScheduleSum ===
              Number(this.createSchedule.controls.FirstYearPerUnit.value)
              && this.renewablesYearScheduleSum === Number(this.createSchedule.controls.RenewalPerUnit.value) ? true : false;
          }
        } else {
          return this.isScheduleValid = this.firstYearScheduleSum === 100 && this.renewablesYearScheduleSum === 100 ? true : false;
        }
      } else {
        if (this.createSchedule.controls.SplitSchedule.value === '1') {
          return this.isScheduleValid = this.OnValidateNonGradedSchedule(new Date()) == '-1' ? false : true;
        } else {
          return this.isScheduleValid = this.firstYearScheduleSum === 100 && this.renewablesYearScheduleSum === 100 ? true : false;
        }
      }
    }
  }

  /********* Display error message for tiered schedule************ */
  ShowTieredErrorMessage() {
    if (this.tierErrorType === tieredErrorMsg.InvalidTier) {
      this.invalidScheduleMsg = (this.invalidDateRange) ?
        'Tier number must have valid value as 1 or 2 for date range starting '
        + this.invalidDateRange + '.' : 'Tier number must have valid value as 1 or 2.';
      return;
    } else if (this.tierErrorType === tieredErrorMsg.MissingTier1) {
      this.invalidScheduleMsg = (this.invalidDateRange) ?
        'Tier 1 is missing in outgoing schedule for date range starting '
        + this.invalidDateRange : 'Tier 1 is missing in outgoing schedule.';
      return;
    } else if (this.tierErrorType === tieredErrorMsg.HouseErrorTier1) {
      this.invalidScheduleMsg = (this.invalidDateRange) ?
        ' The following House account cannot be added more than once in Tier 1 of the outgoing schedule for date range starting '
        + this.invalidDateRange + ':' + ' ' + this.userdetail.HouseAccountDetails.NickName :
        ' The following House account cannot be added more than once in Tier 1 of the outgoing schedule:'
        + ' ' + this.userdetail.HouseAccountDetails.NickName;
      return;
    } else if (this.tierErrorType === tieredErrorMsg.HouseErrorTier2) {
      this.invalidScheduleMsg = (this.invalidDateRange) ?
        ' The following House account cannot be added more than once in Tier 2 of the outgoing schedule for date range starting '
        + this.invalidDateRange + ':' +
        ' ' + this.userdetail.HouseAccountDetails.NickName :
        ' The following House account cannot be added more than once in Tier 2 of the outgoing schedule:' +
        ' ' + this.userdetail.HouseAccountDetails.NickName;
      return;
    } else if (this.tierErrorType === tieredErrorMsg.MultipleHouseInBasic) {
      this.invalidScheduleMsg = (this.invalidDateRange) ?
        'The following House account cannot be added more than once in basic outgoing schedule for date range starting ' + this.invalidDateRange + ':' + ' ' + this.userdetail.HouseAccountDetails.NickName
        : `The following House account cannot be added more than once in basic outgoing schedule:` + ' ' + this.userdetail.HouseAccountDetails.NickName;
      return;
    } else {
      if (!this.createSchedule.controls.CustomSplit.value || this.createSchedule.controls.CustomSplit.value === false) {
        if (this.invalidDateRange) {
          this.invalidScheduleMsg = (this.createSchedule.controls.SplitSchedule.value === '2') ?
            (this.selectedTier ?
              'Sum of first year and renewal percentage is not equal to 100% in ' +
              this.selectedTier + ' for date range starting ' + this.invalidDateRange :
              'Sum of first year and renewal percentage is not equal to 100% for date range starting '
              + this.invalidDateRange) :
            (this.selectedTier ?
              'Sum of first year and renewal percentage is not equal to incoming schedule in ' +
              this.selectedTier + ' for date range starting ' + this.invalidDateRange :
              'Sum of first year and renewal percentage is not equal to incoming schedule for date range starting '
              + this.invalidDateRange);
        } else {
          this.invalidScheduleMsg = (this.createSchedule.controls.SplitSchedule.value === '2') ?
            (this.selectedTier ? 'Sum of first year and renewal percentage is not equal to 100% in '
              + this.selectedTier + '.' : 'Sum of first year and renewal percentage is not equal to 100%.') :
            (this.selectedTier ? 'Sum of first year and renewal percentage is not equal to incoming schedule in '
              + this.selectedTier + '.' : 'Sum of first year and renewal percentage is not equal to incoming schedule.');
        }
        return;
      }
    }

  }

  /************Validate custom date schedule******************************* */
  OnValidateCustomSchedule(): boolean {
    const house = this.userdetail && this.userdetail.HouseAccountDetails.UserCredentialId;
    const effDate = this.OnlyDateFormat(this.createNewPolicy.controls.OriginalEffectiveDate.value);
    this.customScheduleErrorType = customScheduleErrorMsg.None;
    this.tierErrorType = tieredErrorMsg.None;
    this.selectedTier = '';

    if (this.miEditList.miDataSource.tableData.length > 0) {
      // Get distinct dates
      const distinctDates = this.distinct(this.miEditList.miDataSource.tableData, (item) => this.OnlyDateFormat(item.CustomStartDate));

      // Check if schedule includes effective date
      if (distinctDates.indexOf(effDate) === -1) {
        this.customScheduleErrorType = customScheduleErrorMsg.MissingEffDate;
        return false;
      }
      // Check if any date is invalid/before eff date in the schedule
      const invalidDates = distinctDates.filter(x => {
        return new Date(x) < new Date(effDate)
      });
      if (invalidDates.length > 0) {
        this.customScheduleErrorType = customScheduleErrorMsg.InvalidDate;
        return false;
      }

      // All dates are fine, now loop through each date and validate its schedule
      for (let i = 0; i < distinctDates.length; i++) {
        const schedule = this.miEditList.miDataSource.tableData.filter(x => this.OnlyDateFormat(x.CustomStartDate) === distinctDates[i])
        // Check if tiered schedule and valid
        if (this.createSchedule.controls.Tier.value === true) {
          const isValid = this.ValidateTieredSchedule(schedule, house);
          if (!isValid) {
            // const invalidDate =  new Date(distinctDates[i]);//new Date(distinctDates[i].replace('-', '/'));
            let invalidDate = new Date(distinctDates[i]); // new Date(distinctDates[i].replace('-', '/'));
            if (isNaN(invalidDate.getTime())) { // Check added for IE validation
              invalidDate = new Date(distinctDates[i].replace('-', '/'));
            }
            this.invalidDateRange = this.mmDDyyyFormat(invalidDate)
            return false;
          }
        }
        let sum = 0;
        const distinctTiers = this.distinct(schedule, (item) => item.TierNumber);
        // Loop through schedule of given date to add values
        for (let j = 0; j < schedule.length; j++) {
          if (this.createSchedule.controls.Tier.value === true) {
            if ((distinctTiers.length === 1 && (schedule[j].TierNumber === '1' || schedule[j].TierNumber === 1)) ||
              (distinctTiers.length === 2 && schedule[j].TierNumber === '2' || schedule[j].TierNumber === 2)) {
              sum += Number(schedule[j].splitpercentage);
              this.selectedTier = schedule[j].TierNumber == '2' ? 'Tier 2' : 'Tier 1';
            }
          } else {
            sum += Number(schedule[j].splitpercentage);
          }
        }
        // Check if sum is 100%
        if (this.createSchedule.controls.SplitSchedule.value === '2' && sum !== 100) {

          let isTier2Exist = false;
          schedule.filter(x => {
            if (x.TierNumber === '2') {
              isTier2Exist = true;
            }
          });
          if (this.selectedTier == 'Tier 1' && !isTier2Exist) {
            this.customScheduleErrorType = customScheduleErrorMsg.InvalidPercentage;
            let invalidDate = new Date(distinctDates[i]); // new Date(distinctDates[i].replace('-', '/'));
            if (isNaN(invalidDate.getTime())) { // Check added for IE validation
              invalidDate = new Date(distinctDates[i].replace('-', '/'));
            }
            this.invalidDateRange = this.mmDDyyyFormat(invalidDate)
            return false;
          } else {
            this.customScheduleErrorType = customScheduleErrorMsg.InvalidPercentage;
            let invalidDate = new Date(distinctDates[i]); // new Date(distinctDates[i].replace('-', '/'));
            if (isNaN(invalidDate.getTime())) { // Check added for IE validation
              invalidDate = new Date(distinctDates[i].replace('-', '/'));
            }
            this.invalidDateRange = this.mmDDyyyFormat(invalidDate)
            return false;
          }
        } else if (this.createSchedule.controls.SplitSchedule.value === '1') {
          ;
          if ((CustomModeData.Mode == 0) || (CustomModeData.Mode == 2 && CustomModeData.CustomType == '1')) {
            const isFirstYear = this.IsFirstYear(distinctDates[i]);
            const incomingFrstYear = (this.isPercentOfPremium === true) ?
              this.createSchedule.controls.FirstYearPercentage.value :
              this.createSchedule.controls.FirstYearPerUnit.value;
            const renewalYear = (this.isPercentOfPremium === true) ?
              this.createSchedule.controls.RenewalPercentage.value : this.createSchedule.controls.RenewalPerUnit.value;
            if ((isFirstYear === true && sum !== Number(incomingFrstYear)) || (isFirstYear === false &&
              sum !== Number(renewalYear))) {
              let invalidDate = new Date(distinctDates[i]); // new Date(distinctDates[i].replace('-', '/'));
              if (isNaN(invalidDate.getTime())) { // Check added for IE validation
                invalidDate = new Date(distinctDates[i].replace('-', '/'));
              }
              this.invalidDateRange = this.mmDDyyyFormat(invalidDate)
              this.customScheduleErrorType = customScheduleErrorMsg.InvalidPremium;
              return false;
            }
          } else {
            const isValidSchedule = this.OnValidateNonGradedSchedule(distinctDates[i], sum) == '-1' ? false : true;
            if (isValidSchedule == false) {
              this.invalidDateRange = this.mmDDyyyFormat(new Date(distinctDates[i]));
              this.customScheduleErrorType = customScheduleErrorMsg.InvalidPremium;
              return false;
            }
          }
        }
      }

    }
    return true;
  }

  // #######################################################################################################################################
  OnPageRedirection(value, control) {
    if (this.router.url.indexOf('advance-Search') > -1) {

      if (!control) {

        this.buttonClicked = true;
      }
      if (value.data) {
        this.commonService.value = this.getRouteParamtersService.ClientId;
        this.route.navigate(['policy/advance-Search', value.data.parentTab,
          value.data.pageSize, value.data.pageIndex]);
      } else {
        if (value === 'Cancel') {
          this.route.navigate(['policy/advance-Search', this.getRouteParamtersService.parentTab,
            this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex]);
          // this.getPolicyDetails();
        } else {
          if (this.router.url.indexOf('advance-Search') > -1) {
            this.route.navigate(['policy/advance-Search', this.getRouteParamtersService.parentTab,
              this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex]);
          } else {
            this.route.navigate(['policy/advance-Search', '3', '10', '0'], {
              queryParams: {
                client: this.getRouteParamtersService.ClientId
              }
            });
          }
        }
      }
      this.showLoader = false;
    } else {
      if (!control) {
        this.buttonClicked = true;
      }
      if (value.data) {
        this.commonService.value = this.getRouteParamtersService.ClientId;
        this.route.navigate(['policy/policyListing', value.data.parentTab,
          value.data.pageSize, value.data.pageIndex], { queryParams: { client: this.getRouteParamtersService.ClientId } });
      } else {
        if (value === 'Cancel') {
          this.route.navigate(['policy/policyListing', this.getRouteParamtersService.parentTab,
            this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex],
            { queryParams: { client: this.getRouteParamtersService.ClientId } });
          // this.getPolicyDetails();
        } else {
          if (this.router.url.indexOf('policy/editPolicy') > -1) {
            this.route.navigate(['policy/policyListing', this.getRouteParamtersService.parentTab,
              this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex], {
              queryParams: {
                client: this.getRouteParamtersService.ClientId
              }
            });
          } else {
            this.route.navigate(['policy/policyListing', '3', '10', '0'], {
              queryParams: {
                client: this.getRouteParamtersService.ClientId
              }
            });
          }
        }
      }
      this.showLoader = false;
    }
  }
  // #######################################################################################################################################
  OpenPolicyCreationdilog() {
    this.showLoader = false;
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: this.pagename !== 'Create new policy' ? ' Policy Updated Successfully' : 'Policy Created Successfully ',
        subTitle: this.pagename !== 'Create new policy' ? 'The policy has been successfully updated in the system.' :
          'The policy has been successfully added in the system.',
        primarybuttonName: 'Create Another Policy',
        secondryButtonName: 'Go to Policy List', // 'Go to Smart Fields/Notes',
        isCommanFunction: true,
        numberofButtons: this.pagename === 'Create new policy' ? '2' : '1'
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.route.navigate(['policy/CreateNewPolicy', this.getRouteParamtersService.ClientId, this.getRouteParamtersService.parentTab,
          this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex]);
      }
    });
  }
  // #######################################################################################################################################
  OpenClientChangedilog(data, value, getOldClientId) {
    const dialogRef = this.dialog.open(ShowConfirmationComponent, {
      width: '450px',
      data: {
        headingTitle: 'Client Change',
        subTitle: 'Are you sure you want to change client for this policy?',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => { debugger;
      if (result === true) {
        // this.createNewPolicy.controls.Insured.setValue(data.source.selected.viewValue);
        this.clientId = value;
        this.clientName = data.option.value.Name;
        this.client.controls.ClientList.setValue(this.clientId);
       
      } else {
        this.client.controls.ClientList.setValue(getOldClientId);
        this.client.controls.ClientObject.setValue(this.clientName);
      }
    });
  }
  // #######################################################################################################################################
  onMenuItemClick(value) {
    const HouseAccountId = this.userdetail && this.userdetail.HouseAccountDetails['UserCredentialId'];
    if (value.name === 'Delete') {
      if (value.data.PayeeUserCredentialId === HouseAccountId) {
        let count = 0;
        if (this.miEditList.miDataSource.tableData && this.miEditList.miDataSource.tableData.length >= 1) {
          this.miEditList.miDataSource.tableData.filter(element => {
            if (element.PayeeUserCredentialId === this.userdetail.HouseAccountDetails.UserCredentialId) {
              count++;
            }
          });
        }
        if (this.createSchedule.controls.Tier.value === false && this.createSchedule.controls.CustomSplit.value === false) {
          if (count === 2) {
            this.isHouseAccBttnDisabled = true;
          } else {
            this.isHouseAccBttnDisabled = false;
          }
        } else {
          this.isHouseAccBttnDisabled = false;
        }
      }
      this.isAddPayeeDisabled = false;
      this.miEditList.miDataSource.tableData.splice(value.event, 1);
      this.miEditList.cachedList = this.miEditList.miDataSource.tableData;
      this.miEditList.refreshHandler.next(true);
      if (this.miEditList.cachedList.length === 0) {
        this.isSplitEvenlyDisabled = true
      }
    }
  }
  // #######################################################################################################################################
  OnPolicyNumberFocusChange(data) {
    if (data.currentTarget.value) {
      while (data.currentTarget.value.charAt(0) === '0')
        data.currentTarget.value = data.currentTarget.value.slice(1);
      this.createNewPolicy.controls.PolicyNumber.setValue(data.currentTarget.value);
    }

  }

  /**********************************************Outgoing Schedules - Add HouseAccount ***********************************************/
  onAddHouseAccount() {
    this.showLoader = true;

    if (this.createSchedule.controls.CustomSplit.value === true) {
      this.OnAddHouseCustomStartDate();
      this.customSchedule = this.miEditList.miDataSource.tableData;
    } else {
      this.OnAddHouseBasicCustomSplit();
    }
    this.showLoader = false;
  }
  // ###################################################################################################################################
  // ----------------------------------This function used for custom startDate split when toggle button  enabled------------------------
  OnAddHouseCustomStartDate() {
    const customScheduleList = [];
    for (let schedule = 0; schedule < this.miEditList.miDataSource.tableData.length; schedule++) {
      this.customSchedule = this.miEditList.miDataSource.tableData[schedule];
      this.customSchedule.CustomStartDateString = this.OnlyDateFormat(this.customSchedule.CustomStartDate);
      customScheduleList.push(this.customSchedule);
    }
    const result = Array.from(new Set(customScheduleList.map(s => s.CustomStartDateString))).map(customdate => {
      if (customScheduleList.find(s => s.CustomStartDateString === customdate)) {
        let SplitPercentageSum = 0;
        let count = 0;
        for (const schedule of customScheduleList) {
          if (schedule.CustomStartDateString === customdate) {
            SplitPercentageSum += Number(schedule.splitpercentage);
          }
          if (this.createSchedule.controls.Tier.value === true) {
            if (schedule.CustomStartDateString === customdate &&
              schedule.PayeeUserCredentialId === this.userdetail.HouseAccountDetails['UserCredentialId']) {
              count++;
            }
            if (count === 2) {
              this.isHouseAccountExist = true;
              break;
            } else {
              this.isHouseAccountExist = false;
            }
          } else {
            if (schedule.CustomStartDateString === customdate &&
              schedule.PayeeUserCredentialId === this.userdetail.HouseAccountDetails['UserCredentialId']) {
              this.isHouseAccountExist = true
              break;
            } else {
              this.isHouseAccountExist = false;
            }
          }
        }

        if (this.isHouseAccountExist === false) {
          let remainingPercentage = 0;
          if (this.createSchedule.controls.SplitSchedule.value === '1') {
            const checkDate = this.IsFirstYear(customdate);
            if (checkDate === true) {
              if (this.createSchedule.controls.ScheduleTypeId.value === '1') {
                if (SplitPercentageSum > Number(this.createSchedule.controls.FirstYearPercentage.value)) {
                  remainingPercentage = 0
                } else {
                  remainingPercentage = Number(this.createSchedule.controls.FirstYearPercentage.value) - SplitPercentageSum
                }
              } else {
                if (SplitPercentageSum > Number(this.createSchedule.controls.FirstYearPerUnit.value)) {
                  remainingPercentage = 0
                } else {
                  remainingPercentage = Number(this.createSchedule.controls.FirstYearPerUnit.value) - SplitPercentageSum
                }
              }
            } else {
              if (this.createSchedule.controls.ScheduleTypeId.value === '1') {
                if (SplitPercentageSum > Number(this.createSchedule.controls.RenewalPercentage.value)) {
                  remainingPercentage = 0
                } else {
                  remainingPercentage = Number(this.createSchedule.controls.RenewalPercentage.value) - SplitPercentageSum
                }
              } else {
                if (SplitPercentageSum > Number(this.createSchedule.controls.RenewalPerUnit.value)) {
                  remainingPercentage = 0
                } else {
                  remainingPercentage = Number(this.createSchedule.controls.RenewalPerUnit.value) - SplitPercentageSum
                }
              }
            }
          } else {
            if (SplitPercentageSum > 100) {
              remainingPercentage = 0
            } else {
              remainingPercentage = 100 - SplitPercentageSum;
            }
          }
          for (let i = 0; i < 2; i++) {
            customdate = customdate.replace('-', '/');
          }
          this.miEditList.cachedList.push({
            'PayeeUserCredentialId':
              this.userdetail && this.userdetail.HouseAccountDetails.UserCredentialId,
            'PayeeName': this.userdetail && this.userdetail.HouseAccountDetails.NickName,
            'CustomStartDate': new Date(customdate),
            'splitpercentage': this.createSchedule.controls.Tier.value === true ? 0 : remainingPercentage,
            'OutgoingScheduleId': Guid.create().toJSON().value,
            'PolicyId': this.CreatePolicyId,
            'ScheduleTypeId': 2
          });
          ;
          this.miEditList.cachedList = this.miEditList.cachedList.sort(this.sortFunction);
          this.miEditList.refreshHandler.next(true);
        }
      }
    });
    if (this.miEditList.miDataSource.tableData.length === 0) {
      let remainingPercentage = 100;
      if (this.createSchedule.controls.SplitSchedule.value === '1') {
        remainingPercentage = this.createSchedule.controls.ScheduleTypeId.value === '1' ?
          Number(this.createSchedule.controls.FirstYearPercentage.value) :
          Number(this.createSchedule.controls.FirstYearPerUnit.value)
      }
      this.miEditList.cachedList.push({
        'PayeeUserCredentialId':
          this.userdetail && this.userdetail.HouseAccountDetails.UserCredentialId,
        'PayeeName': this.userdetail.HouseAccountDetails.NickName,
        'CustomStartDate': new Date(Date.now()),
        'splitpercentage': this.createSchedule.controls.Tier.value === true ? 0 : remainingPercentage,
        'OutgoingScheduleId': Guid.create().toJSON().value,
        'PolicyId': this.CreatePolicyId,
        'ScheduleTypeId': 2
      });
      this.outgoingSchedule = [];
      this.miEditList.refreshHandler.next(true);
    }
  }
  // #######################################################################################################################################
  // -----------------------------------------This function used for Basic custom split when toggle button  disabled------------------------
  OnAddHouseBasicCustomSplit() {

    this.isSplitEvenlyDisabled = false;
    if (this.createSchedule.controls.Tier.value === false) {
      this.isHouseAccBttnDisabled = true;
    } else {
      let count = 0;
      if (this.miEditList.miDataSource.tableData && this.miEditList.miDataSource.tableData.length >= 1) {
        this.miEditList.miDataSource.tableData.filter(element => {
          if (element.PayeeUserCredentialId === this.userdetail.HouseAccountDetails.UserCredentialId) {
            count++;
          }
        });
        if (count === 1) {
          this.isHouseAccBttnDisabled = true;
        } else {
          this.isHouseAccBttnDisabled = false;
        }
      } else {
        this.isHouseAccBttnDisabled = false;
      }
    }
    if (this.miEditList.miDataSource.tableData.length === 0) {
      let firstYear = 100;
      let renewablesYear = 100;
      if (this.createSchedule.controls.SplitSchedule.value === '1') {
        firstYear = this.createSchedule.controls.ScheduleTypeId.value === '1' ?
          Number(this.createSchedule.controls.FirstYearPercentage.value) :
          Number(this.createSchedule.controls.FirstYearPerUnit.value);
        renewablesYear = this.createSchedule.controls.ScheduleTypeId.value === '1' ?
          Number(this.createSchedule.controls.RenewalPercentage.value) :
          Number(this.createSchedule.controls.RenewalPerUnit.value);
      }
      this.miEditList.cachedList.push({
        'PayeeUserCredentialId':
          this.userdetail && this.userdetail.HouseAccountDetails.UserCredentialId,
        'PayeeName': this.userdetail && this.userdetail.HouseAccountDetails.NickName,
        'RenewalPercentage': this.createSchedule.controls.Tier.value === true ? '0' : renewablesYear,
        'FirstYearPercentage': this.createSchedule.controls.Tier.value === true ? '0' : firstYear,
        'ScheduleTypeId': this.createSchedule.controls.SplitSchedule.value,
        'PolicyId': this.CreatePolicyId,
        'OutgoingScheduleId': Guid.create().toJSON().value
      });
    } else {
      for (const OutgoingScheduleData of this.miEditList.miDataSource.tableData) {
        this.firstYearScheduleSum += Number(OutgoingScheduleData.FirstYearPercentage);
        this.renewablesYearScheduleSum += Number(OutgoingScheduleData.RenewalPercentage);
      }
      let firstYear = 0;
      let renewablesYear = 0;
      if (this.createSchedule.controls.SplitSchedule.value === '1') {
        firstYear = this.createSchedule.controls.ScheduleTypeId.value === '1' ?
          Number(this.createSchedule.controls.FirstYearPercentage.value) - this.firstYearScheduleSum :
          Number(this.createSchedule.controls.FirstYearPerUnit.value) - this.firstYearScheduleSum;
        renewablesYear = this.createSchedule.controls.ScheduleTypeId.value === '1' ?
          Number(this.createSchedule.controls.RenewalPercentage.value) - this.renewablesYearScheduleSum :
          Number(this.createSchedule.controls.RenewalPerUnit.value) - this.renewablesYearScheduleSum;
        if (this.createSchedule.controls.ScheduleTypeId.value === '1') {
          if (this.firstYearScheduleSum > this.createSchedule.controls.FirstYearPercentage.value) {
            firstYear = 0;
          }
          if (this.renewablesYearScheduleSum > this.createSchedule.controls.RenewalPercentage.value) {
            renewablesYear = 0;
          }
          if (this.createSchedule.controls.Tier.value === true) {
            renewablesYear = 0;
            firstYear = 0;
          }
        } else {
          if (this.renewablesYearScheduleSum > this.createSchedule.controls.RenewalPerUnit.value) {
            renewablesYear = 0;
          }
          if (this.firstYearScheduleSum > this.createSchedule.controls.FirstYearPerUnit.value) {
            firstYear = 0;
          }
        }
        this.firstYearScheduleSum = 0;
        this.renewablesYearScheduleSum = 0;
      } else {
        if (this.firstYearScheduleSum > 100) {
          firstYear = 0;
        } else {
          firstYear = 100 - this.firstYearScheduleSum;
        }
        if (this.renewablesYearScheduleSum > 100) {
          renewablesYear = 0;
        } else {
          renewablesYear = 100 - this.renewablesYearScheduleSum;
        }
        if (this.firstYearScheduleSum > 100 || this.createSchedule.controls.Tier.value === true) {
          firstYear = 0;
        }
        if (this.renewablesYearScheduleSum > 100 || this.createSchedule.controls.Tier.value === true) {
          renewablesYear = 0;
        }
        this.firstYearScheduleSum = 0;
        this.renewablesYearScheduleSum = 0;
      }
      this.miEditList.cachedList.push({
        'PayeeUserCredentialId':
          this.userdetail && this.userdetail.HouseAccountDetails.UserCredentialId,
        'PayeeName': this.userdetail && this.userdetail.HouseAccountDetails.NickName,
        'RenewalPercentage': renewablesYear,
        'FirstYearPercentage': firstYear,
        'ScheduleTypeId': this.createSchedule.controls.SplitSchedule.value,
        'PolicyId': this.CreatePolicyId,
        'OutgoingScheduleId': Guid.create().toJSON().value
      });
    }
    this.customSchedule = [];
    this.outgoingSchedule = this.miEditList.miDataSource.tableData;
    this.miEditList.refreshHandler.next(true);
  }
  OnChnageTierValue(value) {

    let count = 0;
    if (this.miEditList.miDataSource.tableData && this.miEditList.miDataSource.tableData.length >= 1) {
      this.miEditList.miDataSource.tableData.filter(element => {
        if (element.PayeeUserCredentialId === this.userdetail.HouseAccountDetails.UserCredentialId) {
          count++;
        }
      });
      if (this.createSchedule.controls.CustomSplit.value === false &&
        this.miEditList.miDataSource.tableData && this.miEditList.miDataSource.tableData.length > 0) {
        if (this.createSchedule.controls.Tier.value === false) {
          this.isHouseAccBttnDisabled = false;
        } else {
          if (count === 2) {
            this.isHouseAccBttnDisabled = true;
          } else {
            this.isHouseAccBttnDisabled = false;
          }
        }
      }
    }
  }
  // ###############################################################################################################################
  // ----------------------------This function used for sort a custom schedule when add a house account ---------------------------------
  sortFunction(firstDate, seconddate) {
    const dateA = new Date(firstDate.CustomStartDate).setHours(0, 0, 0, 0);
    const dateB = new Date(seconddate.CustomStartDate).setHours(0, 0, 0, 0);

    if (dateA === dateB) {
      const name1 = firstDate.PayeeName.toLowerCase();
      const name2 = seconddate.PayeeName.toLowerCase();
      return (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
    } else {
      return dateA > dateB ? 1 : -1;
    }
  };

  // ###########################################################################################################################
  /**********************************************************Outgoing Schedules - Add Payee *********************************************/
  OnAddPayee(event) {
    const isWritepermission = this.userdetail.Permissions[1].Permission === 2;
    this.otherData = {
      'PolicyId': this.CreatePolicyId, 'ScheduleTypeId': this.createSchedule.controls.SplitSchedule.value,
      'isdisabled': true, 'customSplit': this.createSchedule.controls.CustomSplit.value, 'isWritePermission': isWritepermission ? true : false
    };
    let agents: any;
    agents = Object.assign([], this.primaryAgentList);
    const house = this.userdetail.HouseAccountDetails.UserCredentialId;
    // Uncheck all agents in add payee list
    for (let i = 0; i < agents.length; i++) {
      // reset checkbox to false
      agents[i].CheckBox.FormattedValue = false;
      if (agents[i].UserCredentialID === house) { // remove house account
        agents.splice(i, 1);
        i = i - 1;
      }
    }
    // Remove added agents in case of basic schedule
    if ((this.miEditList.miDataSource.tableData)
      && (!this.createSchedule.controls.CustomSplit.value || this.createSchedule.controls.CustomSplit.value === false)
    ) {
      let j = 0;
      while (j < this.miEditList.miDataSource.tableData.length) {
        const listItem = this.miEditList.miDataSource.tableData[j]
        for (let i = 0; i < agents.length; i++) {
          // Remove already added agents in schedule, only when basic schedule selected
          if (listItem.PayeeUserCredentialId === agents[i].UserCredentialID) {
            agents.splice(i, 1);
            i = i - 1;
          }
        }
        j++;
      }
    }
    const dilogRef = this.dialog.open(ListingComponent, {
      data: {
        class: 'add-payees',
        isRowClickable: false,
        primaryButton: 'Add',
        secondryButton: 'Cancel',
        isPrimaryControl: false,
        isSecondryControl: false,
        columnLabels: ['Checkbox', 'Nickname', 'First Name', 'Last Name'],
        displayedColumns: ['CheckBox', 'NickName', 'FirstName', 'LastName'],
        columnIsSortable: ['false', 'true', 'true', 'true'],
        showPaging: false,
        title: 'Add Payees',
        listingURL: this.getURL.DomainDataList.GetPrimaryAgent,
        cachedList: agents,
        isClientSideList: true,
        isEditableGrid: false,
        placeHolder: 'Search: Nickname, First name and Last name',
        postData: {
          licenseeId: this.userdetail && this.userdetail['LicenseeId'],
          roleIdToView: 3,
          listParams: '',
          loggedInUser: this.createEmptyGuid // to fetch list including logged in user
        },
        otherData: this.otherData
      },
      disableClose: true,
      width: '1100px'
    });
    dilogRef.afterClosed().subscribe(result => {

      if (!result || result === false) {
      } else {
        for (let i = 0; i < result.length; i++) {
          this.miEditList.cachedList.push(result[i]);
        }
        if (this.miEditList.cachedList.length === this.primaryAgentList.length - 1) {
          if (this.createSchedule.controls.CustomSplit.value === false) {
            this.isAddPayeeDisabled = true;
          }
        }
        if (this.createSchedule.controls.CustomSplit.value === false) {
          this.isSplitEvenlyDisabled = false;
          this.outgoingSchedule = this.miEditList.cachedList;
          this.customSchedule = [];
        } else {
          this.customSchedule = this.miEditList.cachedList;
          this.outgoingSchedule = [];
        }
        this.miEditList.refreshHandler.next(true);

      }
    });
  }
  // ###########################################################################################################################

  setIsManuallyChanged()
  {
    //alert("insetIsManuallyChanged");
    //alert("this.isOrginalEffectiveDateProducyChangeFunctionCalled="+this.isOrginalEffectiveDateProducyChangeFunctionCalled)
    // this.PolicyTypeValue = this.createNewPolicy.controls.PolicyType.value === 'New' ? "New" : "Replace";

    //alert("this.createNewPolicy.controls.PolicyType.value="+this.createNewPolicy.controls.PolicyType.value);

    // if(this.isOrginalEffectiveDateProducyChangeFunctionCalled === false)
    // {
      
      const dialogRef = this.dialog.open(ShowConfirmationComponent, {
        width: '450px',
        data: {
          headingTitle: 'Confirmation',
          // tslint:disable-next-line:max-line-length
          subTitle: 'Do you want to change Policy Type?',
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if(result)
        {
          //alert("in1");
          this.isManuallyChanged = true;
          this.PolicyTypeValue = this.createNewPolicy.controls.PolicyType.value;
          this.isPolicyTypeFunctionCalled = true;
        }
        else{
          //alert("in2");

          //alert("this.getIsManuallyChanged="+this.getIsManuallyChanged);

          //alert("this.createNewPolicy.controls.PolicyType.value="+this.createNewPolicy.controls.PolicyType.value);

          if(this.isManuallyChanged === false)
          {
            this.isManuallyChanged = false;
          }

          let noPolicyType = this.createNewPolicy.controls.PolicyType.value;
          if(noPolicyType === "Replace")
          {
              //alert("in1");
              this.createNewPolicy.controls.PolicyType.setValue("New");
          }
          else
          {
            //alert("in2");
            this.createNewPolicy.controls.PolicyType.setValue("Replace");
          }

          // this.createNewPolicy.controls.PolicyType.setValue(this.PolicyTypeValue);
        }
      });
    //}
  }

  // -----------------------------------This method is used for a Tier Schedule Split Evenly in case of % Commission----------------------
  OnCommTierScheduleSplitEvenly() {
    let Tier2Count = 0;
    let Tier1Count = 0;
    this.miEditList.miDataSource.tableData.filter(element => {
      if (element.TierNumber) {
        if (element.TierNumber === '2' || element.TierNumber === 2) {
          Tier2Count++;
        } else {
          Tier1Count++;
        }
      }
    });
    if (Tier2Count !== 0) {
      const SplitAmount = (100 / Tier2Count).toFixed(2);
      const ScheduleList = [];
      for (const schedule of this.miEditList.miDataSource.tableData) {
        if (schedule.TierNumber === '2' || schedule.TierNumber === 2) {
          schedule.FirstYearPercentage = SplitAmount;
          schedule.RenewalPercentage = SplitAmount;
        }
        ScheduleList.push(schedule);
        this.miEditList.miDataSource.tableData = ScheduleList;
      }
    } else {
      if (Tier1Count !== 0 && Tier2Count === 0) {
        const SplitAmount = (100 / Tier1Count).toFixed(2);
        const ScheduleList = [];
        for (const schedule of this.miEditList.miDataSource.tableData) {
          if (schedule.TierNumber === '1' || schedule.TierNumber === 1) {
            schedule.FirstYearPercentage = SplitAmount;
            schedule.RenewalPercentage = SplitAmount;
          }
          ScheduleList.push(schedule);
          this.miEditList.miDataSource.tableData = ScheduleList;
        }
      }
    }

  }
  // #######################################################################################################################################
  // ---------------------------------------This method is used for a Tier Schedule Split Evenly in case of % Premium---------------------
  OnPrmTierScheduleSplitEvenly(firstYearper, renewableper) {
    let Tier2Count = 0;
    let Tier1Count = 0;
    this.miEditList.miDataSource.tableData.filter(element => {

      if (element.TierNumber) {
        if (element.TierNumber === '2' || element.TierNumber === 2) {
          Tier2Count++;
        } else {
          Tier1Count++;
        }
      }
    });
    if (Tier2Count !== 0) {
      //  const SplitAmount = (100 / Tier2Count).toFixed(2);
      const ScheduleList = [];
      for (const schedule of this.miEditList.miDataSource.tableData) {
        if (schedule.TierNumber === '2' || schedule.TierNumber === 2) {
          schedule.FirstYearPercentage = (firstYearper / Tier2Count).toFixed(2);
          schedule.RenewalPercentage = (renewableper / Tier2Count).toFixed(2);
        }
        ScheduleList.push(schedule);
        this.miEditList.miDataSource.tableData = ScheduleList;
      }
    } else {
      if (Tier1Count !== 0 && Tier2Count === 0) {
        const SplitAmount = (100 / Tier1Count).toFixed(2);
        const ScheduleList = [];
        for (const schedule of this.miEditList.miDataSource.tableData) {
          if (schedule.TierNumber === '1' || schedule.TierNumber === 1) {
            schedule.FirstYearPercentage = (firstYearper / Tier1Count).toFixed(2);
            schedule.RenewalPercentage = (renewableper / Tier1Count).toFixed(2);
          }
          ScheduleList.push(schedule);
          this.miEditList.miDataSource.tableData = ScheduleList;
        }
      }
    }

  }
  // #####################################################################################################################################
  PolicieslistingDilogBox() {
    const isWritepermission = this.userdetail.Permissions[1].Permission === 2;
    this.otherData = { 'PolicyId': this.getRouteParamtersService.PolicyId, 'isdisabled': true, 'isWritePermission': isWritepermission ? true : false };
    const dilogRef = this.dialog.open(ListingComponent, {
      data: {
        class: 'policies-count',
        placeHolder: 'Search: Policy #, Insured, Carrier, Product',
        title: 'Policies  Count',
        isRowClickable: true,
        primaryButton: 'Save',
        secondryButton: 'Cancel',
        isPrimaryControl: true,
        isSecondryControl: true,
        isClientSideList: true,
        columnLabels: ['', 'Policy#', 'Insured', 'Carrier', 'Effective', 'Product', 'Status', 'CompTypeName'],
        displayedColumns: ['SelectData', 'PolicyNumber', 'Insured', 'Carrier', 'Effective', 'Product', 'Status', 'CompTypeName'],
        columnIsSortable: ['false', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'true'],
        isEditableGrid: true,
        PrimaryControlType: {
          Value: '',
          label: 'Policy Term Date',
          Type: 'mat-datepicker'
        },
        SecondryControlType: {
          Value: this.terminationReasonList,
          label: 'Term Reason',
          Type: 'Mat-select',
          DefaultselectedValue: this.terminationReasonList[4].TerminationReasonId
        },
        listingURL: this.getURL.DomainDataList.GetReplacedPolicyList,
        postData: {
          'clientId': this.getRouteParamtersService.ClientId,
          'licenseeId': this.userdetail && this.userdetail['LicenseeId'],
          'loggedInUserID': this.userdetail && this.userdetail['UserCredentialID'],
          'policyID': this.getRouteParamtersService.PolicyId
        },
        otherData: this.otherData,

      },
      disableClose: true,
      width: '1100px'
    });
    dilogRef.afterClosed().subscribe(result => {
      if (!result || result === false) {
      } else {
        this.replacedPolicyData = {
          'TerminationReasonID': result.SecondryControl,
          'PolicyTerminationDate': this.setDateFormat(result.primaryControl),
          'listData': result.listdata,
          'PolicyStatusId': 1
        }
        const schedule = [];
        for (let i = 0; i < this.replacedPolicyData.listData.schedule.length; i++) {
          this.ReplacedPolicyOutgoingSchedule = this.replacedPolicyData.listData.schedule[i];
          this.ReplacedPolicyOutgoingSchedule.PolicyId = this.CreatePolicyId;
          this.ReplacedPolicyOutgoingSchedule.OutgoingScheduleId = Guid.create().toJSON().value;
          schedule.push(this.ReplacedPolicyOutgoingSchedule);
        }
        this.ReplacedPolicyOutgoingSchedule = schedule;
        this.onFieldAutoPopulate(result);
      }
    });
  }
  // **************************************************************************************************************************************** */
  OnCheckScheduleList() {
    const isWritepermission = this.userdetail.Permissions[1].Permission === 2
    this.otherData = { 'PolicyId': this.getRouteParamtersService.PolicyId, 'isdisabled': true, 'isWritePermission': isWritepermission ? true : false };
    const dilogRef = this.dialog.open(ListingComponent, {
      data: {
        class: 'policies-count',
        placeHolder: 'Search: Title',
        title: 'Named Schedule List',
        isRowClickable: true,
        primaryButton: 'Save',
        secondryButton: 'Cancel',
        isPrimaryControl: false,
        isSecondryControl: false,
        isClientSideList: true,
        columnLabels: ['', 'Title',],
        displayedColumns: ['SelectData', 'Title'],
        columnIsSortable: ['false', 'true'],
        showPaging: false,
        isEditableGrid: true,
        listingURL: this.policyManagerUrl.PolicyDetails.CheckSchedulesList,
        postData: {
          'licenseeId': this.userdetail && this.userdetail['LicenseeId'],
        },
        otherData: this.otherData,

      },
      disableClose: true,
      width: '630px',
    });
    dilogRef.afterClosed().subscribe(result => {
      if (result) {
        const ScheduleTypeId = result.listdata.ScheduleTypeId.toString();
        this.createSchedule.controls.ScheduleTypeId.setValue(ScheduleTypeId);
        this.createSchedule.controls.SplitPercentage.setValue(Number(result.listdata.StringSplitPercentage.replace('%', '')).toFixed(2));
        this.createSchedule.controls.Advance.setValue(result.listdata.Advance);
        
        if (result.listdata.Mode == 0) {

          let firstYear = result.listdata.ScheduleTypeId == 1 ? result.listdata.StringFirstYearPercentage.replace('%', '') : result.listdata.StringFirstYearPercentage.replace('$', '');
          firstYear = firstYear && firstYear != "" ? Number(firstYear).toFixed(2) : '0.00';
          let renewalYear = result.listdata.ScheduleTypeId == 1 ? result.listdata.StringRenewalPercentage.replace('%', '') : result.listdata.StringRenewalPercentage.replace('$', '');
          renewalYear = renewalYear && renewalYear != "" ? Number(renewalYear).toFixed(2) : '0.00';
          if (result.listdata.ScheduleTypeId === 1) {
            result.listdata.FirstYearPercentage = firstYear;
            result.listdata.RenewalPercentage = renewalYear;
          } else {
            result.listdata.FirstYearPercentage = firstYear;
            result.listdata.RenewalPercentage = renewalYear;
          }
          this.createSchedule.controls.SplitSchedule.enable();
        }
        else {
          if (result.listdata.CustomType == '1') {
            this.createSchedule.controls.SplitSchedule.disable();
            this.createSchedule.controls.SplitSchedule.setValue('2');
          }
          else {
            this.createSchedule.controls.SplitSchedule.enable();
          }
        }
        if (result.listdata.ScheduleTypeId == '2') {
          this.customScheduleData['isPercentOfPremium'] = false;
        } else {
          this.customScheduleData['isPercentOfPremium'] = true;
        }
        this.customScheduleData.isScheduleDataFound = true;
        this.customScheduleData.ScheduleData = result.listdata;

        // if (result.listdata.ScheduleTypeId === 1) {
        //   this.createSchedule.controls.FirstYearPercentage.setValue(Number(
        //     result.listdata.StringFirstYearPercentage.replace('%', '')).toFixed(2));
        //   this.createSchedule.controls.RenewalPercentage.setValue(Number(
        //     result.listdata.StringRenewalPercentage.replace('%', '')).toFixed(2));
        //   this.createSchedule.controls.FirstYearPerUnit.setValue(0.00);
        //   this.createSchedule.controls.RenewalPerUnit.setValue(0.00);
        // } else {
        //   this.createSchedule.controls.FirstYearPerUnit.setValue(Number(
        //     result.listdata.StringFirstYearPercentage.replace('$', '')).toFixed(2));
        //   this.createSchedule.controls.RenewalPerUnit.setValue(Number(result.listdata.StringRenewalPercentage.replace('$', '')).toFixed(2));
        //   this.createSchedule.controls.FirstYearPercentage.setValue(0.00);
        //   this.createSchedule.controls.RenewalPercentage.setValue(0.00);
        // }
      }
    });
  }
  // ######################################################################################################################################
  onFieldAutoPopulate(result) {
    if (result && this.route.url.indexOf('policy/CreateNewPolicy') > -1) {
      this.createNewPolicy.controls.Enrolled.setValue(result.listdata.Enrolled);
      this.createNewPolicy.controls.Eligible.setValue(result.listdata.Eligible);
      this.createNewPolicy.controls.Insured.setValue(result.listdata.Insured);
      this.createSchedule.controls.SplitBasedSchedule.setValue(result.listdata.CustomDateType);
      this.createSchedule.controls.CustomSplit.setValue(result.listdata.IsCustomBasicSchedule);
      this.createSchedule.controls.Tier.setValue(result.listdata.IsTieredSchedule);
      if (result.listdata.schedule && result.listdata.schedule.length > 0) {
        this.createSchedule.controls.SplitSchedule.setValue(result.listdata.schedule[0].ScheduleTypeId.toString());
      }
      if (this.createSchedule.controls.CustomSplit.value === true) {
        const customScheduleList = [];
        for (let schedule = 0; schedule < this.ReplacedPolicyOutgoingSchedule.length; schedule++) {
          this.customSchedule = this.ReplacedPolicyOutgoingSchedule[schedule];
          this.customSchedule.CustomStartDate = new Date(this.customSchedule.CustomStartDateString);
          customScheduleList.push(this.customSchedule);
        }
        this.customSchedule = customScheduleList;
      } else {
        this.outgoingSchedule = this.ReplacedPolicyOutgoingSchedule;
        if (this.outgoingSchedule && this.outgoingSchedule.length > 0) {
          this.isSplitEvenlyDisabled = false;
        }
      }
      const EffectiveDateCOnversion = new Date(result.primaryControl)
      if (this.createNewPolicy.controls.OriginalEffectiveDate.value !== null) {
        this.createNewPolicy.controls.OriginalEffectiveDate.setValue(EffectiveDateCOnversion);
      }
    }
  }
  // #######################################################################################################################################
  IsFirstYear(date) {
    const origDate = this.OnlyDateFormat(this.createNewPolicy.controls.OriginalEffectiveDate.value);
    const nextYear = this.OnlyDateFormat(new Date(this.createNewPolicy.controls.OriginalEffectiveDate.value.getFullYear() + 1,
      this.createNewPolicy.controls.OriginalEffectiveDate.value.getMonth(),
      this.createNewPolicy.controls.OriginalEffectiveDate.value.getDate()))
    if (origDate) {
      if (date >= origDate && date < nextYear) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  // ##################################################################################################################

  //----------------------------Custom Schedule Code starting------------------------------------------------------------


  OnIncomingScheduleChange(data) {
    this.isPercentOfPremium = data.value === '1' ? true : false;
    this.customScheduleData['isPercentOfPremiumClicked'] = true;
    if (this.createSchedule.controls.ScheduleTypeId.value === '2') {
      this.customScheduleData['isPercentOfPremium'] = false;
    } else {
      this.customScheduleData['isPercentOfPremium'] = true;
    }
	
	if (this.createSchedule.controls.ScheduleTypeId.value === '2' && this.createSchedule.controls.SplitSchedule.value === '1') 
    {
      this.miEditList.fieldType["FirstYearPercentage"].setLabel("$");
      this.miEditList.fieldType["RenewalPercentage"].setLabel("$");
      this.miEditList.fieldType["splitpercentage"].setLabel("$");
    }
    else
    {
      this.miEditList.fieldType["FirstYearPercentage"].setLabel("%");
      this.miEditList.fieldType["RenewalPercentage"].setLabel("%");
      this.miEditList.fieldType["splitpercentage"].setLabel("%");
    }
  }
  
  OnOutgoingScheduleChange(data)
  { 
    //this.getScheduleList();
    if (this.createSchedule.controls.ScheduleTypeId.value === '2' && this.createSchedule.controls.SplitSchedule.value === '1') 
    {
      this.miEditList.fieldType["FirstYearPercentage"].setLabel("$");
      this.miEditList.fieldType["RenewalPercentage"].setLabel("$");
      this.miEditList.fieldType["splitpercentage"].setLabel("$");
    }
    else
    {
      this.miEditList.fieldType["FirstYearPercentage"].setLabel("%");
      this.miEditList.fieldType["RenewalPercentage"].setLabel("%");
      this.miEditList.fieldType["splitpercentage"].setLabel("%");
    }
  }

  OnSaveCustomScheduleData(scheduleData) {
    CustomModeData.Mode = scheduleData.formData.controls.Mode.value;
    CustomModeData.CustomType = scheduleData.formData.controls.CustomType.value;
    if (scheduleData.formData.controls.Mode.value === 0) {
      CustomModeData.FirstYearPercentage = this.customScheduleData['isPercentOfPremium'] == true ?
        scheduleData.formData.controls.FirstYearPer.value : scheduleData.formData.controls.FirstYear.value;
      CustomModeData.RenewalPercentage = this.customScheduleData['isPercentOfPremium'] == true ?
        scheduleData.formData.controls.RenewalYearPer.value : scheduleData.formData.controls.Renewal.value;
      CustomModeData.NonGradedSchedule = null;
      CustomModeData.GradedSchedule = null;
      CustomModeData.CustomType = 1;
    } else {
      CustomModeData.FirstYearPercentage = null;
      CustomModeData.RenewalPercentage = null;
      if (scheduleData.formData.controls.CustomType.value === '1') {
        CustomModeData.GradedSchedule = scheduleData.gradedScheduleList
        CustomModeData.NonGradedSchedule = null
      } else {
        CustomModeData.NonGradedSchedule = scheduleData.nonGradedScheduleList
        CustomModeData.GradedSchedule = null;
      }
    }
    if (this.customScheduleData.isSaveButtonClicked && !this.customScheduleData.isSplitEvenlyClicked) {
      if (this.OnValidateCustomSchedules()) {
        if (!this.isScheduleCreated) {
          this.isScheduleCreated = true;
          this.customScheduleData.isSaveButtonClicked = false;
          this.customScheduleData.isSplitEvenlyClicked = false;
          if (this.createSchedule.controls.ScheduleTypeId.value == 1) {
            this.createSchedule.controls.FirstYearPerUnit.setValue(0.00);
            this.createSchedule.controls.RenewalPerUnit.setValue(0.00);
            this.createSchedule.controls.FirstYearPercentage.setValue(CustomModeData.FirstYearPercentage);
            this.createSchedule.controls.RenewalPercentage.setValue(CustomModeData.RenewalPercentage);
          } else {
            this.createSchedule.controls.FirstYearPerUnit.setValue(CustomModeData.FirstYearPercentage);
            this.createSchedule.controls.RenewalPerUnit.setValue(CustomModeData.RenewalPercentage);
            this.createSchedule.controls.FirstYearPercentage.setValue(0.00);
            this.createSchedule.controls.RenewalPercentage.setValue(0.00);
          }

          this.OnCreatePolicy();
        }
      } else {
        this.customScheduleData.isSaveButtonClicked = false;
        this.validationData.isValidationShown = true;
        this.validationData.validationMessage = this.validationMessagetext;
        this.isScheduleValid = true;
        this.invalidScheduleMsg = '';
      }
    } else {
      this.customScheduleData.isSplitEvenlyClicked = false
      this.onSplitEvenly();
    }
  }
  OnValidateCustomSchedules() {
    let isScheduleValid = false;
    const controls = this.createSchedule.controls;
    const fieldName = this.customScheduleData['isPercentOfPremium'] == true ? '% of Premium' : ' Per Head';
    const sortBy = CustomModeData.CustomType === '1' ? 'From' : 'Year';
    if (CustomModeData.Mode === 0) {
      isScheduleValid = true;
    } else {
      if (CustomModeData.CustomType === '1') {
        let isBlankFieldFound = [];
        isBlankFieldFound = CustomModeData.GradedSchedule.filter(item => {
          if ((!item.Percent || Number(item.Percent) === 0)
            || (!item.From || Number(item.From) === 0)
            || (!item.To || Number(item.To) === 0)) {
            this.validationMessagetext = sortBy + ',' + ' ' + 'To' + ' ' + 'or' + ' '
              + fieldName + ' ' + `field  cannot be blank or '0'.`;
            return true;
          }
          if (Number(item.From) >= Number(item.To)) {
            this.validationMessagetext = `To value must be greater than From value.`;
            return true;
          }
        });
        if (isBlankFieldFound && isBlankFieldFound.length > 0) {
          return isScheduleValid
        } else {
          CustomModeData.GradedSchedule = CustomModeData.GradedSchedule.sort(this.SortFunction);
          if (Number(CustomModeData.GradedSchedule[0][sortBy]) !== 1) {
            this.validationMessagetext = `Range is missing with 'From' value starting from '1'.`
            return isScheduleValid;
          } else {
            let From = 1;
            for (const item of CustomModeData.GradedSchedule) {
              if (Number(item.From) !== From) {
                this.validationMessagetext = `From' value in the range must be the next number of 'To' value in previous range.`;
                isScheduleValid = false;
                return isScheduleValid;
              } else {
                From = Number(item.To) + 1;
                isScheduleValid = true;
              }
            }
          }
        }

      } else {
        let isBlankFieldFound = [];
        isBlankFieldFound = CustomModeData.NonGradedSchedule.filter(item => {
          if (!item.Year || Number(item.Year) === 0 || (!item.Percent || Number(item.Percent) === 0)) {
            this.validationMessagetext = sortBy + ' ' + 'or' + ' ' + fieldName + ' ' + `field cannot be blank or '0'.`
            return true;
          }
        });
        if (isBlankFieldFound && isBlankFieldFound.length > 0) {
          isScheduleValid = false;
          return isScheduleValid
        } else {
          CustomModeData.NonGradedSchedule = CustomModeData.NonGradedSchedule.sort(this.SortFunction);
          if (Number(CustomModeData.NonGradedSchedule[0][sortBy]) !== 1) {
            this.validationMessagetext = 'Year 1 schedule is missing.'
            return isScheduleValid;
          } else {
            let Year = 1;
            for (const item of CustomModeData.NonGradedSchedule) {
              if (Number(item.Year) !== Year) {
                this.validationMessagetext = `Year numbers must be consecutive without missing any value in between.`
                isScheduleValid = false;
                return isScheduleValid;
              } else {
                Year = Number(item.Year) + 1;
                isScheduleValid = true;
              }
            };
          }
        }
      }
    }

    return isScheduleValid;
  }
  SortFunction(firstrecord, secondRecord) {
    const sortBy = CustomModeData.CustomType === '1' ? 'From' : 'Year';
    const firstNumber = Number(firstrecord[sortBy]);
    const secondNumber = Number(secondRecord[sortBy]);
    return firstNumber > secondNumber ? 1 : -1;
  }
  OnChangeIncomingMode(scheduleFormData) {
    if (scheduleFormData.data.Mode.value == 1 && scheduleFormData.data.CustomType.value == '1') {
      this.createSchedule.controls.SplitSchedule.disable();
      this.createSchedule.controls.SplitSchedule.setValue('2');
    } else {
      this.createSchedule.controls.SplitSchedule.enable();
    }
  }


  // --------------------------Method used to validate a outgoing schedule based on custom Non graded list----------------------
  OnValidateNonGradedSchedule(date, splitPecentage: any = 0) {
    const totalYears = this.OnFindOutRenewableYear(date);
    let renewableYearScheduleValid = '';
    CustomModeData.NonGradedSchedule = CustomModeData.NonGradedSchedule.sort(this.CustomModeSortFunction);
    if (this.createSchedule.controls.CustomSplit.value === false) {
      //Standard schedule - check if policy is in first year, then renewal year must be 2 
      let renewalForStd = (totalYears == 1) ? 2 : totalYears;

      CustomModeData.NonGradedSchedule.filter(item => {
        if (item.Year == renewalForStd) {
          if (item.Percent == this.renewablesYearScheduleSum &&
            (CustomModeData.NonGradedSchedule[0]['Percent'] == this.firstYearScheduleSum)) {
            renewableYearScheduleValid = item.Percent;
            return renewableYearScheduleValid;
          } else {
            renewableYearScheduleValid = '-1';
            return renewableYearScheduleValid;
          }
        }
      });
      if (!renewableYearScheduleValid) {
        const data = CustomModeData.NonGradedSchedule[CustomModeData.NonGradedSchedule.length - 1];
        if (data.Percent == this.renewablesYearScheduleSum && CustomModeData.NonGradedSchedule[0]['Percent'] == this.firstYearScheduleSum) {
          renewableYearScheduleValid = data.Percent;
        } else {
          renewableYearScheduleValid = '-1';
        }
      }
    } else { // Custom Schedule 
      CustomModeData.NonGradedSchedule.filter(item => {
        if (item.Year == totalYears) {
          if (item.Percent == splitPecentage) {
            renewableYearScheduleValid = item.Percent;
            return renewableYearScheduleValid;
          } else {
            renewableYearScheduleValid = '-1';
            return renewableYearScheduleValid;
          }
        }
      });
      if (!renewableYearScheduleValid) {
        const data = CustomModeData.NonGradedSchedule[CustomModeData.NonGradedSchedule.length - 1];
        if (data.Percent == splitPecentage) {
          renewableYearScheduleValid = data.Percent;
        } else {
          renewableYearScheduleValid = '-1';
        }
      }
    }
    return renewableYearScheduleValid;
  }

  CalculateNumberOfLeapYear(year1, year2) {
    let leapYear = 0;
    for (year1; year1 <= year2; year1++) {
      if (((year1 % 4 == 0) && (year1 % 100 != 0)) || (year1 % 400 == 0)) {
        leapYear++;
      }
    }
    return leapYear;
  }
  CustomModeSortFunction(firstrecord, secondRecord) {
    const sortBy = CustomModeData.CustomType === '1' ? 'From' : 'Year';
    const firstNumber = Number(firstrecord[sortBy]);
    const secondNumber = Number(secondRecord[sortBy]);
    return firstNumber > secondNumber ? 1 : -1;
  }
  // ############################################################################################################################
  OnFindOutRenewableYear(date) {
    let totalDays = new Date(date).getTime() - new Date(this.createNewPolicy.controls.OriginalEffectiveDate.value).getTime();
    const numberofLeapYear = this.CalculateNumberOfLeapYear(new Date(this.createNewPolicy.controls.OriginalEffectiveDate.value).getFullYear(),
      new Date(date).getFullYear());
    totalDays = Math.floor(totalDays / (1000 * 3600 * 24));
    let totalYears = Math.ceil(totalDays / (365 + numberofLeapYear));
    if (totalYears <= 0) {
      totalYears = 1;
    }
    return totalYears;
  }
  // ##############################################################################################################################
  // --------------------------------------- This method is used for split evenly feature for outoging basic schedule------------
  onSplitSchedule() {
    if (this.createSchedule.controls.SplitSchedule.value === '1') {
      if (this.miEditList.miDataSource.tableData.length > 0) {
        this.customScheduleData.isSplitEvenlyClicked = true;
      }
    } else {
      this.onSplitEvenly();
    }
  }
  onSplitEvenly() {
    if (this.createSchedule.controls.SplitSchedule.value === '1') {
      let firstYearSchedule = 0;
      let secondYearSchedule = 0;
      if (CustomModeData.Mode == 1) {
        let RenewableYear = this.OnFindOutRenewableYear(new Date());
         //Standard schedule - check if policy is in first year, then renewal year must be 2 
        RenewableYear = (RenewableYear == 1) ? 2 : RenewableYear;

        firstYearSchedule = CustomModeData['NonGradedSchedule'][0].Percent;
        CustomModeData.NonGradedSchedule.filter(item => {
          if (item.Year == RenewableYear) {
            secondYearSchedule = item.Percent;
          }
        });
        if (secondYearSchedule == 0) {
          const data = CustomModeData.NonGradedSchedule[CustomModeData.NonGradedSchedule.length - 1];
          secondYearSchedule = data.Percent;
        }
      } else {
        firstYearSchedule = CustomModeData.FirstYearPercentage
        secondYearSchedule = CustomModeData.RenewalPercentage
      }
      if (this.miEditList.miDataSource.tableData.length > 0) {
        const ScheduleList = [];
        if (this.isPercentOfPremium === false) {
          const firstYearSchedule = CustomModeData['NonGradedSchedule'][0].Percent;
          if (this.createSchedule.controls.Tier.value === true) {
            this.OnPrmTierScheduleSplitEvenly(firstYearSchedule, secondYearSchedule);
          } else {
            const firstYearPercentage = (firstYearSchedule / this.miEditList.miDataSource.tableData.length).toFixed(2);
            const renewalYearPercentage = (secondYearSchedule / this.miEditList.miDataSource.tableData.length).toFixed(2);
            for (const schedule of this.miEditList.miDataSource.tableData) {
              schedule.FirstYearPercentage = firstYearPercentage;
              schedule.RenewalPercentage = renewalYearPercentage;
              ScheduleList.push(schedule);
              this.miEditList.miDataSource.tableData = ScheduleList;
            }
          }

        } else {
          if (this.createSchedule.controls.Tier.value === true) {
            this.OnPrmTierScheduleSplitEvenly(firstYearSchedule, secondYearSchedule);
          } else {
            const firstYearPercentage = (firstYearSchedule / this.miEditList.miDataSource.tableData.length).toFixed(2);
            const renewalYearPercentage = (secondYearSchedule / this.miEditList.miDataSource.tableData.length).toFixed(2);
            for (const schedule of this.miEditList.miDataSource.tableData) {
              schedule.FirstYearPercentage = firstYearPercentage;
              schedule.RenewalPercentage = renewalYearPercentage;
              ScheduleList.push(schedule);
              this.miEditList.miDataSource.tableData = ScheduleList;
            }
          }
        }

      }
    } else {
      if (this.miEditList.miDataSource.tableData.length > 0) {
        if (this.createSchedule.controls.Tier.value === true) {
          this.OnCommTierScheduleSplitEvenly();
        } else {
          const splitAmount = (100 / this.miEditList.miDataSource.tableData.length).toFixed(2);
          const ScheduleList = [];
          for (const schedule of this.miEditList.miDataSource.tableData) {
            schedule.FirstYearPercentage = splitAmount;
            schedule.RenewalPercentage = splitAmount;
            ScheduleList.push(schedule);
            this.miEditList.miDataSource.tableData = ScheduleList;
          }

        }

      }
    }

  }

  // Method to open client details dialog 
  openClientDetail(){
    debugger;
    const dialogRef = this.dialog.open(ClientInfoComponent, {
      width: '500px',
      data: {
       'clientId' : this.client.controls.ClientList.value
      },
    });
  }
  //####################################################################################################################################################

//----------------------------------------------------------------------------------------------
  // -----------------Client Filter --------------------------------------
  SetAllFiltersValue() {
    this.ClientDropDown = this.client.controls.ClientObject.valueChanges.pipe(
      startWith(''),
      debounceTime(700),
      distinctUntilChanged(),
      map(value => value ? this._Clientfilter(value) : this.clientListing.slice())
    );
  }
  _Clientfilter(value: any): clientObject[]  {
    const filterValue = (value.Name) ? value.Name.toLowerCase() : value.toLowerCase();
    return this.clientListing.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }
  // 
}
  





