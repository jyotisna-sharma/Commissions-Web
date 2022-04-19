
// @CreatedBy :Ankit
// @Purpose:show user listing with searching and sorting and manage toggle button.
// @CreatedOn: Dec 31,2018
// @FunctionCount:

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { MiProperties } from '../../shared/mi-list/mi-properties';
// import { TableDataService } from '../../_services/table-data.service';
import { TableDataSource } from '../../_services/table.datasource';
// import { AppLevelDataService } from '../../_services/app-level-data.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { PeoplemanagerService } from '../peopleManager.service';
import { PeopleManagerAPIUrlService } from '../people-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component'
import { ResponseCode } from 'src/app/response.code';
import { ResponseErrorService } from '../../_services/response-error.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service'
@Component({
  selector: 'app-people-manager-user-listing',
  templateUrl: './people-manager-user-listing.component.html',
  styleUrls: ['./people-manager-user-listing.component.scss']
})
export class PeopleManagerUserListingComponent implements OnInit {
  //  ---------------------------------------Intialize variables for getting values------------------------------------
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  url: any;
  userdetail: any;
  usercredentialId: any;
  // pageSize: any;
  filterParameter: any;
  // pageIndex: any;
  getlicenseeId: any;
  setAdminValue: boolean;
  getRecordData: any;
  searchData: any; // this is used for search data
  filterData = false;
  postdata: any;
  isToggleButtonDisable: any;
  agentCount: any; // show the count of agent
  userCount: any // show the count of user
  dataEntryUserCount: any;
  showloading: boolean; // show the loader when get value
  // gettextValue: string;
  getCurrentToggleValue: boolean // this varibale is used for getting the current value of toggle
  columnLabels: string[] = [
    'Username',
    'Nickname',
    'First Name',
    'Last Name',
    'Email',
    'Created Date',
    'Admin',
    '']

  displayedColumns: string[] = [
    'UserName',
    'NickName',
    'FirstName',
    'LastName',
    'Email',
    'CreatedDate',
    'ToggleButton',
    'Action'];

  columnIsSortable: string[] = [
    'true',
    'true',
    'true',
    'true',
    'true',
    'true',
    'false',
    'false'];
  // ###################################################################################################################
  constructor(public dialog: MatDialog,
    // private appData: AppLevelDataService,
    // private route: ActivatedRoute,
    private router: Router,
    // private _tableDataService: TableDataService,
    public peoplemanagerUrlService: PeopleManagerAPIUrlService,
    public peopleMangerSvc: PeoplemanagerService,
    public responseError: ResponseErrorService,
    public getrouteParamters: GetRouteParamtersService,
    private activateroute: ActivatedRoute) {
  }

