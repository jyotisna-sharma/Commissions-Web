import { Component, OnInit } from '@angular/core';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from 'src/app/_services/table.datasource';
import { CompManagerService } from '../comp-manager.service';
import { CompManagerURLService } from '../comp-manager-url.service';
import { ResponseCode } from 'src/app/response.code';
import { MatDialog } from '@angular/material/dialog';
import { LinkedPolicyPaymentComponent } from '../../_services/dialogboxes/linked-policy-payment/linked-policy-payment.component';
import { ActivatePolicyComponent } from '../../_services/dialogboxes/activate-policy/activate-policy.component'
import { Router } from '@angular/router';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { PolicymanagerService } from '../../policy-manager/policymanager.service';
import { ActivatedRoute } from '@angular/router';
import { ResponseErrorService } from '../../_services/response-error.service';
@Component({
  selector: 'app-link-payment-to-policies',
  templateUrl: './link-payment-to-policies.component.html',
  styleUrls: ['./link-payment-to-policies.component.scss']
})
export class LinkPaymentToPoliciesComponent implements OnInit {
  pendingPolicy: MiProperties = new MiProperties();
  pendingPolicyNeedRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  accordionPanelNeedRefresh: Subject<boolean> = new Subject();
  accordionPanelList: MiProperties = new MiProperties();
  isaccordionPanelShow: Boolean = false;
  postdata: any;
  otherData: any;
  showloading: Boolean = false;
  userDetail: any;
  policyData: any;
  clientList: any;
  lastSelectedClass: any;
  policyPaymentEntries: any;
  count: any;
  searchData: any;
  constructor(
    public compMangrSvc: CompManagerService,
    public compManagerUrl: CompManagerURLService,
    public dialog: MatDialog,
    public route: Router,
    public appDataSvc: AppLevelDataService,
    public getrouteParamters: GetRouteParamtersService,
    public activateRoute: ActivatedRoute,
    public policymanagersvc: PolicymanagerService,
    public errorresponse: ResponseErrorService
  ) { }

  ngOnInit() {
    this.getrouteParamters.getparameterslist(this.activateRoute)
    this.userDetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetPendingPolicyList();
    this.GetPendingPolicyListPrmtrs();
  }
  // ----------------------------------This method is used for showing a list of pending policies-------------------------
  GetPendingPolicyList() {
    const url = this.compManagerUrl.LinkPolicies.GetPendingPoliciesList;
    this.pendingPolicy.url = url;
    this.pendingPolicy.miDataSource = new TableDataSource(this.compMangrSvc);
    this.pendingPolicy.columnLabels = ['Payor', 'Client', 'Policy #', 'Insured/Div', 'Carrier', 'Product', 'Comp type', 'Product type', ''];
    this.pendingPolicy.displayedColumns = ['PayorName', 'ClientName', 'PolicyNumber', 'Insured', 'CarrierName', 'ProductName',
      'CompTypeName', 'ProductType', 'Action'];
    this.pendingPolicy.columnIsSortable = ['true', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'false'];
    this.pendingPolicy.isClientSideList = false;
    this.pendingPolicy.refreshHandler = this.pendingPolicyNeedRefresh;
    this.pendingPolicy.showPaging = true;
    this.pendingPolicy.pageSize = this.getrouteParamters.pageSize;
    this.pendingPolicy.initialPageIndex = this.getrouteParamters.pageIndex;
    this.pendingPolicy.resetPagingHandler = this.needPageReset;
    this.pendingPolicy.miListMenu = new MiListMenu();
    this.pendingPolicy.miListMenu.visibleOnDesk = true;
    this.pendingPolicy.miListMenu.visibleOnMob = false;
    this.pendingPolicy.isaccordingPanelShown = false;
    this.pendingPolicy.isEditablegrid = false;
    this.pendingPolicy.miListMenu.menuItems =
      [
        new MiListMenuItem('Activate Policy', 3, true, true, this.IsButtonDisabled, 'img-icons active-policy-icn'),
        new MiListMenuItem('Link To Existing Policy', 3, true, true, this.IsButtonDisabled, 'img-icons link-icn'),
      ];
    this.pendingPolicy.miDataSource.dataSubject.subscribe(isloadingdone => {
      if (isloadingdone && isloadingdone.length > 0) {
        this.count = this.pendingPolicy.miDataSource.tableData.length;
      }
    });
  }
  IsButtonDisabled() {
    this.userDetail = JSON.parse(localStorage.getItem('loggedUser'));
    return this.userDetail.Permissions[5].Permission === 1
  }
  GetPendingPolicyListPrmtrs() {
    this.postdata = {
      'licenseeId': this.userDetail.LicenseeId,
      'FilterBy': this.searchData
    }
    this.pendingPolicy.requestPostData = this.postdata;
    this.pendingPolicy.refreshHandler.next(true);
  }
  // ######################################################################################################
  OnPageinationChange(value) {
    this.getrouteParamters.pageIndex = value.nextIndex;
    this.getrouteParamters.pageSize = value.newPageSize
  }
  // ----------------------------Used for Menu item click event for taking a actions----------------------
  OnLinkedPoliciesMenuItemClick(data) {
    if (data.name === 'Activate Policy') {
      this.showloading = true;
      this.OnActivatePolicy(data.data);
    } else if (data.name === 'Link To Existing Policy') {
      this.showloading = true;
      this.route.navigate(['/comp-manager/link-to-existing-policies', data.data.PolicyId,
        this.getrouteParamters.pageIndex, this.getrouteParamters.pageSize, this.getrouteParamters.parentTab]);
      // this.OpenInsuredPaymentDilog(data)
    }
  }
  // ######################################################################################################
  doSearch() {
    this.pendingPolicy.resetPagingHandler.next(true);
    this.GetPendingPolicyListPrmtrs()
  }

