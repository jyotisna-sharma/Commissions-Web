import { AuthenticationUrlService } from './../../authentication/authentication-url.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { TableDataSource } from '../../_services/table.datasource';
import { Subject } from 'rxjs/Subject';
import { ClientService } from '../client.service';
import { ClientAPIUrlService } from '../ClientAPIURLService';
import { Router, ActivatedRoute } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ResponseCode } from '../../response.code';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component'
import { CommonDataService } from '../../_services/common-data.service';
import { ResponseErrorService } from '../../_services/response-error.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
@Component({
  selector: 'app-client-listing',
  templateUrl: './client-listing.component.html',
  styleUrls: ['./client-listing.component.scss']
})
export class ClientListingComponent implements OnInit {
  // *******************************Variables Initalization**********************************************************
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  url: any;
  userdetail: any;
  dataToPost: any;
  activeCount: any;
  pendingCount: any;
  inactiveCount: any;
  totalCount: any;
  zeroCount: any;
  title: any;
  searchData: any;
  selectedCategory: any;
  clientID: any;
  // ClientsSelctedTab: any;
  getuserdetails: any;
  showLoading: boolean; // show the loader when get value
  arison: boolean = JSON.parse(localStorage.getItem('loggedUser')).LicenseeId == CONSTANTS.arisonId;
  searchTitle: any = this.arison == true ? 'Search: Name, Email, DOB, SSN, Phone' : 'Search: Name, Email';
  columnLabels: string[] =  this.arison == true ? ['Name', 'Email', 'DOB', 'SSN', 'Phone', ''] : ['Name', 'Email', 'Created Date', ''];
  displayedColumns: string[] = this.arison == true ? ['Name', 'Email', 'DOB', 'SSN', 'Phone', 'Action'] : ['Name', 'Email', 'CreatedDate', 'Action'];
  columnIsSortable: string[] = this.arison == true ? ['true', 'true', 'true','true','true', 'false'] : ['true', 'true', 'true', 'false'];
  // ####################################################################################################################
  constructor(
    public dialog: MatDialog,
    private activateroute: ActivatedRoute,
    private router: Router,
    public clientUrlService: ClientAPIUrlService,
    public getrouteParamters: GetRouteParamtersService,
    public commonService: CommonDataService,
    public authenUrl: AuthenticationUrlService,
    public error: ResponseErrorService,
    public clientSvc: ClientService) { }

  ngOnInit() {
    //this.ClientsSelctedTab = this.getrouteParamters.parentTab;
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    // if(this.userdetail.LicenseeId == "29c25140-f373-4947-849d-bc010b021412"){
    //     this.columnLabels == ['Name', 'Email', 'DOB', 'SSN', ''];
    //     this.displayedColumns == ['Name', 'Email', 'DOB', 'SSN', ''];
    //     this.columnIsSortable == ['true', 'true', 'true','true', 'false'];
    // }
    // else{
    //     this.columnLabels = ['Name', 'Email', 'Created Date', ''];
    //     this.displayedColumns = ['Name', 'Email', 'CreatedDate', 'Action'];
    //     this.columnIsSortable = ['true', 'true', 'true', 'false'];
    // }
    // debugger;
    if (this.userdetail) {
      this.title = 'All Clients';
      this.searchData = '';
      this.getrouteParamters.getparameterslist(this.activateroute);
      this.setTitle();
      if (this.userdetail && this.userdetail.Permissions[1].Permission === 3) {
        this.OnRedirectionToPage();
      }
      this.initClientsList();
      this.refreshList();
    }
  }
  // ******************************** Methods Related To Client Listing**********************************************
  initClientsList() { debugger;
    this.url = this.clientUrlService.ClientAPIRoute.GetClientListing;
    this.MiListProperties.url = this.url
    this.MiListProperties.miDataSource = new TableDataSource(this.clientSvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize;
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex;
    this.MiListProperties.initialSortBy = 'Name'
    this.MiListProperties.initialSortOrder = 'asc'

    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Delete', 1, true, true, this.IsdeleteDisable, 'img-icons delete-icn')
      ]

  }
  IsdeleteDisable() {
    this.getuserdetails = JSON.parse(localStorage.getItem('loggedUser'));
    return this.getuserdetails && this.getuserdetails.Permissions[1].Permission === 1 ? true : false;
  }
  refreshList() {
    this.dataToPost = {
      'LicenseeId': this.userdetail['LicenseeId'],
      'statusId': this.getrouteParamters.parentTab,
      'loggedInUserId': this.userdetail['UserCredentialID'],
      'FilterBy': this.searchData
    }

    this.MiListProperties.requestPostData = this.dataToPost;
    this.MiListProperties.refreshHandler.next(true);
    // this.MiListProperties.resetPageToZero = false;
  }
  // ###########################################################################################################################
  // **************************************** Methods used for Shown Title and Count for Left Naviagtion***************************
  setTitle() {
    this.selectedCategory = this.getrouteParamters.parentTab;
    this.title = 'All Clients'
    if (this.selectedCategory === '2') {
      this.title = 'Clients with pending policies';
    } else if (this.selectedCategory === '4') {
      this.title = 'Clients without policies';
    } else if (this.selectedCategory === '0') {
      this.title = 'Clients with active policies';
    } else if (this.selectedCategory === '1') {
      this.title = 'Clients with inactive policies';
    }
  }
  GetMiListResponse(value) {
    if (value) {
      this.activeCount = value.response.ActiveCount;
      this.pendingCount = value.response.PendingCount;
      this.inactiveCount = value.response.InactiveCount;
      this.zeroCount = value.response.ZeroCount;
      this.totalCount = value.response.TotalCount;

    }
  }
  // ################################################################################################