  ngOnInit() {
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.userdetail) {
      this.getrouteParamters.getparameterslist(this.activateroute);
      this.showloading = true;
      this.filterParameter = ''
      this.isToggleButtonDisable = this.userdetail.Permissions[0].Permission === 1 ? true : false;
      this.getUserlisting();
      this.getpostdata();
    }
  }
  // ----------- These functions used for show a popup on click of toggle button for assigned write/read permissions -------------------
  AssignWritePermissionDialogBox(usercredentialId: string, setAdminValue: boolean) {
    const dialogRef = this.dialog.open(ShowConfirmationComponent, {
      data: {
        usercredentialId: usercredentialId,
        headingTitle: 'Confirmation',
        subTitle:
          'Please note that to grant "Admin" rights, user will be granted "Write" access to all modules. Do you want to continue?',
        extraText: '',
        functionName: 'ChangeAdminStatus',
        AdminStatus: setAdminValue
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.setAdminValue = true;
        this.getCurrentToggleValue = false;
        this.OnToggleButtonClick(this.setAdminValue);
        this.MiListProperties.refreshHandler.next(true);
      } else {
        this.setAdminValue = false;
        this.MiListProperties.refreshHandler.next(true);
      }
    })
  }
  AssignReadPermissionDialogBox(usercredentialId: string, setAdminValue: boolean) {
    const dialogRef = this.dialog.open(ShowConfirmationComponent, {
      data: {
        usercredentialId: usercredentialId,
        headingTitle: 'Confirmation',
        subTitle:
          // tslint:disable-next-line:max-line-length
          'Please note that after removing "Admin" rights, user will be granted only "Read" access to all modules. Do you want to continue?',
        extraText: '',
        functionName: 'ChangeAdminStatus',
        AdminStatus: setAdminValue
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.setAdminValue = true;
        this.getCurrentToggleValue = true;
        this.OnToggleButtonClick(this.setAdminValue);
        this.MiListProperties.refreshHandler.next(true);
      } else {
        this.setAdminValue = false;
        this.MiListProperties.refreshHandler.next(true);
      }

    })

  }
  // ######################################################################################################################################
  // ----------------------------------------------These functions used for getting llist of users -----------------------------------------
  getUserlisting() {
    this.url = this.peoplemanagerUrlService.PeoplemanagerAPIRoute.GetUserListingAPIRoute
    this.MiListProperties.url = this.url
    this.MiListProperties.miDataSource = new TableDataSource(this.peopleMangerSvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = true;
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
        new MiListMenuItem('Delete', 3, true, true, this.IsDeleteDisable, 'img-icons delete-icn')
      ]
  }
  IsDeleteDisable() {
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    return this.userdetail &&(this.userdetail.Permissions[0].Permission === 1) === true ? true : false;
  }
  OnPageinationChange(value) {
    this.getrouteParamters.pageIndex = value.nextIndex;
    this.getrouteParamters.pageSize = value.newPageSize
  }
  getpostdata() {
    this.getlicenseeId = {
      'loggedInUser': this.userdetail['UserCredentialID'],
      'licenseeId': this.userdetail['LicenseeId'],
      'roleIdToView': '2',
      'FilterBy': this.filterParameter,
    }
    this.MiListProperties.requestPostData = this.getlicenseeId;
    this.MiListProperties.refreshHandler.next(true);
    this.showloading = false;
  }
  // ######################################################################################################################################

  // -------------------------------------------------- this function used for searching ---------------------------------------------------
  public DataSearch() {
    this.filterData = true;
    if (this.filterData) {
      this.filterParameter = this.searchData
    } else {
      this.filterParameter = ''
    }
    this.showloading = false;
    this.MiListProperties.resetPagingHandler.next(true);
    this.getpostdata()
  }
  handleSearchClear = (value) => {
    if (!value) {
      this.searchData = value;
      this.DataSearch();
    } else if (value.type === 'click') {
      this.searchData = '';
      this.DataSearch();
    }
  }
  // #############################################################################################################################
  // -------------------------------------------------get the response after from Milist component ----------------------------------------
  GetMiListResponse(value) {
    if (value) {
      this.showloading = false;
      this.agentCount = value.response.AgentCount
      this.userCount = value.response.UserCount
      this.dataEntryUserCount = value.response.dataEntryUserCount
    }
  }
  // #######################################################################################################################################
  // ------------------------------------------- For Manage toggle button On User listing tab----------------------------------------------
  OnToggleButtonClick(value) {

    if (!value.data) {
      if (this.getCurrentToggleValue === true) {
        this.getRecordData.Admin = false
      } else if (this.getCurrentToggleValue === false) {
        this.getRecordData.Admin = true
      }
    } else {
      this.getRecordData = value.data;
      if (value.data.Admin === false) {
        this.AssignWritePermissionDialogBox(value.data.UserCredentialID, this.getRecordData.Admin);
      } else {
        this.AssignReadPermissionDialogBox(value.data.UserCredentialID, this.getRecordData.Admin);
      }
    }
  }
  // #######################################################################################################################
  openDeleteDialogBox(usercredentialId: string, forceToDeleteStatus: boolean) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        usercredentialId: usercredentialId,
        licenseeId: this.userdetail['LicenseeId'],
        headingTitle: 'Delete Agent',
        subTitle: 'Are you sure you want to delete a user?',
        forceToDelete: forceToDeleteStatus,
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.postdata = { 'userCredentialId': usercredentialId, 'forceToDelete': true }
        this.peopleMangerSvc.DeleteAgent(this.postdata).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }

        })
      }
    })
  }
  openAgentHasPaymentsDialogBox(usercredentialId: string, forceToDeleteStatus: boolean) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      disableClose: true,
      data: {
        usercredentialId: usercredentialId,
        licenseeId: this.userdetail['LicenseeId'],
        headingTitle: 'Delete Agent',
        subTitle: 'Agent cannot be deleted as there are either payment entries or issues associated to his policies in the system.',
        forceToDelete: forceToDeleteStatus
      },
      width: '450px',
    })
  }
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
    if (this.userdetail.Permissions[0].Permission === 2) {
      if (itemClicked.name === 'toggle-button') {
        this.OnToggleButtonClick(itemClicked)
      } else if (itemClicked.name === 'Delete') {
        this.showloading = true;
        this.usercredentialId = itemClicked.data.UserCredentialID
        this.postdata = {
          'userCredentialId': this.usercredentialId,
          'forceToDelete': 'false'
        }
        this.peopleMangerSvc.DeleteAgent(this.postdata).subscribe(response => {
          this.showloading = false;
          if (response.ResponseCode === ResponseCode.SUCCESS && response.IsDeleteSuccess === 3) {
            this.openDeleteDialogBox(this.usercredentialId, true);
          } else {
            this.openAgentHasPaymentsDialogBox(this.usercredentialId, false);
          }
        })
      }
    }
  }
}
