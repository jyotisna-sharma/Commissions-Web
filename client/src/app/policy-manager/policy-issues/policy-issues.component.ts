import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ActivatedRoute, Router, } from '@angular/router';
import { CommissionDashboardMenuItem } from '../../shared/commission-dashboard-list/commission-dashboard-menu-item';
import { PolicymanagerService } from '../policymanager.service';
import { PolicyManagerUrlService } from '../policy-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from 'src/app/_services/table.datasource';
import { CommissionListSubmenuItem } from '../../shared/commission-dashboard-list/commission-list-submenu-item';
import { ResponseCode } from '../../response.code';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatOption, DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component'
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
@Component({
  selector: 'app-policy-issues',
  templateUrl: './policy-issues.component.html',
  styleUrls: ['./policy-issues.component.scss']
})
export class PolicyIssuesComponent implements OnInit, AfterViewInit {
  clientList: any;
  subMenuItems: any;
  userdetails: any;
  policyNumber: any;
  postdata: any;
  isTabDisable: Boolean = false;
  pagename: any;
  isTrackPayment: boolean;
  lastFollowUpRun: any;
  moduleName: any;
  isOutgoingdivShown: Boolean = false;
  searchData: any;
  showloading: Boolean = true;
  listData: any;
  showCount: any;
  getCurrentDate: any;
  isActionButtonDisabled: boolean;
  followupIssues: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  searchList: Subject<boolean> = new Subject();
  statusId: string = "0";
  selectedMonth: any = [];
  //statusVal: string = "0";
  incomingPayColumnLabel = ['Invoice Date', 'Category', 'Status',
    'Reason', 'Result', ''];
  incomingPayDisplayColumn = ['InvoiceDateString', 'Category',
    'Status', 'Reason', 'Result', 'Action'];
  incomingPayColumnType = [['InvoiceDateString', 'date'],
  ['Category', 'string'],
  ['Status', 'string'],
  ['Reason', 'string'],
  ['Result', 'string']
  ];
  filter: FormGroup;
  statusFilters = [
    {
      Month: 1, MonthName: 'Open',
    },
    {
      Month: 2, MonthName: 'Closed',
    }
  ];
  @ViewChild('allSelected',{ static: true }) public allSelected: MatOption;
  constructor(public getRouteParamtersService: GetRouteParamtersService,
    public activateRoute: ActivatedRoute, public policyManagerUrl: PolicyManagerUrlService,
    public policyService: PolicymanagerService,
    public router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.filter = this.fb.group({
      userType: new FormControl('')
    });
    this.getRouteParamtersService.getparameterslist(this.activateRoute);
    this.pagename = 'Edit Policy';

    this.moduleName = this.router.url.indexOf('advance-Search') > -1 ? 'Policy Manager - Advance Search ' : 'Policy manager';

   // this.clientList = JSON.parse(localStorage.getItem('ClientList'));
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.policyNumber = localStorage.getItem('PolicyNumber');
    if (this.userdetails.Permissions[1].Permission === 1) {
      this.isActionButtonDisabled = true;
    } else {
      this.isActionButtonDisabled = false;
    }
    this.GetPolicyData();
    this.GetFollowUpIssueList();
    this.FollowUpIssueListingPrmtrs();
    this.filter.controls.userType
      .patchValue([...this.statusFilters.map(item => item.Month), 0]);
  }
  ngAfterViewInit() {

    this.followupIssues.miDataSource.dataSubject.subscribe(isLoadingDone => {
      if (isLoadingDone && isLoadingDone.length > 0) {
        this.showCount = this.followupIssues.miDataSource.tableData.length;
        if (!this.listData) {
          this.listData = this.followupIssues.miDataSource.tableData;
        }
      // } else {
      //   this.showCount = 0;
      //   this.listData = this.followupIssues.miDataSource.tableData;
      }
    });
  }
  GetPolicyData() {
    //alert("in2");
    this.postdata = {
      'policyId': this.getRouteParamtersService.PolicyId
    }
    this.policyService.FollowUpIssuePolicyDetails(this.postdata).subscribe(response => {
      this.lastFollowUpRun = response.PolicyObject.LastFollowupRunString;
      this.isTrackPayment = response.PolicyObject.IsTrackPayment
    });
  }
  OnPageinationChange(value) {
    //alert("in");
    this.getRouteParamtersService.pageIndex = value.nextIndex;
    this.getRouteParamtersService.pageSize = value.newPageSize
    //this.GetPolicyData();
    this.GetFollowUpIssueList();
    this.FollowUpIssueListingPrmtrs();
  }
  GetFollowUpIssueList() {
    //alert("in1");
    const url = this.policyManagerUrl.PolicyDetails.GetFollowUpissuesList;
    this.followupIssues.url = url;
    this.followupIssues.miDataSource = new TableDataSource(this.policyService);
    this.followupIssues.columnLabels = this.incomingPayColumnLabel;
    this.followupIssues.displayedColumns = this.incomingPayDisplayColumn;
    this.followupIssues.columnDataTypes = this.incomingPayColumnType;
    this.followupIssues.columnIsSortable = ['true', 'true', 'true', 'true', 'true', 'false'];
    this.followupIssues.refreshHandler = this.needRefresh;
    // this.followupIssues.showPaging = true;
    this.followupIssues.resetPagingHandler = this.needPageReset;
    this.followupIssues.pageSize = this.getRouteParamtersService.pageSize
    this.followupIssues.initialPageIndex = this.getRouteParamtersService.pageIndex;
    this.followupIssues.miListMenu = new MiListMenu();
    this.followupIssues.miListMenu.visibleOnDesk = true;
    this.followupIssues.miListMenu.visibleOnMob = false;
    this.followupIssues.showPaging = true;
    this.followupIssues.isContextMenu = true;
    // this.followupIssues.initialSortBy = 'InvoiceDateString';
    // this.followupIssues.initialSortOrder = 'asc';
    this.followupIssues.isClientSideList = false;
    this.followupIssues.clientSideSearch = this.searchList;
    this.followupIssues.subMenuItems = [new CommissionListSubmenuItem('Payment Received', 3, true, false, null, ''),
    new CommissionListSubmenuItem('Resolve Invoice', 3, true, false, null, '')];
    this.followupIssues.miListMenu.menuItems = [
      new CommissionDashboardMenuItem('Remove', 1, true, true, this.TextChecking, '', true, null, this.ShowSubMenu)];
    this.followupIssues.miDataSource.dataSubject.subscribe(isLoadingDone => {
     
      if (isLoadingDone && isLoadingDone.length > 0) {
        this.showCount = this.followupIssues.miDataSource.tableData.length;
        if (!this.listData) {
          this.listData = this.followupIssues.miDataSource.tableData;
          //console.log("this.listData="+JSON.stringify(this.listData));
        }

      } else {
        this.showCount = 0;
      }
    });
    //alert("in1A");
  }

