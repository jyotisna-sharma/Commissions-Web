import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MiProperties } from '../../../shared/mi-list/mi-properties';
import { MiListMenu } from '../../../shared/mi-list/mi-list-menu';
import { TableDataSource } from '../../table.datasource';
import { CommonDataService } from '../../common-data.service';
import { Subject } from 'rxjs/Subject';
import { GetRouteParamtersService } from '../../getRouteParamters.service';
import { ListingData } from '../listing/listing.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ActivatedRoute, Router } from '@angular/router';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { LeavePageData } from '../leave-page/leave-page-data.model';
import * as $ from 'jquery';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit, AfterViewInit {

  MiListProperties: MiProperties = new MiProperties();
  lastSelectedTr: any;
  needPageReset: Subject<boolean> = new Subject();
  needRefresh: Subject<boolean> = new Subject();
  searchList: Subject<boolean> = new Subject();
  listingURL: any;
  dialogData: any;
  dataTopost: any;
  dataPassing: any;
  lastSelectedClass: any;
  listPassing: any = [];
  DataFilter: any;
  selectedRow: any;
  toggleSelect = false;
  searchData: any;
  isdisabled: any;
  getlistData: any;
  self: any;
  showloading: Boolean;
  totalCount: any;
  defaultSelectedValue: boolean;
  firstDateofMonth: any;
  listform = new FormGroup({
    primaryControl: new FormControl('', []),
    secondryControl: new FormControl('', [])
  });
  constructor(
    public CommanDataSvc: CommonDataService,
    public getrouteParamters: GetRouteParamtersService,
    @Inject(MAT_DIALOG_DATA) public data: ListingData,
    public dialogRef: MatDialogRef<ListingComponent>,
    public activatedRoute: ActivatedRoute,
    public route: Router
  ) {
    this.dialogData = this.data;
    this.self = this;
  }

  ngOnInit() {
    this.showloading = true;
    this.initList();
    this.refreshList();
    const currentDate = new Date();

    this.firstDateofMonth = currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/01';
    this.listform.controls.primaryControl.setValue(new Date(this.firstDateofMonth));
    if (this.data.SecondryControlType) {
      this.listform.controls.secondryControl.setValue(this.data.SecondryControlType.DefaultselectedValue);
    }
  }
  ngAfterViewInit() {
    this.listform.controls.primaryControl.valueChanges.subscribe(result => {
      this.dataToSend();
    });
    this.listform.controls.secondryControl.valueChanges.subscribe(result => {
      this.dataToSend();
    });
  }

  initList() {

    this.listingURL = this.data.listingURL; // this.getURL.DomainDataList.GetpoliciesList;
    this.MiListProperties.url = this.listingURL;
    this.MiListProperties.cachedList = this.data.cachedList;
    this.MiListProperties.requestPostData = this.data.postData;
    this.MiListProperties.miDataSource = new TableDataSource(this.CommanDataSvc);
    this.MiListProperties.displayedColumns = this.data.displayedColumns;
    this.MiListProperties.columnLabels = this.data.columnLabels;
    this.MiListProperties.columnIsSortable = this.data.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = this.data.showPaging;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize;
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex;
    this.MiListProperties.isClientSideList = this.data.isClientSideList;
    this.MiListProperties.clientSideSearch = this.searchList;
    this.MiListProperties.isEditablegrid = this.data.isEditableGrid;
    this.showloading = false;
    this.defaultSelectedValue = false
    this.MiListProperties.fieldType = {
      'SelectData': new MiListFieldType('', 'SelectData', '', '', 'radio-button', '', '', false, null, '', '', ''),
    }
    this.MiListProperties.miDataSource.dataSubject.subscribe(isLoadingDone => {
      this.totalCount = 0;
      if (isLoadingDone.length > 0) {
        this.totalCount = this.MiListProperties.miDataSource.tableData.length;
        if (!this.data.cachedList) {
          this.data.cachedList = this.MiListProperties.miDataSource.tableData;
        }
      }
    });
  }
  refreshList() {
    this.dataTopost = this.data.postData;
    this.MiListProperties.requestPostData = this.dataTopost;
    this.MiListProperties.refreshHandler.next(true);
  }
  MenuItemClicked(value) {

    if (this.lastSelectedClass) {
      this.lastSelectedClass.removeClass('highlighted-row');
    }
    if (value.name === 'radio-button') {
      value.event.checked = true;
      $(value.events.currentTarget).closest('.mat-row').addClass('highlighted-row');
      this.lastSelectedClass = $(value.events.currentTarget).closest('.mat-row');
      this.data.otherData.isdisabled = false;
      this.getlistData = value.data;
      this.dataToSend();
    }

  }
  dataToSend() {

    this.dataPassing = {
      'listdata': this.getlistData,
      'primaryControl': this.listform.controls.primaryControl.value,
      'SecondryControl': this.listform.controls.secondryControl.value
    }
  }

  onSelectAll(event) {
    this.MiListProperties.miDataSource.tableData.forEach(element => {
      if (element && this.isObject(element['CheckBox'])) {
        const newValue = !this.toggleSelect as boolean
        (element['CheckBox']['FormattedValue'] as boolean) = newValue
        if (newValue) {
          this.fillPayeeList(element, true);
        } else {
          this.fillPayeeList(element, false);
        }
      }
    });
    this.toggleSelect = !this.toggleSelect;
  }
  isObject(val) {
    if (val == null) {
      return false;
    } else {
      return typeof val === 'object';
    }
  }
  fillPayeeList(data: any, toAdd: boolean) {
    if (toAdd) {
      if (this.data.otherData.customSplit === false) {
        this.dataTopost = {
          'PolicyId': this.data.otherData.PolicyId,
          'ScheduleTypeId': this.data.otherData.ScheduleTypeId,
          'OutgoingScheduleId': Guid.create().toJSON().value,
          'PayeeUserCredentialId': data['UserCredentialID'],
          'FirstYearPercentage': data['FirstYearDefault'] ? data['FirstYearDefault'] : 0,
          'RenewalPercentage': data['RenewalDefault'] ? data['RenewalDefault'] : 0,
          'PayeeName': data['NickName']
        }
      } else {
        const todayDate = new Date();
        this.dataTopost = {
          'PolicyId': this.data.otherData.PolicyId,
          'ScheduleTypeId': this.data.otherData.ScheduleTypeId,
          'OutgoingScheduleId': Guid.create().toJSON().value,
          'PayeeUserCredentialId': data['UserCredentialID'],
          'CustomStartDate': todayDate,
          'splitpercentage': 0,
          'PayeeName': data['NickName']
        }
      }
      this.listPassing.push(this.dataTopost);
    } else {
      for (let i = 0; i < this.listPassing.length; i++) {
        if (this.listPassing[i].PayeeUserCredentialId === data['UserCredentialID']) {
          this.listPassing.splice(i, 1);
          break;
        }
      }
    }
    if (this.listPassing.length === 0) {
      this.data.otherData.isdisabled = true;
    } else {
      this.data.otherData.isdisabled = false;
    }

    this.dataPassing = this.listPassing;
  }
  oncheckedvaluecheck(event) {
    event.data.CheckBox.FormattedValue = !event.data.CheckBox.FormattedValue
    if (event.data.CheckBox.FormattedValue === true) {
      this.fillPayeeList(event.data, true);
    } else {
      this.fillPayeeList(event.data, false);
    }
  }

  /**********************Search LIst************************* */
  includesStr(values, str) {
    return values.map(function (value) {
      return String(value);
    }).find(function (value) {
      return value.includes('Lets');
    });
  }

  doSearch() {
    let searched = Object.assign([], this.data.cachedList);
    const newList = [];
    if (this.searchData) {
      this.searchData = this.searchData.toLowerCase();
      // Generic solution to be implemented for below

      for (let n = 0; n < searched.length; n++) {
        for (const sortingColumn of this.data.displayedColumns) {
          if (searched[n][sortingColumn] &&
            sortingColumn != 'CheckBox' &&
            searched[n][sortingColumn].toLowerCase().indexOf(this.searchData) > -1) {
             const searchList = newList.find(item => item === searched[n]);
             if (!searchList) {
               newList.push(searched[n]);
             }
            // newList.push(searched[n]);
            // if (searched[n][sortingColumn] && searched[n][sortingColumn].toLowerCase().indexOf(this.searchData) === 0) {
            //             newList.push(searched[n]);
            //       }
          }
        }
      }
      this.MiListProperties.cachedList = newList;
      this.MiListProperties.clientSideSearch.next(true);
    } else {
      this.MiListProperties.cachedList = (this.data.cachedList) ?
      Object.assign([], this.data.cachedList) : Object.assign([], this.MiListProperties.miDataSource.tableData);
      this.MiListProperties.clientSideSearch.next(true);
    }
  }

  handleSearchClear(event) {
    this.MiListProperties.cachedList = (this.data.cachedList) ?
      Object.assign([], this.data.cachedList) : Object.assign([], this.MiListProperties.miDataSource.tableData);
    this.MiListProperties.clientSideSearch.next(true);
  }
}
