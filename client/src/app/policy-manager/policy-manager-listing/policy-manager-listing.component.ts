import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { TableDataSource } from '../../_services/table.datasource';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { PolicymanagerService } from '../policymanager.service';
import { PolicyManagerUrlService } from '../policy-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component'
import { ResponseCode } from 'src/app/response.code';
import { ResponseErrorService } from '../../_services/response-error.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonDataService } from '../../_services/common-data.service';
import { Guid } from 'guid-typescript';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs'

export interface Food {
  value: string;
  viewValue: string;
}

export class clientObject {
  Name: string;
  Id: string;
}

@Component({
  selector: 'app-policy-manager-listing',
  templateUrl: './policy-manager-listing.component.html',
  styleUrls: ['./policy-manager-listing.component.scss']
})
export class PolicyManagerListingComponent implements OnInit, AfterViewInit, OnDestroy {
  MiListProperties: MiProperties = new MiProperties();
  needPageReset: Subject<boolean> = new Subject();
  @Input() isClientChanged: any;
  listingURL: any;
  dataTopost: any;
  clientId: any; // for getting ClientId
  statusId: any;
  userdetails: any;
  totalCount: any;
  activeCount: any;
  pendingCount: any;
  SelectedClientName: any;
  inactiveCount: any;
  ClientList: any = [];

  ClientListing: Observable<clientObject[]>; //used for auto complete option 
  // ClientObj: clientObject;

  searchData: any;
  isSearchLoading: boolean;
  showLoad: Boolean;
  postdata: any;
  policyId: any;
  router: any;
  isSelectedClient: any;
  isListShown: Boolean = false;
  selectedClientIdByName: any;
  showloading: boolean;
  licenseeId: any;
  needRefresh: Subject<boolean> = new Subject();
  ClientIdByURL: any;
  count: 0;
  emptyClientId: any = Guid.createEmpty().toJSON().value
  client = new FormGroup({
    ClientList: new FormControl('', []),
    Client: new FormControl('', {})
  })
  columnLabels: string[] = [
    'Policy #',
    'Insured',
    'Payor',
    'Carrier',
    'Effective',
    'Product',
    'PAC',
    'Pay Type',
    'Status',
    '']

  displayedColumns: string[] = [
    'policyNumber',
    'Insured',
    'Payor',
    'Carrier',
    'OrignalEffectiveDate',
    'Product',
    'PAC',
    'PayType',
    'Status',
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
    'false'
  ];
  previousFormContorlValue: string = '';
  formControlSubscription: Subscription;
  constructor(
    public policyManagerUrl: PolicyManagerUrlService,
    public policyManagerSvc: PolicymanagerService,
    public activateroute: ActivatedRoute,
    public getrouteParamters: GetRouteParamtersService,
    public route: Router,
    public dialog: MatDialog,
    public responseError: ResponseErrorService,
    public commonService: CommonDataService
  ) {
    this.router = route
  }