  TextChecking(event, value) {
    if (event.Status === 'Open') {
      value.itemName = 'Resolve';
      value.isSubMenuExist = 'true';
      value.class = 'down-arrow';
    } else if (event.Status === 'Closed') {
      value.itemName = 'Remove';
      value.isSubMenuExist = 'false';
      value.class = '';
    }
    return value.itemName;
  }
  ShowSubMenu(event, value) {
    if (event.Status === 'Open') {
      return true;
    } else {
      return false;
    }
  }
  OnStatusFiltering(data) {

    //this.statusId = this.filter.controls.userType.value;
    
    //this.statusId = this.statusId.toString();

    //alert("this.statusId2="+this.statusId);

    if (this.allSelected.selected) {
      this.allSelected.deselect();
    }
    if (this.filter.controls.userType.value.length === this.statusFilters.length) {
      this.allSelected.select();
    }
    for (const filter of this.filter.controls.userType.value) {
      this.searchData = filter === 2 ? 'Closed' : filter === 1 ? 'Open' : 'All';
      //alert("this.searchData="+this.searchData);
      if (this.searchData === 'All') {
        break;
      }
    }
   
    if (this.filter.controls.userType.value.length > 0) {
      this.OnBeforeListFiltered(this.searchData);
    } else {
      this.searchData = '';
      this.followupIssues.cachedList = [];
      this.followupIssues.clientSideSearch.next(true);

    }
    //this.GetPolicyData();
    this.GetFollowUpIssueList();
    this.FollowUpIssueListingPrmtrs();
  }
  
