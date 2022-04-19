import { Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { merge, Subject } from 'rxjs'
import { tap } from 'rxjs/operators';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { Router, ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
@Component({
  selector: 'app-import-policy-grid',
  templateUrl: './import-policy-grid.component.html',
  styleUrls: ['./import-policy-grid.component.scss']
})
export class ImportPolicyGridComponent implements OnInit, AfterViewInit {

  noRecordFound = CONSTANTS.noRecordFound;
  IsHouseAccount: boolean;
  GetListData: any;
  // Set input/output parameter for read
  @Input() ImportPolicyList: MiProperties;
  @Input() selectedRow: any;
  // @Input() isActive: boolean;
  @Input() isFieldSelected: any;
  @Input() isButtonDisabled: any;
  // @Input() getselect: any;
  @Output() onMenuItemClick = new EventEmitter<object>();
  @Output() OnCheckBoxClick = new EventEmitter<object>();
  @Output() SelectAllCheckBoxes = new EventEmitter<object>();
  @Output() onchangeClick = new EventEmitter<object>();
  @Output() onInputClicked = new EventEmitter<object>();
  @Output() onchange: EventEmitter<MatRadioChange>
  @Output('closed') closedStream: EventEmitter<void>
  @Output() onRowClick = new EventEmitter<object>();
  @Output() onPageChange = new EventEmitter<object>();
  @Output() onSortChange = new EventEmitter<object>();
  @Output() onAfterDataLoaded = new EventEmitter<object>(); // this can we emit for getting response when from loaddata
  @Output() AfterLoadingData = new EventEmitter<object>();
  @Input() isValidationShown: any;
  // set view child for paginator.
  @ViewChild(MatSort,{ static: true }) sort: MatSort;
  @ViewChild(MatPaginator,{ static: true }) paginator: MatPaginator;
  @Input() isloaderShown: Boolean = true;
  // Default table parameters
  length = 100;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  dataObservable: Observable<any>;
  positionOptions: TooltipPosition[] = ['above'];
  position = new FormControl(this.positionOptions[0]);
  datafound: boolean;
  lstMapped: any[][];
  ParentTab: any;
  getinputValue: any;
  minimumpagesize: any;
  currentdate: Date = new Date('12/15/18:00:00:00')
  blankstring: any = '-';
  constructor(
    public appData: AppLevelDataService,
    public router: Router,
    public activateroute: ActivatedRoute) {
  }

  ngOnInit() {
    // this.getselect = 'PolicyId';
    this.minimumpagesize = 11;
    // document.getElementById
    this.ParentTab = this.activateroute.snapshot.params['ParentTab'];
    this.datafound = false;
    this.paginator.pageSize = this.ImportPolicyList.pageSize
    this.paginator.pageIndex = this.ImportPolicyList.initialPageIndex;
    this.sort.direction = this.ImportPolicyList.initialSortOrder;
    this.sort.active = this.ImportPolicyList.initialSortBy;

    if (this.paginator.pageSize === 0 && this.paginator.pageIndex === 0) {
      this.paginator.pageSize = 10;
      this.paginator.pageIndex = 0;
    }

    // Handler to refresh the listing
    this.ImportPolicyList.refreshHandler.subscribe(needRefresh => {
      if (needRefresh) {
        this.loadTableData();
        // Following is to set the sort state of list as specified after refresh
        this.sort._stateChanges.next();
      }
    })

    // Handler to emit - data loading is done
    this.ImportPolicyList.miDataSource.loadingSubject.subscribe(isLoadingDone => {
      if (!isLoadingDone) {
        this.onDataLoaded();
      }
    })
    this.loadTableData();
  }
  onInputclick(recordData, columnName) {
    this.onInputClicked.emit({ data: recordData, columnName: columnName });
  }
  OndateChange(recordData, columnName) {
    if (recordData[columnName]) {
      recordData[columnName] = this.mmDDyyyFormat(recordData[columnName])
      recordData.isrowclick = !recordData.isrowclick;
      recordData.isdateClicked = !recordData.isdateClicked
    }
  }
  convertTodateFormat(date: Date) {
    return this.currentdate;
  }
  mmDDyyyFormat = (date: Date): string => {
    if (date) {
     
      let datelength;
      datelength = date.getFullYear();
      datelength = datelength.toString();
      if (datelength.length === 4) {
        datelength = datelength.slice(-2);
      }
      return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + datelength);
    }
  }
  OnDateFocusOut(recordData, columnName) {
    if (recordData[columnName]) {
      recordData[columnName] = this.mmDDyyyFormat(recordData[columnName])
    }
  }
  OnValidationShown(data, columnName) {
    if (columnName) {
      for (const InvalidColumnName of data.invalidColumn) {
        if (InvalidColumnName === columnName) {
          return true;
        }
      }
    }
  }
  ngAfterViewInit() {
    if (this.ImportPolicyList.clientSideSearch) {
      this.ImportPolicyList.clientSideSearch.subscribe(doSearch => {
        if (doSearch) {
          this.ImportPolicyList.miDataSource.reloadData(this.ImportPolicyList.cachedList);
        }
      });
    }
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = this.ImportPolicyList.initialPageIndex;

      // this.onSortChange.emit(event);
      if (this.ImportPolicyList.isClientSideList === true) {
        let type = 'string';
        if (this.ImportPolicyList.columnDataTypes) {
          for (let i = 0; i < this.ImportPolicyList.columnDataTypes.length; i++) {
            if (this.ImportPolicyList.columnDataTypes[i][0] === this.sort.active) {
              type = this.ImportPolicyList.columnDataTypes[i][1];
              break;
            }
          }
        }
        this.ImportPolicyList.miDataSource.reloadData
          (this.sortArrayOfObjects(this.ImportPolicyList.miDataSource.tableData, this.sort.active, this.sort.direction, type));
      }
    });
    if (this.ImportPolicyList.isClientSideList === false) {
      this.dataObservable = merge(this.sort.sortChange, this.paginator.page);
      this.dataObservable.pipe(tap(() => this.loadTableData())).subscribe();
    }
  }

  // method to do client side search
  searchData(list) {
    this.ImportPolicyList.miDataSource.reloadData(list);
  }

  // Method to sort array,  in case client side sorting required
  sortArrayOfObjects(arrayToSort, key, type, datatype = null) {
   
    function compareObjects(a, b) {

      if (datatype === 'date') {
        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();
        if (type === 'asc') {
          return dateA > dateB ? 1 : -1;
        }
        if (type === 'desc') {
          return dateA > dateB ? -1 : 1;
        }
      }

      if (datatype === 'string') {
        const firstElemnet = (a[key] ? a[key].toLowerCase() : a[key]);
        const secondElement = (b[key] ? b[key].toLowerCase() : b[key]);
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
      if (datatype === 'currency') {
        const firstElemnet = (a[key] ? Number(a[key].replace('$', '')) : a[key]);
        const secondElement = (b[key] ? Number(b[key].replace('$', '')) : b[key]);
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
      if (datatype === 'percentage') {

        const firstElemnet = (a[key] ? Number(a[key].replace('%', '')) : a[key]);
        const secondElement = (b[key] ? Number(b[key].replace('%', '')) : b[key]);
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
      if (datatype === 'number') {

        const firstElemnet = Number(a[key]);
        const secondElement = Number(b[key]);
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
      if (datatype === 'distinct') {
        let firstElemnet = a[key];
        firstElemnet = firstElemnet.split('/');
        firstElemnet = Number(firstElemnet[0]);
        let secondElement = b[key];
        secondElement = secondElement.split('/');
        secondElement = Number(secondElement[0]);
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
    }
    return arrayToSort.sort(compareObjects);
  }
  // sortFunction(firstDate, seconddate) {
  //   const dateA = new Date(firstDate.CustomStartDate).getTime();
  //   const dateB = new Date(seconddate.CustomStartDate).getTime();
  //   return dateA > dateB ? 1 : -1;
  // };
  // Load request paramter for pagination and sorting and reload the table
  public loadTableData() {
    this.ImportPolicyList.requestPostData.SortType = this.sort.direction;
    this.ImportPolicyList.requestPostData.SortBy = this.sort.active;
    this.ImportPolicyList.requestPostData.PageIndex = this.paginator.pageIndex;
    this.ImportPolicyList.requestPostData.PageSize = this.paginator.pageSize;
    this.ImportPolicyList.miDataSource.loadData(this.ImportPolicyList.requestPostData, this.ImportPolicyList.url,
      this.ImportPolicyList.cachedList, this.ImportPolicyList.isClientSidePagination);
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  // ------------------------------------------------- event emitters for passing data to parent control-----------------------------------

  menuItemClicked(nameOfItemClicked, obj, event?: any, events?: any) {
    this.onMenuItemClick.emit({ name: nameOfItemClicked, data: obj, event: event, events: events });
  }

  onDataLoaded() {
    if (this.ImportPolicyList.miDataSource.tableData) {
      this.onAfterDataLoaded.emit({ response: this.ImportPolicyList.miDataSource.getResponse });
      this.AfterLoadingData.emit({ data: this.ImportPolicyList })
    }
  }
  // ###########################################################################################################################
}
