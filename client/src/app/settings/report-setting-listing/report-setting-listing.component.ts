import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from '../../_services/table.datasource';
import { SettingsAPIURLService } from '../settings-api-url.service';
import { SettingsService } from '../settings.service';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { ResponseCode } from 'src/app/response.code';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-report-setting-listing',
  templateUrl: './report-setting-listing.component.html',
  styleUrls: ['./report-setting-listing.component.scss']
})
export class ReportSettingListingComponent implements OnInit {
  title: any;
  userdetail: any;
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  searchList: Subject<boolean> = new Subject();
  url: any;
  postData: any;
  fields: any;
  FieldList: any;
  searchData: any;
  buttonClicked = false;
  isChangesInListing: Boolean = false
  toggleSelect = false;
  isCheckBoxDisabled = false;
  showLoading: Boolean = false;
  columnLabels: string[] = [
    'Checkbox',
    'Field Name'];

  displayedColumns: string[] = [
    'Checkbox',
    'DisplayFieldName'];

  columnIsSortable: string[] = [
    'false',
    'true'];
  constructor(
    public route: Router,
    public activateRoute: ActivatedRoute,
    public getRouterparamter: GetRouteParamtersService,
    public sttngURLSvc: SettingsAPIURLService,
    public sttngSrvc: SettingsService,
    public dialog: MatDialog
  ) { }
  ngOnInit() {
    this.title = 'Settings';
    this.getRouterparamter.getparameterslist(this.activateRoute);
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.isCheckBoxDisabled = this.userdetail.Permissions[2].Permission === 1 ? true : false;
    this.GetSettingsList();
    this.RefreshList();
  }
  GetSettingsList() {
    this.url = this.sttngURLSvc.SettingAPIRoutes.ReportSettingListing;
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
    this.MiListProperties.showPaging = false;
    this.MiListProperties.pageSize = this.getRouterparamter.pageSize
    this.MiListProperties.initialPageIndex = this.getRouterparamter.pageIndex;
    this.MiListProperties.isEditablegrid = true;
    this.MiListProperties.isClientSideList = true;
    this.MiListProperties.clientSideSearch = this.searchList;
    this.MiListProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', true, this.IsFieldDisabled, '', '', ''),
    }
  }
  IsFieldDisabled(event) {
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.userdetail.Permissions[2].Permission === 1) {
      return true;
    } else {
      return !event.IsModifiable;
    }

  }
  RefreshList() {
    this.postData = {
      'licenseeId': this.userdetail['LicenseeId'],
      'reportId': '1D38ACD0-BE49-4CD1-820C-B118EAE882DC'
    }
    this.MiListProperties.requestPostData = this.postData;
    this.MiListProperties.refreshHandler.next(true);
  }
  OnCheckBoxClicked(value) {
    this.isChangesInListing = true;
    value.data.Checked = !value.data.Checked;
    this.onDataLoaded(event);
  }
  OnSellectAllCheckBoxes() {
    if (this.userdetail.Permissions[2].Permission === 1) {
      this.isCheckBoxDisabled = true;
    }
    this.isChangesInListing = true;
    this.MiListProperties.miDataSource.tableData.forEach(element => {
      if (element.IsModifiable === true) {
        const newValue = !this.toggleSelect as boolean
        (element.Checked as boolean) = newValue
      }
    });
    this.toggleSelect = !this.toggleSelect;
  }
  onDataLoaded(value) {
    // tslint:disable-next-line:max-line-length
    if (this.MiListProperties.miDataSource.tableData.filter(x => x.Checked === true).length === this.MiListProperties.miDataSource.tableData.length) {
      this.toggleSelect = true;
    } else {
      this.toggleSelect = false;
    }
  }
  doSearch() {
    const searched = Object.assign([], this.MiListProperties.miDataSource.tableData);
    const newList = [];
    if (this.searchData) {
      this.searchData = this.searchData.toLowerCase();
      for (let n = 0; n < searched.length; n++) {
        for (const sortingColumn of this.MiListProperties.displayedColumns) {
          if (searched[n][sortingColumn] && searched[n][sortingColumn].toLowerCase().indexOf(this.searchData) === 0) {
            newList.push(searched[n]);
          }
        }
      }
      // this.MiListProperties.displayedColumns.cachedList = newList;
      // this.miOutgoingPaymentList.clientSideSearch.next(true);
    } else {
      // this.miOutgoingPaymentList.cachedList = (this.OutgoingPaymentlistData) ?
      //   Object.assign([], this.OutgoingPaymentlistData) : Object.assign([], this.miOutgoingPaymentList.miDataSource.tableData);
      // this.miOutgoingPaymentList.clientSideSearch.next(true);
    }
  }
  OnUpdateSettings() {
    this.showLoading = true;
    this.buttonClicked = true;
    let fields = '';
    for (const settings of this.MiListProperties.miDataSource.tableData) {
      if (settings.Checked) {
        fields += settings.FieldName + ',';
      }
    }
    this.fields = fields.substring(0, fields.length - 1);
    this.postData = {
      'licenseeId': this.userdetail['LicenseeId'],
      'reportId': '1D38ACD0-BE49-4CD1-820C-B118EAE882DC',
      'fields': this.fields
    }
    this.sttngSrvc.SaveSettings(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showLoading = false;
        this.AddUpdateSettingDilog();
        this.MiListProperties.refreshHandler.next(true);
      }
    });
  }
  OnbuttonCancel() {
    this.buttonClicked = true;
    this.RefreshList();
    this.MiListProperties.refreshHandler.next(true);
  }
  AddUpdateSettingDilog() {
    const dilogref = this.dialog.open(SuccessMessageComponent,
      {
        width: '450px',
        data: {
          Title: 'Setting  Updated Successfully',
          subTitle: ' Settings has been successfully updated in the system.',
          buttonName: 'ok',
          isCommanFunction: false
        },
        disableClose: true,
      });
  }

}