    toggleAllSelection() {
   
    //this.statusId = this.filter.controls.userType.value;
    
    //this.statusId = this.statusId.toString();

    //alert("this.statusId1="+this.statusId);

    if (this.allSelected.selected) {
      this.filter.controls.userType
        .patchValue([...this.statusFilters.map(item => item.Month), 0]);
      this.followupIssues.cachedList = this.listData;
      this.followupIssues.clientSideSearch.next(true);
    } else {
      this.filter.controls.userType.patchValue([]);
      this.followupIssues.cachedList = [];
      this.followupIssues.clientSideSearch.next(true);
    }
    //this.GetPolicyData();
    this.GetFollowUpIssueList();
    this.FollowUpIssueListingPrmtrs();
  }
  OnBeforeListFiltered(value) {
    //alert("inOnBeforeListFiltered");
    const searched = Object.assign([], this.listData);
    const newList = [];
    if (this.searchData && this.searchData !== 'All') {
      this.searchData = this.searchData.toLowerCase();
      for (let n = 0; n < searched.length; n++) {
        for (const sortingColumn of this.followupIssues.displayedColumns) {
          if (searched[n][sortingColumn] && searched[n][sortingColumn].toLowerCase().indexOf(this.searchData) > -1) {
            newList.push(searched[n]);
          }
        }
      }
      this.followupIssues.cachedList = newList;
      this.followupIssues.clientSideSearch.next(true);
    } else {
      this.followupIssues.cachedList = (this.listData) ?
        Object.assign([], this.listData) : Object.assign([], this.followupIssues.miDataSource.tableData);
      this.followupIssues.clientSideSearch.next(true);
    }
  }
  FollowUpIssueListingPrmtrs() {
    this.postdata = {
      'PolicyId': this.getRouteParamtersService.PolicyId,
      'StatusId': this.statusId
    }
    this.followupIssues.requestPostData = this.postdata;
    this.followupIssues.refreshHandler.next(true);
    this.showloading = false;
  }
  LastRefreshClicked() {
    this.showloading = true;
    this.postdata = {
      '_FollowUpRunModules': 4,
      '_DEU': null,
      'PolicyId': this.getRouteParamtersService.PolicyId,
      'IsTrackPayment': this.isTrackPayment,
      'IsEntryByCommissionDashboard': true,
      '_UserRole': this.userdetails['Role'],
      'PolicyModeChange': true
    }
    this.policyService.UpdateLastRefresh(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.GetPolicyData();
        this.FollowUpIssueListingPrmtrs();
      }
    });
  }
  OnSetAllSelectedMonths(list) {
    let data = "";
    list.filter(item => {
      data = data == "" ? item : data + ',' + item;
    });
    return data;
  }
  OnFilterGetIssues(selectedData) {
    this.selectedMonth = this.OnSetAllSelectedMonths(selectedData.Month);
    //alert("this.selectedMonth="+this.selectedMonth);
    this.statusId = this.selectedMonth;
    //alert("this.statusId="+this.statusId);
    this.GetFollowUpIssueList();
    this.FollowUpIssueListingPrmtrs();
  }
  OnMenuItemClicked(event) {
    if (event.data.Status === 'Open') {
      this.postdata = {
        'FollowupIssues': {
          'IssueResultId': 1,
          'IssueStatusId': 2,
          'IssueId': event.data.IssueId,
          'LastModifiedDateString': new Date(),
          'ModifiedBy': this.userdetails['UserCredentialID'],
          'IsResolvedFromCommDashboard': true,
        },
        'Policypaymententriespost': {
          'PolicyID': this.getRouteParamtersService.PolicyId,
          'InvoiceDateString': event.data.InvoiceDateString,
          'CreatedBy': this.userdetails['UserCredentialID'],
          'FollowUpVarIssueId': event.data.IssueId,
          'FollowUpIssueResolveOrClosed': 1

        }
      }
      this.showloading = true;
      this.policyService.AddUpdateFollowUpIssues(this.postdata).subscribe(response => {
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.postdata = {
            '_FollowUpRunModules': 5,
            '_DEU': null,
            'PolicyId': this.getRouteParamtersService.PolicyId,
            'IsTrackPayment': this.isTrackPayment,
            'IsEntryByCommissionDashboard': false,
            '_UserRole': this.userdetails['Role'],
            'PolicyModeChange': null
          }
          this.policyService.UpdateLastRefresh(this.postdata).subscribe(getresponse => {
            if (getresponse.ResponseCode === ResponseCode.SUCCESS) {
            }
          });
          this.followupIssues.cachedList = null;
          this.listData = '';
          this.followupIssues.refreshHandler.next(true);
          this.filter.controls.userType
            .patchValue([...this.statusFilters.map(item => item.Month), 0]);
          this.showloading = false;
        } else {
          this.showloading = false;
        }
      });
    } else {
      if (event.data.Status === 'Closed' && !event.data.IsResolvedFromCommDashboard) {
        this.openDeleteDialogBox(event.data.IssueId);
      } else {
        this.IsResolvedFromCommDashboardDilog();
      }
    }
  }

  IsResolvedFromCommDashboardDilog() {
    // this.showLoader = false;
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: 'Action not allowed',
        subTitle: 'Issue cannot be removed as it is manually resolved from Commission Dashboard.',
        buttonName: 'ok',
        isCommanFunction: false
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  openDeleteDialogBox(data) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Issue',
        subTitle: ' Are you sure you want to delete selected issue?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showloading = true;
        this.postdata = {
          'issueId': data
        }
        this.policyService.FollowUpIssueClosed(this.postdata).subscribe(response => {
          this.showloading = false;
          this.followupIssues.cachedList = null;
          this.listData = '';
          this.followupIssues.refreshHandler.next(true);
          this.filter.controls.userType
            .patchValue([...this.statusFilters.map(item => item.Month), 0]);
        });
      }
    });
  }
  OnPageRedirection() {
    if (this.router.url.indexOf('advance-Search') > -1) {
      this.router.navigate(['policy/advance-Search', this.getRouteParamtersService.parentTab,
        this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex]);
    }
    else {
      this.router.navigate(['policy/policyListing', this.getRouteParamtersService.parentTab,
        this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex],
        { queryParams: { client: this.getRouteParamtersService.ClientId } });
    }
  }
}