  handleSearchClear = (value) => {
    if (!value) {
      this.searchData = value;
      this.doSearch();
    } else if (value.type === 'click') {
      this.searchData = '';
      this.doSearch();
    }
  }
  // ---------------------------------this method is used for showing a dilog box on click link existing policy-------------------
  OpenInsuredPaymentDilog(recordData) {
    this.otherData = {
      'paymentEntriesData': this.policyPaymentEntries
    };
    const dilogRef = this.dialog.open(LinkedPolicyPaymentComponent, {
      data: {
        class: 'add-payees',
        isRowClickable: false,
        primaryButton: 'Ok',
        isPrimaryControl: false,
        isSecondryControl: false,
        columnLabels: ['', 'Client', 'Payor', 'Policy #', 'Insured/Div', 'Carrier', 'Product', 'Status', 'Comp type',
          'Product type', 'Effective date'],
        displayedColumns: ['SelectData', 'ClientName', 'PayorName', 'PolicyNumber', 'Insured', 'CarrierName', 'ProductName',
          'StatusName', 'Comp type',
          'CompTypeName', 'OriginDateString'],
        columnIsSortable: ['false', 'false', 'true', 'true', 'true', 'false', 'true', 'true', 'true', 'true', 'true'],
        showPaging: false,
        title: 'Link to existing policy',
        isCountHiden: true,
        isSecondListShown: true,
        listingURL: this.compManagerUrl.LinkPolicies.GetActivePoliciesList,
        isClientSideList: true,
        isEditableGrid: true,
        isSearchNotShown: true,
        postData: {
          'licenseeId': this.userDetail.LicenseeId,
          'statusId': 0,
        },
        secondGridData: {
          columnLabels: ['Payor', 'Client', 'Policy #', 'Insured/Div', 'Carrier', 'Product', 'Comp type', 'Product type', ''],
          displayedColumns: ['PayorName', 'ClientName', 'PolicyNumber', 'Insured', 'CarrierName', 'ProductName',
            'CompTypeName', 'ProductType', 'Action'],
          columnIsSortable: ['false', 'true', 'true', 'false', 'true', 'true', 'true', 'true', 'false'],
          cachedList: [recordData.data],
          isCountHiden: true,
          title: 'Select existing policy',
          url: ''
        },
        otherData: this.otherData
      },
      disableClose: true,
      width: '1250px',

    });
    dilogRef.afterClosed().subscribe(result => {
    });
  }
  // ###########################################################################################################################
  // ---------------------------used for shown a activate policy popup--------------------------------------------------------------
  OnActivatePolicy(value) {
    const postData = { 'licenseeId': this.userDetail['LicenseeId'] };
    // this.policymanagersvc.getAllClientName(postData).subscribe(response => {
    //   if (response.ResponseCode === 200) {
    //     this.clientList = response.ClientList;
        this.showloading = false;
        const dialogRef = this.dialog.open(ActivatePolicyComponent, {
          data: {
            extraData: { 'CurrentClient': value.ClientName, 'PolicyID': value.PolicyId, 'ClientList': this.clientList }
          },
          width: '450px',
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.showloading = true;
            const data = { 'PolicyId': value.PolicyId, 'ClientId': result,'loggedInUserId':this.userDetail.UserCredentialID };
            this.compMangrSvc.ActivatePolicy(data).subscribe(getresponse => {
              this.showloading = false;
              this.pendingPolicy.refreshHandler.next(true);
              if (getresponse.ResponseCode === 200) {
              } else {
                this.errorresponse.OpenResponseErrorDilog('Error occured while activate client');
              }

            });

          }
        });
      }
    //});

  //}
  // ###########################################################################################################################

}
