import { RemoveConfirmationComponent } from './../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators';
import { CommonDataService } from '../../_services/common-data.service';
import { ResponseCode } from 'src/app/response.code';
import { Guid } from 'guid-typescript';
import { TableDataSource } from 'src/app/_services/table.datasource';
import { Subject } from 'rxjs/Subject';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { PolicyManagerUrlService } from '../policy-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { PolicymanagerService } from '../policymanager.service'
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppLevelDataService } from './../../_services/app-level-data.service';
import { ResponseErrorService } from '../../_services/response-error.service';
@Component({
  selector: 'app-policy-advance-search',
  templateUrl: './policy-advance-search.component.html',
  styleUrls: ['./policy-advance-search.component.scss']
})
export class PolicyAdvanceSearchComponent implements OnInit, OnDestroy {
  ClientListing: Observable<string[]>;
  PayorListing: Observable<string[]>;
  CarrierListing: Observable<string[]>;
  carrierList: any;
  clientList: any
  PayorList: any;
  userdetails: any;
  moduleName: any;
  PolicyStatus: any;
  //buttonName: any;
  pagename: any;
  MiListProperties: MiProperties = new MiProperties();
  needPageReset: Subject<boolean> = new Subject();
  needRefresh: Subject<boolean> = new Subject();
  isListShown: Boolean = false;
  postData: any;
  showloading: Boolean = false;
  isValidationShown: Boolean = false;
  AdvanceSearch = new FormGroup({
    Client: new FormControl('', {}),
    Insured: new FormControl('', {}),
    PolicyNumber: new FormControl('', {}),
    Payor: new FormControl('', {}),
    Carrier: new FormControl('', {}),
    Status: new FormControl(3, {}),
    CDPolicyID: new FormControl('', {}),
    PolicyPlanID: new FormControl('', {}),
    ImportPolicyID: new FormControl('', {})
  });
  columnLabels: string[] = [
    'Client',
    'Policy #',
    'Insured',
    'Payor',
    'Carrier',
    'Effective',
    'Product',
    'PAC',
    'Pay Type',
    'Status',
    'Import Policy ID',
    '']

  displayedColumns: string[] = [
    'ClientName',
    'policyNumber',
    'Insured',
    'Payor',
    'Carrier',
    'OrignalEffectiveDate',
    'Product',
    'PAC',
    'PayType',
    'Status',
    'ImportPolicyID',
    'Action'];

  columnIsSortable: string[] = [
    'true',
    'true',
    'true',
    'true',
    'true',
    'true',
    'true',
    'true',
    'true',
    'true',
    'true',
    'false'
  ];
  constructor(
    public commonService: CommonDataService,
    public PolicyMangersv: PolicymanagerService,
    public policyManagerUrl: PolicyManagerUrlService,
    public activateroute: ActivatedRoute,
    public getrouteParamters: GetRouteParamtersService,
    public router: Router,
    public dialog: MatDialog,
    public responseError: ResponseErrorService,
    public appDataSvc: AppLevelDataService

  ) { }

  ngOnInit() {
    // this.buttonName = 'Reset';
    this.appDataSvc.isCompanyChanged = false;
    this.moduleName = 'Policy Manager';
    this.pagename = 'Advance Search';
    this.getrouteParamters.getparameterslist(this.activateroute);
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.appDataSvc.policyAdvanceSearchResult) {
      this.DefaultSearchedValues();
    }
    const postData = {
      'licenseeId': this.userdetails['LicenseeId'],
      'loggedInUserId': this.userdetails['UserCredentialID']
    }
    // this.PolicyMangersv.getAllClientName(postData).subscribe(response => {
    //   if (response.ResponseCode === ResponseCode.SUCCESS) {
    //     this.clientList = response.ClientList;
    //     this.SetAllFiltersValue();
        this.GetPayorList();

    //   }
    // });

