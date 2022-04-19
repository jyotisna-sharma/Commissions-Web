import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { FormGroup, FormControl } from '@angular/forms';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { TableDataService } from '../../_services/table-data.service';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component'
import { TableDataSource } from '../../_services/table.datasource';
import { AppLevelDataService } from '../../_services/app-level-data.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { PeoplemanagerService } from '../peoplemanager.service';
import { PeopleManagerAPIUrlService } from '../people-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { SelectionModel } from '@angular/cdk/collections';
import { ResponseCode } from '../../response.code'
import { ResponseErrorService } from '../../_services/response-error.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
@Component({
  selector: 'app-data-entry-user-listing',
  templateUrl: './data-entry-user-listing.component.html',
  styleUrls: ['./data-entry-user-listing.component.scss']
})
export class DataEntryUserListingComponent implements OnInit {
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  url: any;
  getlicenseeId: any;
  searchData: any;
  filterData = false;
  userdetail: any;
  showloading: boolean = false;
  filterParameter: any;
  dataToPost: any;
  @Input() agentCount: string;
  @Input() userCount: string;
  @Input() dataEntryUserCount: string;
  columnLabels: string[] = [
    'Username',
    'First Name',
    'Last Name',
    'Created Date',
    ''
  ]

  displayedColumns: string[] = [
    'UserName',
    'FirstName',
    'LastName',
    'CreatedDate',
    'Action'
  ];

  columnIsSortable: string[] = [
    'true',
    'true',
    'true',
    'true',
    'false'
  ];
  constructor(
    public dialog: MatDialog,
    private appData: AppLevelDataService,
    private activateroute: ActivatedRoute,
    private router: Router,
    private _tableDataService: TableDataService,
    public peoplemanagerUrlService: PeopleManagerAPIUrlService,
    public peopleMangerSvc: PeoplemanagerService,
    public responseError: ResponseErrorService,
    public getrouteParamters: GetRouteParamtersService
  ) { }

  ngOnInit() {
    this.getrouteParamters.getparameterslist(this.activateroute);
    this.filterParameter = '';
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetDataEntryUserList();
    this.getpostdata();
  }
  GetDataEntryUserList() {
    this.url = this.peoplemanagerUrlService.PeoplemanagerAPIRoute.GetDataEntryUserList;
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
    this.MiListProperties.initialSortBy = 'Username';
    this.MiListProperties.initialSortOrder = 'asc';
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Delete', 3, true, false, null, 'img-icons delete-icn')
      ]
  }
  public getpostdata() {
    this.getlicenseeId = {
      'loggedInUser': this.userdetail['UserCredentialID'],
      'licenseeId': this.userdetail['LicenseeId'],
      'roleIdToView': '4',
      'FilterBy': this.filterParameter,
    }
    this.MiListProperties.requestPostData = this.getlicenseeId;
    this.MiListProperties.refreshHandler.next(true);
  }
  GetMiListResponse(value) {
    if (value) {
      // this.showloading = false;
      this.agentCount = value.response.AgentCount
      this.userCount = value.response.UserCount
      this.dataEntryUserCount = value.response.dataEntryUserCount
    }
  }
  OnCreateDEUser() {
    this.router.navigate(['/people/AddDataEntryUser', '3', this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
  }
  OnMenuItemClick(clickedRecord) {

    if (clickedRecord.name === 'Edit') {
      this.router.navigate(['/people/EditDataEntryUser', '3', clickedRecord.data.UserCredentialID, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
    else if (clickedRecord.name === 'Delete') {
      this.openDeleteDialogBox(clickedRecord.data.UserCredentialID, true);
    }
    else if (clickedRecord.name.Type === 'AnchorTag') {
      this.router.navigate(['/people/EditDataEntryUser', '3', clickedRecord.data.UserCredentialID, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
  }
  openDeleteDialogBox(usercredentialId: string, forceToDeleteStatus: boolean) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete DEU User',
        subTitle: ' Are you sure you want to delete DEU user?',
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
  handleSearchClear = (value) => {

    if (value === undefined || value === '') {
      this.searchData = value;
      this.DataSearch();
    } else if (value && value.type === 'click') {
      this.searchData = '';
      this.DataSearch();
    }
  }
  public DataSearch() {
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
}
