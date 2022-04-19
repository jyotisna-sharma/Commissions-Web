import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ActivatedRoute } from '@angular/router';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from '../../_services/table.datasource';
import { SettingsService } from '../settings.service';
import { SettingsAPIURLService } from '../settings-api-url.service';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { ResponseCode } from 'src/app/response.code';
import { ResponseErrorService } from '../../_services/response-error.service';
@Component({
  selector: 'app-commission-schedule-listing',
  templateUrl: './commission-schedule-listing.component.html',
  styleUrls: ['./commission-schedule-listing.component.scss']
})
export class CommissionScheduleListingComponent implements OnInit {
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  title: any;
  userdetail: any;
  dataToPost: any;
  url: any;
  searchData: any;
  showLoading: Boolean= false;
  columnLabels: string[] = [
    'Payor',
    'Carrier',
    'Product',
    'Product Type',
    'Payment Type',
    'Mode',
    ''];

  displayedColumns: string[] = [
    'PayorName',
    'CarrierName',
    'CoverageName',
    'ProductType',
    'IncomingPaymentTypeName',
    'StringMode',
    'Action'];

  columnIsSortable: string[] = [
    'true',
    'true',
    'true',
    'true', 'true', 'true','false'];
  constructor(
    public route: Router,
    public activateRoute: ActivatedRoute,
    public getRouterparamter: GetRouteParamtersService,
    public sttngSrvc: SettingsService,
    public sttngURLSvc: SettingsAPIURLService,
    public dialog: MatDialog,
    public error: ResponseErrorService
  ) { }
  ngOnInit() {
    this.title = 'Settings';
    this.getRouterparamter.getparameterslist(this.activateRoute);
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetSettingsList();
    this.refreshList();
  }
  OnCreateClick() {
    this.route.navigate(['/settings/createSchedule', '1','1','10', '0']);
  }
  GetSettingsList() {
    this.url = this.sttngURLSvc.SettingAPIRoutes.CommissionScheduleList;
    this.MiListProperties.url = this.url
    this.MiListProperties.miDataSource = new TableDataSource(this.sttngSrvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getRouterparamter.pageSize
    this.MiListProperties.initialPageIndex = this.getRouterparamter.pageIndex
    // this.MiListProperties.initialSortBy = 'Name'
    // this.MiListProperties.initialSortOrder = 'asc'
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Delete', 1, true, true, this.IsButtonDisabled, 'img-icons delete-icn')
      ]
  }
  IsButtonDisabled(element) {
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    return (this.userdetail.Permissions[2].Permission === 1) ? true : false;
  }
  refreshList() {
    this.dataToPost = {
      'LicenseeId': this.userdetail['LicenseeId'],
      'FilterBy': this.searchData
    }

    this.MiListProperties.requestPostData = this.dataToPost;
    this.MiListProperties.refreshHandler.next(true);
    // this.MiListProperties.resetPageToZero = false;
  }
  OnMenuItemClicked(value) {
    if (value.name === 'Edit') {
      this.route.navigate(['/settings/EditSchedule', '1',this.getRouterparamter.childTab ,this.getRouterparamter.pageSize,
        this.getRouterparamter.pageIndex, value.data.IncomingScheduleID]);
    } else if (value.name === 'Delete') {
      this.openDeleteDialogBox(value.data.IncomingScheduleID);
    }
  }
  doSearch() {
    this.MiListProperties.resetPagingHandler.next(true);
    this.refreshList();
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
  openDeleteDialogBox(incomingScheduleId) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Setting',
        subTitle: ' Are you sure you want to delete this setting?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showLoading = true;
        this.dataToPost = {
          'incomingScheduleId': incomingScheduleId
        };
        this.sttngSrvc.DeleteSettings(this.dataToPost).subscribe(getresponse => {
          if (getresponse.ResponseCode === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
            this.showLoading = false;
          } else {
            this.error.OpenResponseErrorDilog(getresponse.Message);
            this.showLoading = false;
          }
        });
      }
    })
  }
}