    this.AdvanceSearch.controls.Client.valueChanges.subscribe((changedValue) => {
      this.getClientSuggestList(changedValue);
    });

  }

  /*********************Get clients list from Auto suggestion API ******************************/
  getClientSuggestList(searchString: any){
    let postdata = {
      'licenseeId': this.userdetails['LicenseeId'],
      'loggedInUserId': this.userdetails['UserCredentialID'],
      'searchString': searchString
    }
    this.PolicyMangersv.getSearchedClientName(postdata).subscribe(response => {
      this.clientList = response.ClientList;
      this.SetAllFiltersValue();
    })
  }

  ngOnDestroy() {
    if (this.appDataSvc.isCompanyChanged) {
      this.isListShown = false;
    }
    if (this.isListShown) {
      const SearchData = {
        'ClientName': this.AdvanceSearch.controls.Client.value,
        'Insured': this.AdvanceSearch.controls.Insured.value,
        'PolicyNumber': this.AdvanceSearch.controls.PolicyNumber.value,
        'PayorName': this.AdvanceSearch.controls.Payor.value,
        'CarrierName': this.AdvanceSearch.controls.Carrier.value,
        'CDPolicyID': this.AdvanceSearch.controls.CDPolicyID.value,
        'PolicyPlanID': this.AdvanceSearch.controls.PolicyPlanID.value,
        'ImportPolicyID': this.AdvanceSearch.controls.ImportPolicyID.value
      }
      this.appDataSvc.policyAdvanceSearchResult = JSON.stringify(SearchData);
    }

    if (this.appDataSvc.isUserLoggedOut) {
      this.appDataSvc.policyAdvanceSearchResult = null;
    }
  }
  DefaultSearchedValues() {

    const data = JSON.parse(this.appDataSvc.policyAdvanceSearchResult);
    if (data) {
      this.AdvanceSearch.controls.Client.setValue(data.ClientName);
      this.AdvanceSearch.controls.Insured.setValue(data.Insured);
      this.AdvanceSearch.controls.PolicyNumber.setValue(data.PolicyNumber);
      this.AdvanceSearch.controls.Payor.setValue(data.PayorName);
      this.AdvanceSearch.controls.Carrier.setValue(data.FCarrierName);
      this.AdvanceSearch.controls.CDPolicyID.setValue(data.CDPolicyID);
      this.AdvanceSearch.controls.PolicyPlanID.setValue(data.PolicyPlanID);
      this.AdvanceSearch.controls.ImportPolicyID.setValue(data.ImportPolicyID);
      this.OnsearchedBasedData()
    }
  }
  // -----------------Client Filter --------------------------------------
  SetAllFiltersValue() {
    this.ClientListing = this.AdvanceSearch.controls.Client.valueChanges.pipe(
      startWith(''),
      map(value => this._Clientfilter(value))
    );
  }
  _Clientfilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.clientList.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }
  // ########################################################################

  GetPayorList() {
    this.commonService.getPayorsList({ 'LicenseeID': this.userdetails && this.userdetails['LicenseeId'] }).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.PayorList = response.PayorList;
        this.PayorListing = this.AdvanceSearch.controls.Payor.valueChanges.pipe(
          startWith(''),
          map(value => this._Payorfilter(value))
        );
      }
    });
  }

  _Payorfilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.PayorList.filter(option => option.PayorName.toLowerCase().indexOf(filterValue) === 0);
  }

  GetCarrierList() {
    let PayorId = '';
    this.AdvanceSearch.controls.Carrier.setValue('');
    this.PayorList.filter(item => {
      if (item.PayorName === this.AdvanceSearch.controls.Payor.value) {
        PayorId = item.PayorID;
      }
    });

    if (!PayorId) {
      PayorId = Guid.createEmpty().toJSON().value;
    }
    const postData = { 'payorId': PayorId }
    this.commonService.getCarrierList(postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.carrierList = response.CarrierList;
        this.CarrierListing = this.AdvanceSearch.controls.Carrier.valueChanges.pipe(
          startWith(''),
          map(value => this._Carrierfilter(value))
        );
      }
    });
  }
  _Carrierfilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.carrierList.filter(option => option.NickName.toLowerCase().indexOf(filterValue) === 0);
  }
  OnPageRedirection() {
    this.router.navigate(['policy/policyListing', 3, 10, 0]);
  }
  getPoliciesListing() {
    this.MiListProperties.url = this.policyManagerUrl.PolicicyManagerListing.GetAdvanceSearchPolicies;
    this.MiListProperties.miDataSource = new TableDataSource(this.PolicyMangersv);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.initialSortBy = 'ClientName'
    this.MiListProperties.initialSortOrder = 'asc'
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Duplicate', 1, true, true, this.isMenuButtonDisabled, 'img-icons duplicate-icn'),
        new MiListMenuItem('Delete', 3, true, true, this.isMenuButtonDisabled, 'img-icons delete-icn')
      ];
  }
  isMenuButtonDisabled(element) {
    const userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    return userdetail && userdetail.Permissions[1].Permission === 1 ? true : false;
  }
  OnsearchedBasedData() {
    if (!this.AdvanceSearch.controls.Client.value &&
      !this.AdvanceSearch.controls.Insured.value &&
      !this.AdvanceSearch.controls.PolicyNumber.value &&
      !this.AdvanceSearch.controls.Carrier.value &&
      !this.AdvanceSearch.controls.Payor.value &&
      !this.AdvanceSearch.controls.CDPolicyID.value &&
      !this.AdvanceSearch.controls.PolicyPlanID.value &&
      !this.AdvanceSearch.controls.ImportPolicyID.value) {
      this.isValidationShown = true;
    } else {
      this.isListShown = true;
      this.isValidationShown = false;
      this.getPoliciesListing();
      this.PolicyListParamtrs();

    }

  }

  PolicyListParamtrs() {
    this.postData = {
      'searchingData': {
        'ClientName': this.AdvanceSearch.controls.Client.value,
        'Insured': this.AdvanceSearch.controls.Insured.value,
        'PolicyNumber': this.AdvanceSearch.controls.PolicyNumber.value,
        'PayorName': this.AdvanceSearch.controls.Payor.value,
        'CarrierName': this.AdvanceSearch.controls.Carrier.value,
        'CDPolicyID': this.AdvanceSearch.controls.CDPolicyID.value,
        'PolicyPlanID': this.AdvanceSearch.controls.PolicyPlanID.value,
        'ImportPolicyID': this.AdvanceSearch.controls.ImportPolicyID.value,
        'LicenseeId': this.userdetails['LicenseeId'],
        'UserCredId': this.userdetails['UserCredentialID'],
        'role': this.userdetails['Role'],
        'isAdmin': this.userdetails['IsAdmin'] ? this.userdetails['IsAdmin'] : false,
        'isHouse': (this.userdetails['IsHouseAccount']) ? this.userdetails['IsHouseAccount'] : false,
        // 'Status': this.AdvanceSearch.controls.Status.value
      }
    }
    this.MiListProperties.requestPostData = this.postData;
    this.MiListProperties.refreshHandler.next(true);
  }
  OnResetFormValues() {
    this.AdvanceSearch.controls.Client.setValue('');
    this.AdvanceSearch.controls.Client.setValue('');
    this.AdvanceSearch.controls.Insured.setValue('');
    this.AdvanceSearch.controls.PolicyNumber.setValue('');
    this.AdvanceSearch.controls.Payor.setValue('');
    this.AdvanceSearch.controls.Carrier.setValue('');
    this.AdvanceSearch.controls.CDPolicyID.setValue('');
    this.AdvanceSearch.controls.PolicyPlanID.setValue('');
    this.AdvanceSearch.controls.ImportPolicyID.setValue('');
    this.isListShown = false;
    this.isValidationShown = false;
    this.appDataSvc.policyAdvanceSearchResult = null;
  }
  OnCloseSearchResult() {
    this.router.navigate(['/policy/policyListing', 3, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    this.appDataSvc.policyAdvanceSearchResult = '';
    this.isListShown = false;
  }
  OnCloseValidation() {
    this.isValidationShown = false;
  }
  OnMenuItemClick(clickedRecord) {
    if (clickedRecord.name === 'Edit') {
      this.router.navigate(['/policy/advance-Search/editPolicy',
        this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex,
        clickedRecord.data.PolicyId, clickedRecord.data.ClientId])
    } else if (clickedRecord.name === 'Duplicate') {
      this.router.navigate(['/policy/advance-Search/editPolicy',
        this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex,
        clickedRecord.data.PolicyId, 1, clickedRecord.data.ClientId]);
    } else if (clickedRecord.name === 'Delete') {
      this.showloading = true;
      this.postData = {
        'policyId': clickedRecord.data.PolicyId,
        'isForcefullyDeleted': 'false',
        'isDeleteClient': 'false'
      };
      this.PolicyMangersv.deletePolicy(this.postData).subscribe(response => {
        if (response.ResponseCode === ResponseCode.NoIssueWithEntity) {
          this.showloading = false;
          this.openDeleteDialogBox(clickedRecord.data.PolicyId, response.NumberValue);
        } else if (response.ResponseCode === ResponseCode.OutgoingPaymentExist) {
          this.showloading = false;
          this.openAgentHasPaymentsDialogBox(clickedRecord.data.PolicyId, false)
        } else {
          this.showloading = false;
          this.responseError.OpenResponseErrorDilog(response.Message);
        }
      });
    } else if (clickedRecord.name.Type === 'AnchorTag') {
      this.router.navigate(['/policy/advance-Search/editPolicy',
      this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex,
      clickedRecord.data.PolicyId, clickedRecord.data.ClientId])
    } else if (clickedRecord.name === 'row-click') {
      this.router.navigate(['/policy/advance-Search/editPolicy',
        this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex,
        clickedRecord.data.PolicyId, clickedRecord.data.ClientId])
    }
  }
  // #######################################################################################################################################
  // ---------------------------------------------this popup  used for  delete a policy-----------------------------------------------------
  openDeleteDialogBox(policyId: string, clientPoliciesCount: any) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        licenseeId: this.userdetails['LicenseeId'],
        headingTitle: 'Delete Policy',
        subTitle: ' Are you sure you want to delete policy?',
        // tslint:disable-next-line:max-line-length
        //  : 'This is the only policy of this client. Do you want to delete policy only then click on "Delete Policy" or if you want to delete policy as well as client then click on "Delete Policy & Client"?',
        isExtraButtonShows: false,
        // buttonText: 'Delete Policy & Client',
        primaryButton: clientPoliciesCount > 1 ? ' Yes, Delete' : ' Delete Policy'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.postData = {
          'policyId': policyId,
          'isForcefullyDeleted': 'true'
        }
        this.PolicyMangersv.deletePolicy(this.postData).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }
        })
      }
      // else if (result === 'Yes') {
      //   this.postData = {
      //     'policyId': policyId,
      //     'isForcefullyDeleted': 'true',
      //     'isDeleteClient': 'true'
      //   }
      //   this.PolicyMangersv.deleteClientWithPolicy(this.postData).subscribe(response => {
      //     if (response['ResponseCode'] === ResponseCode.SUCCESS) {
      //       // this.clientId = this.ClientList[0].ClientId;
      //       // this.client.controls.ClientList.setValue(this.clientId);
      //       // this.refreshList();
      //     } else {
      //       this.responseError.OpenResponseErrorDilog(response.Message);
      //     }
      //   });
      // }
    })
  }
  //  ##################################################################################################################
  //  ----------------------------------------this popup  shows  policy has payments so policy can not deleted---------------------------
  openAgentHasPaymentsDialogBox(policyId: string, forceToDeleteStatus: boolean) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Policy',
        subTitle: 'Policy cannot be deleted as it has payments associated to it.',
        forceToDelete: forceToDeleteStatus
      },
      width: '450px',
      disableClose: true,
    })
  }
}