  ngOnInit() {
    this.ClientIdByURL = this.activateroute.snapshot.queryParams['client'];
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.getrouteParamters.getparameterslist(this.activateroute);
    this.licenseeId = this.userdetails['LicenseeId'];
    this.statusId = this.getrouteParamters.parentTab;
    //  this.getPoliciesListing();
    if (this.commonService.value) {
      this.clientId = this.commonService.value;
      this.commonService.value = '';
    } else if (this.ClientIdByURL) {
      this.clientId = this.ClientIdByURL;
    } else if (this.policyManagerSvc.ClientIdObj) {
      this.clientId = this.policyManagerSvc.ClientIdObj;
    }

    //Get first default client or selected client name 
    this.FirstClientListing(this.clientId);

    //Auto suggestion list for clients 
    this.formControlSubscription = this.client.controls.Client.valueChanges.subscribe((changedValue) => {
       //if ((this.client.controls.Client.value as string).length >= 3 && this.previousFormContorlValue != this.client.controls.Client.value) {
        this.isSearchLoading = true;
       this.DefaultClientListing(changedValue);
     // } 
      // else if ((this.client.controls.Client.value as string).length < 3) {
      //   // this.ClientListing
      // }
    });
   // this.DefaultClientListing('');
  }
  ngAfterViewInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (event.url.indexOf('/policy/policyList') > -1 || (event.url.indexOf('/policy/clientPolicies') > -1)) {
        } else {
          this.policyManagerSvc.ClientIdObj = '';
        }
      }
    });
  }

   // ########################################################################

  // -----------------------------------Policies list based on default clientName---------------------------------------------------------
  FirstClientListing(clientId: any) { debugger;
    this.showloading = true;
    this.postdata = {
      'licenseeId': this.licenseeId,
      'loggedInUserId': this.userdetails['UserCredentialID'],
      'clientId': clientId
    }
    this.policyManagerSvc.getClientName(this.postdata).subscribe(response => {
      debugger;
      this.ClientList = response.ClientList;
      this.SetAllFiltersValue();
      if (this.client.controls.Client.value == '') {
        this.policyManagerSvc.clientListing = this.ClientList;

        if (this.clientId) {
          const isSameLicenseeClient = this.ClientList.filter(client => client['ClientId'] === this.clientId);
          if (isSameLicenseeClient.length > 0) {
            this.policyManagerSvc.ClientIdObj = this.clientId;
          } else {
            this.clientId = this.ClientList[0].ClientId;
            this.policyManagerSvc.ClientIdObj = this.clientId;
          }
          this.client.controls.ClientList.setValue(this.clientId);

        } else if (this.policyManagerSvc.ClientIdObj) {
          this.client.controls.ClientList.setValue(this.policyManagerSvc.ClientIdObj);
          this.clientId = this.policyManagerSvc.ClientIdObj;
        } else {
          if (this.ClientList && this.ClientList[0] && this.ClientList[0].ClientId) {
            this.selectedClientIdByName = this.ClientList[0].ClientId;
            this.client.controls.ClientList.setValue(this.selectedClientIdByName);
            this.clientId = this.selectedClientIdByName;
          } else {
            this.clientId = Guid.createEmpty().toJSON().value;
            this.client.controls.ClientList.setValue('');
            this.selectedClientIdByName = Guid.createEmpty().toJSON().value;
          }

        }
        this.client.controls.Client.setValue(this.ClientList.filter(client => client['ClientId'] === this.clientId)[0].Name);
        this.isListShown = true;
        this.getPoliciesListing();
        this.refreshList();
      }
      this.showloading = false;
    });
  }

  //----------------------------------------------------------------------------------------------
  // -----------------Client Filter --------------------------------------
  SetAllFiltersValue() {
    this.ClientListing = this.client.controls.Client.valueChanges.pipe(
      startWith(''),
      debounceTime(700),
      distinctUntilChanged(),
      map(value => value ? this._Clientfilter(value) : this.ClientList.slice())
    );
  }
  _Clientfilter(value: any): clientObject[] {
    const filterValue = (value.Name) ? value.Name.toLowerCase() : value.toLowerCase();
    return this.ClientList.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }
  // 
  // ########################################################################

  // -----------------------------------Policies list based on searched clientName---------------------------------------------------------
  /**
         * @author: Ankit.
         * @description: used for getting list of policies.
         * @dated: 04 fab, 2019.
         * @parameters: none.
         * @return: observable<any>.
        **/
  DefaultClientListing(searchString: string) { 
    this.isSearchLoading = true;
    //this.showloading = true;
    this.postdata = {
      'licenseeId': this.licenseeId,
      'loggedInUserId': this.userdetails['UserCredentialID'],
      'searchString': searchString
    }
    this.policyManagerSvc.getSearchedClientName(this.postdata).subscribe(response => {
     
      //debugger;
      this.isSearchLoading = false;
      this.ClientList = response.ClientList;
      this.SetAllFiltersValue();
      
      if (this.client.controls.Client.value == '') {
        this.policyManagerSvc.clientListing = this.ClientList;
        //localStorage.setItem('ClientList', JSON.stringify(this.ClientList));

        if (this.clientId) {
          const isSameLicenseeClient = this.ClientList.filter(client => client['ClientId'] === this.clientId);
          if (isSameLicenseeClient.length > 0) {
            this.policyManagerSvc.ClientIdObj = this.clientId;
          } else {
            this.clientId = this.ClientList[0].ClientId;
            this.policyManagerSvc.ClientIdObj = this.clientId;
          }
          this.client.controls.ClientList.setValue(this.clientId);

        } else if (this.policyManagerSvc.ClientIdObj) {
          this.client.controls.ClientList.setValue(this.policyManagerSvc.ClientIdObj);
          this.clientId = this.policyManagerSvc.ClientIdObj;
        } else {
          if (this.ClientList[0] && this.ClientList[0].ClientId) {
            this.selectedClientIdByName = this.ClientList[0].ClientId;
            this.client.controls.ClientList.setValue(this.selectedClientIdByName);
            this.clientId = this.selectedClientIdByName;
          } else {
            this.clientId = Guid.createEmpty().toJSON().value;
            this.client.controls.ClientList.setValue('');
            this.selectedClientIdByName = Guid.createEmpty().toJSON().value;
          }

        }
        // let client:any = {};
        // if(this.clientId){
        // client.Name = this.ClientList.filter(client => client['ClientId'] === this.clientId)[0].Name;
        // client.Id = this.clientId;

        //this.client.controls.Client.setValue(this.ClientList.filter(client => client['ClientId'] === this.clientId)[0].Name);
        // }

        this.isListShown = true;

        //this.getPoliciesListing();
        //this.refreshList();
      }
      //this.showloading = false;
    });
  }
  // #######################################################################################################################################

  // -----------------------------------get listing of plicies---------------------------------------------------------
  /**
      * @author: Ankit.
      * @description: used for getting list of policies.
      * @dated: 04 fab, 2019.
      * @parameters: none.
      * @return: observable<any>.
     **/
  getPoliciesListing() {
    this.listingURL = this.policyManagerUrl.PolicicyManagerListing.GetPoliciesListing;
    this.MiListProperties.url = this.listingURL;
    this.MiListProperties.miDataSource = new TableDataSource(this.policyManagerSvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex
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
  // #######################################################################################################################################
  /**
      * @author: Ankit.
      * @description: used for sending list of parameter to fetch listing.
      * @dated: 04 feb, 2019.
      * @parameters: none.
      * @return: observable<any>.
     **/
  refreshList() {

    this.dataTopost = {
      'clientId': this.clientId ? this.clientId : Guid.createEmpty().toJSON().value,
      'licenseeId': this.licenseeId,
      'statusId': this.statusId,
      'FilterBy': this.searchData,
      'userID': this.userdetails['UserCredentialID'],
      'role': this.userdetails['Role'],
      'isAdmin': this.userdetails['IsAdmin'] ? this.userdetails['IsAdmin'] : false,
      'isHouse': (this.userdetails['IsHouseAccount']) ? this.userdetails['IsHouseAccount'] : false
    };
    this.getrouteParamters.ClientId = this.clientId;
    this.MiListProperties.requestPostData = this.dataTopost;
    this.MiListProperties.refreshHandler.next(true);
  }
  // #######################################################################################################################################
  /**
      * @author: Ankit.
      * @description: used for getting count  of policies.
      * @dated: 04 feb, 2019.
      * @parameters: none.
      * @return: observable<any>.
     **/
  GetMiListResponse(value) {

    this.activeCount = value.response.ActiveCount;
    this.pendingCount = value.response.PendingCount;
    this.inactiveCount = value.response.TerminateCount;
    this.totalCount = value.response.TotalCount;
  }
  // #######################################################################################################################################
  GetPoliciesList(getClientId) {
    this.isClientChanged = true;
    this.clientId = getClientId.option.value.ClientId;
    const SelectedClientId = getClientId.option.value.ClientId;
    this.statusId = '3';
    this.getrouteParamters.parentTab = '3';
    this.SelectedDropdownClientList(SelectedClientId);
    this.client.controls.Client.setValue(this.ClientList.filter(client => client['ClientId'] === this.clientId)[0].Name);

  }
  // #######################################################################################################################################
  SelectedDropdownClientList(value) {
    this.showloading = true;
    this.clientId = value;
    this.policyManagerSvc.ClientIdObj = this.clientId;
    this.MiListProperties.resetPagingHandler.next(true);
    this.refreshList();
    this.MiListProperties.miDataSource.dataSubject.subscribe(isLoadingDone => {
      if (this.MiListProperties.miDataSource.getResponse) {
        const response = {
          'response': {
            'ActiveCount': this.MiListProperties.miDataSource.getResponse.ActiveCount,
            'PendingCount': this.MiListProperties.miDataSource.getResponse.PendingCount,
            'TerminateCount': this.MiListProperties.miDataSource.getResponse.TerminateCount,
            'TotalCount': this.MiListProperties.miDataSource.getResponse.TotalCount
          }

        }
        this.GetMiListResponse(response);
      }
      this.showloading = false;
    });
  }
  // #######################################################################################################################################
  isNavigationChanged(value) {
    this.statusId = value.data;
    // Chek if same link clicked, then don't refresh listing
    // 3 is position of Parent tab in URl - new value compared to old.
    // if (this.route.url.split('/').length > 3 && (this.route.url.split('/')[3] !== value.data)) {
    this.searchData = '';
    // Refresh listing
    // this.MiListProperties.resetPagingHandler.next(true);
    this.refreshList();
    // }
  }
  // #######################################################################################################################################
  /* Search Methods  */
  doSearch() {
    this.showloading = false;
    this.MiListProperties.initialPageIndex = 0;
    this.MiListProperties.resetPagingHandler.next(true);
    this.refreshList()
  }
  // #######################################################################################################################################
  handleSearchClear = (value) => {
    if (!value) {
      this.searchData = value;
      this.doSearch();
    } else if (value.type === 'click') {
      this.searchData = '';
      this.doSearch();
    }

  }
  // #######################################################################################################################################
  onMenuItemClick(value) { debugger;
    if (value.name === 'Edit') {
      this.router.navigate(['/policy/editPolicy',
        this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex,
        value.data.PolicyId, this.clientId])
    } else if (value.name === 'Duplicate') {
      this.router.navigate(['/policy/editPolicy',
        this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex,
        value.data.PolicyId, 1, this.clientId])
    } else if (value.name === 'Delete') {
      this.showloading = true;
      this.postdata = {
        'policyId': value.data.PolicyId,
        'isForcefullyDeleted': 'false',
        'isDeleteClient': 'false'
      };
      this.policyManagerSvc.deletePolicy(this.postdata).subscribe(response => {
        if (response.ResponseCode === ResponseCode.NoIssueWithEntity) {
          this.showloading = false;
          this.openDeleteDialogBox(value.data.PolicyId, response.NumberValue);
        } else if (response.ResponseCode === ResponseCode.OutgoingPaymentExist) {
          this.showloading = false;
          this.openAgentHasPaymentsDialogBox(value.data.PolicyId, false)
        } else {
          this.showloading = false;
          this.responseError.OpenResponseErrorDilog(response.Message);
        }
      });
    } else if (value.name.Type === 'AnchorTag') {
      this.router.navigate(['/policy/editPolicy',
        this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex,
        value.data.PolicyId, this.clientId])
    } else if (value.name === 'row-click') {
      this.router.navigate(['/policy/editPolicy',
        this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex,
        value.data.PolicyId, this.clientId])
    }
  }
  // #######################################################################################################################################



  // ---------------------------------------------this popup  used for  delete a policy-----------------------------------------------------
  openDeleteDialogBox(policyId: string, clientPoliciesCount: any) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        licenseeId: this.userdetails['LicenseeId'],
        headingTitle: 'Delete Policy',
        subTitle: clientPoliciesCount > 1 ? ' Are you sure you want to delete policy?'
          // tslint:disable-next-line:max-line-length
          : 'This is the only policy of this client. Do you want to delete policy only then click on "Delete Policy" or if you want to delete policy as well as client then click on "Delete Policy & Client"?',
        isExtraButtonShows: clientPoliciesCount > 1 ? false : true,
        buttonText: 'Delete Policy & Client',
        primaryButton: clientPoliciesCount > 1 ? ' Yes, Delete' : ' Delete Policy'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.postdata = {
          'policyId': policyId,
          'isForcefullyDeleted': 'true'
        }
        this.policyManagerSvc.deletePolicy(this.postdata).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }
        })
      } else if (result === 'Yes') {
        this.postdata = {
          'policyId': policyId,
          'isForcefullyDeleted': 'true',
          'isDeleteClient': 'true'
        }
        this.policyManagerSvc.deleteClientWithPolicy(this.postdata).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.clientId = this.ClientList[0].ClientId;
            this.client.controls.ClientList.setValue(this.clientId);
            this.refreshList();
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }
        });
      }
    })
  }
  // #####################################################################################################################################
  // ----------------------------------------this popup  shows  policy has payments so policy can not deleted---------------------------
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
  // ##################################################################################################################################
  /*Pagination changed event  */
  OnPaginationChange(value) {
    this.getrouteParamters.pageIndex = value.nextIndex;
    this.getrouteParamters.pageSize = value.newPageSize;
  }

  OnAdvanceSearching() {
    this.router.navigate(['/policy/advance-Search', this.getrouteParamters.parentTab,
      this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex])
  }
  ngOnDestroy() {
    if (this.formControlSubscription) { 
      this.formControlSubscription.unsubscribe();
    }
  }
}
