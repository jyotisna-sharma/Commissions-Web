import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { TableDataService } from '../../_services/table-data.service';
import { TableDataSource } from '../../_services/table.datasource';
import { AppLevelDataService } from '../../_services/app-level-data.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { PeoplemanagerService } from '../peopleManager.service';
import { PeopleManagerAPIUrlService } from '../people-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component'
import { ResponseCode } from 'src/app/response.code';
import { ResponseErrorService } from '../../_services/response-error.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service'
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
@Component({
  selector: 'app-people-manager-listing',
  templateUrl: './people-manager-listing.component.html',
  styleUrls: ['./people-manager-listing.component.scss']
})
export class PeopleManagerListingComponent implements OnInit {
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  url: any;
  getlicenseeId: any;
  searchData: any;
  filterData = false;
  userdetail: any;
  usercredentialId: any;
  getHouseAccountName: any;
  getResult: any;
  dataToPost: any;
  pageSize: any;
  isRadiobuttonDisabled: any;
  isClick: any // used for stop searching in IE browser
  agentCount: any; // show the count of agent
  userCount: any // show the count of user
  dataEntryUserCount: any;
  showloading: boolean; // show the loader when get value
  pageIndex: any;
  filterParameter: any;
  columnLabels: string[] = [
    'Username',
    'Nickname',
    'First Name',
    'Last Name',
    'Email',
    'Created Date',
    'House Account',
    '']
  displayedColumns: string[] = [
    'UserName',
    'NickName',
    'FirstName',
    'LastName',
    'Email',
    'CreatedDate',
    'RadioButton',
    'Action'];
  columnIsSortable: string[] = [
    'true',
    'true',
    'true',
    'true',
    'true',
    'true',
    'true',
    'false'];
  // @ViewChild('searchService') private refSearch: ElementRef
  constructor(
    public dialog: MatDialog,
    private appData: AppLevelDataService,
    private activateroute: ActivatedRoute,
    private router: Router,
    private _tableDataService: TableDataService,
    public peoplemanagerUrlService: PeopleManagerAPIUrlService,
    public peopleMangerSvc: PeoplemanagerService,
    public responseError: ResponseErrorService,
    public getrouteParamters: GetRouteParamtersService) {
  }
  getlistofAgents() {
    this.url = this.peoplemanagerUrlService.PeoplemanagerAPIRoute.PeoplemanagerAPIRoute
    this.MiListProperties.url = this.url
    this.MiListProperties.miDataSource = new TableDataSource(this.peopleMangerSvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.initialSortBy = 'Username'
    this.MiListProperties.initialSortOrder = 'asc'
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Setting', 1, true, false, null, 'img-icons setting-icn'),
        new MiListMenuItem('User mapping', 2, true, false, null, 'img-icons user-icn'),
        new MiListMenuItem('Delete', 3, true, true, this.IsHouseAccountDisabled, 'img-icons delete-icn')
      ]
  }
  // ------------------------------------- This function is used for disabled a delete button based on condition--------------------------
  IsHouseAccountDisabled(element) {
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    return this.userdetail && (element.IsHouseAccount || this.userdetail.Permissions[0].Permission === 1) === true ? true : false;
  }
  OnPageinationChange(value) {
    this.getrouteParamters.pageIndex = value.nextIndex;
    this.getrouteParamters.pageSize = value.newPageSize
  }
  // #####################################################################################################################################
  openHouseAccountDialogBox(usercredentialId: string, houseAccountName: string) {
    this.MiListProperties.refreshHandler.next(false);
    const getusercredentialId = usercredentialId;
    const dialogRef = this.dialog.open(ShowConfirmationComponent, {
      data: {
        houseAccountName: houseAccountName,
        headingTitle: 'Confirmation',
        subTitle: 'Are you sure you want to transfer house account to another agent?',
        extraText: 'Current house account:',
        functionName: 'updateHouseAccount'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showloading = true;
        this.dataToPost = { 'userCredentialId': getusercredentialId, 'licenseeId': this.userdetail['LicenseeId'] }
        this.peopleMangerSvc.houseAccountUpdate(this.dataToPost).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.getResult.HouseAccountDetails.UserCredentialId = getusercredentialId;
            this.getResult.HouseAccountDetails.NickName = houseAccountName
            localStorage.setItem('loggedUser', JSON.stringify(this.getResult));
            this.showloading = false;
            this.MiListProperties.refreshHandler.next(true);
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }
        });
      }
    })
  }
  openDeleteDialogBox(usercredentialId: string, houseAccountName: string, forceToDeleteStatus: boolean) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        usercredentialId: usercredentialId,
        licenseeId: this.userdetail['LicenseeId'],
        houseAccountName: houseAccountName,
        headingTitle: 'Delete Agent',
        subTitle: ' Are you sure you want to delete an agent?',
        forceToDelete: forceToDeleteStatus,
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showloading = true;
        this.dataToPost = { 'userCredentialId': usercredentialId, 'forceToDelete': true }
        this.peopleMangerSvc.DeleteAgent(this.dataToPost).subscribe(response => {
          this.showloading = false;
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }

        })
      }
    })
  }
  openAgentHasPaymentsDialogBox(usercredentialId: string, houseAccountName: string, forceToDeleteStatus: boolean) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        usercredentialId: usercredentialId,
        licenseeId: this.userdetail['LicenseeId'],
        houseAccountName: houseAccountName,
        headingTitle: 'Delete Agent',
        subTitle: 'Agent cannot be deleted as there are either payment entries or issues associated with his policies in the system.',
        forceToDelete: forceToDeleteStatus
      },
      width: '450px',
      disableClose: true,
    })
  }
  ngOnInit() {
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.userdetail) {
      this.showloading = false;
      this.getrouteParamters.getparameterslist(this.activateroute);
      this.filterParameter = '';
      this.isRadiobuttonDisabled = this.userdetail.Permissions[0].Permission === 1 ? true : false;
      this.getlistofAgents();
      this.getpostdata();
    }
  }
  public getpostdata() {
    this.getlicenseeId = {
      'loggedInUser': this.userdetail['UserCredentialID'],
      'licenseeId': this.userdetail['LicenseeId'],
      'roleIdToView': '3',
      'FilterBy': this.filterParameter,
    }
    this.MiListProperties.requestPostData = this.getlicenseeId;
    this.MiListProperties.refreshHandler.next(true);
  }
  // -------------------------------------------------get the response after from Milist component ----------------------------------------
  GetMiListResponse(value) {
    // 
    if (value) {
      this.showloading = false;
      this.agentCount = value.response.AgentCount;
      this.userCount = value.response.UserCount;
      this.dataEntryUserCount = value.response.dataEntryUserCount
    }
  }
  // #######################################################################################################################################
 
  public DataSearch() {
    this.MiListProperties.initialPageIndex=0;
    this.filterData = true;
    if (this.filterData) {
      this.filterParameter = this.searchData
    } else {
      this.filterParameter = ''
    }
    this.MiListProperties.resetPagingHandler.next(true);
    this.showloading = false;
    this.getpostdata()
  }
  // ---------------------Manage all click events in listing page on Action button and Radio button click------------------------------
  onMenuItemClick(itemClicked) {
    if (itemClicked.name.Type === 'AnchorTag') {
      this.router.navigate(['/people/AddEditAgent', this.getrouteParamters.parentTab,
        '1', itemClicked.data.UserCredentialID, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    } else if (itemClicked.name === 'Edit') {
      this.router.navigate(['/people/AddEditAgent', this.getrouteParamters.parentTab,
        '1', itemClicked.data.UserCredentialID, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    } else if (itemClicked.name === 'Setting') {
      this.router.navigate(['/people/EditSettings', this.getrouteParamters.parentTab,
        '2', itemClicked.data.UserCredentialID, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    } else if (itemClicked.name === 'User mapping') {
      this.router.navigate(['/people/UserMapping', this.getrouteParamters.parentTab,
        '3', itemClicked.data.UserCredentialID, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
    this.getResult = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.getResult.Permissions[0].Permission === 2) {
      if (itemClicked.name === 'radio-button') {

        this.usercredentialId = itemClicked.data.UserCredentialID;
        this.getHouseAccountName = itemClicked.data.NickName;
        if (this.getResult.IsAdmin && this.getResult.Role === 2 ||
          this.getResult.UserCredentialID === this.getResult.HouseAccountDetails.UserCredentialId ||
          this.getResult.IsHouseAccount === true || this.getResult.Role === 1) {
          this.openHouseAccountDialogBox(this.usercredentialId, this.getHouseAccountName);
        } else {
          this.OnReadPermissionDialogBox();
        }

      } else if (itemClicked.name === 'Delete') {
        this.showloading = true;
        this.getResult = JSON.parse(localStorage.getItem('loggedUser'));
        this.usercredentialId = itemClicked.data.UserCredentialID
        this.getHouseAccountName = itemClicked.data.NickName
        this.dataToPost = {
          'userCredentialId': this.usercredentialId,
          'forceToDelete': 'false'
        }
        this.peopleMangerSvc.DeleteAgent(this.dataToPost).subscribe(response => {
          this.showloading = false;
          if (response.ResponseCode === ResponseCode.SUCCESS && response.IsDeleteSuccess === 3) {
            if (this.usercredentialId !== this.getResult.HouseAccountDetails.UserCredentialId) {
              this.openDeleteDialogBox(this.usercredentialId, this.getHouseAccountName, true);
            }
          } else {
            this.openAgentHasPaymentsDialogBox(this.usercredentialId, this.getHouseAccountName, false);
          }
        })
      }
    }
  }
  // #######################################################################################################################################
  handleSearchClear = (value) => {
    if (value === undefined || value === '') {
      this.searchData = value;
      this.DataSearch();
    } else if (value && value.type === 'click') {
      this.searchData = '';
      this.DataSearch();
    }
  }
  OnReadPermissionDialogBox() {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      data: {
        Title: 'Alert',
        subTitle: 'You are not permitted to perform this operation. Only administrator or house account can modify the house account setting. ',
        buttonName: 'ok',
        isCommanFunction: false
      },
      width: '400px',
      disableClose: true,
    });
  }
}