  // ************************************************************************************************
  OnRedirectionToPage() {
    let url = '';
    let ModuleFound = false;
    const details = JSON.parse(localStorage.getItem('loggedUser'));
    for (const permission of details.Permissions) {
      for (const moduleNames of this.authenUrl.Modules) {
        if (permission.Module === moduleNames.module && (permission.Permission === 2 || permission.Permission === 1)) {
          url = moduleNames.value;
          ModuleFound = true;
          break;
        }
      }
      if (ModuleFound === true) {
        this.router.navigate([url]);
        break;
      }
    }
  }
  // #########################################################################################################################
  // **************************************************************************************************************************
  isNavigationChanged(value) {
    // // Chek if same link clicked, then don't refresh listing
    // // 3 is position of Parent tab in URl - new value compared to old.
    // if (this.router.url.split('/').length > 3 && (this.router.url.split('/')[3] !== value.data)) {
    //   // Reset paging
    // // 
    //this.getrouteParamters.parentTab = value.data;
    // this.searchData = '';
    // this.MiListProperties.resetPagingHandler.next(true);
    //   // Refresh listing
    //this.refreshList();
    //   // Set title
    //   this.setTitle();
    // }
  }
  // #########################################################################################################################

  OnCreateClick() {
    this.router.navigate(['client/create-new', this.getrouteParamters.parentTab,
      this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex])
  }

  /*Pagination changed event  */
  OnPaginationChange(value) {
    this.getrouteParamters.pageIndex = value.nextIndex;
    this.getrouteParamters.pageSize = value.newPageSize;
  }



  doSearch() {
    this.showLoading = false;
    this.MiListProperties.initialPageIndex=0;
    this.MiListProperties.resetPagingHandler.next(true);
    this.refreshList()
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


  // ****************Methods used for Menu item navigation,Redirection and Delete Popup Open******************
  onMenuItemClick(value) {
    if (value.name.Type === 'AnchorTag') {
      this.commonService.value = value.data.ClientId;
      this.router.navigate(['/policy/policyListing/', // value.data.ClientId,
        this.getrouteParamters.parentTab === '4' ? 3 : this.getrouteParamters.parentTab, 10, 0]);
    } else if (value.name === 'Edit') {
      this.router.navigate(['/client/edit-client', value.data.ClientId,
        this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex])
    } else if (value.name === 'Delete') {
      this.showLoading = true;
      this.clientID = value.data.ClientId;
      this.dataToPost = { 'ClientID': this.clientID, 'ForceDelete': 'false' }
      this.clientSvc.deleteClient(this.dataToPost).subscribe(response => {
        this.showLoading = false;
        if (response.ResponseCode === ResponseCode.NoIssueWithEntity) {
          this.openDeleteDialogBox(this.clientID, true);
        } else if (response.ResponseCode === ResponseCode.IssueExistWithEntity) {
          this.openClientHasPaymentsDialogBox(this.clientID, response.Message, false);
        }
      })
    }
  }

  openClientHasPaymentsDialogBox(clientID: string, message: string, forceToDeleteStatus: boolean) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        clientID: clientID,
        //  licenseeId: this.userdetail['LicenseeId'],
        // houseAccountName: houseAccountName,
        headingTitle: 'Delete Client',
        subTitle: message,
        forceToDelete: forceToDeleteStatus
      },
      disableClose: true,
      width: '450px'
    })
  }
  openDeleteDialogBox(clientID: string, forceToDeleteStatus: boolean) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        ClientID: clientID,
        headingTitle: 'Delete Client',
        subTitle: ' Are you sure you want to delete this client?',
        forceToDelete: forceToDeleteStatus,
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showLoading = true;
        this.dataToPost = { 'ClientID': clientID, 'ForceDelete': true }
        this.clientSvc.deleteClient(this.dataToPost).subscribe(response => {
          // this.peopleMangerSvc.DeleteAgent(this.dataToPost).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          } else {
            this.error.OpenResponseErrorDilog(response.Message);
            return;
          }
          this.showLoading = false;
        })
      }
    })
  }
  // ##############################################################################################################
}
