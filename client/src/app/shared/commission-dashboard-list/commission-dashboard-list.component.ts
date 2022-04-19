import { Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { merge, Subject } from 'rxjs'
import { tap } from 'rxjs/operators';
import { MiProperties } from '../mi-list/mi-properties';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { Router, ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { CommDashboardComponent } from '../../policy-manager/comm-dashboard/comm-dashboard.component';

@Component({
  selector: 'app-commission-dashboard-list',
  templateUrl: './commission-dashboard-list.component.html',
  styleUrls: ['./commission-dashboard-list.component.scss']
})
export class CommissionDashboardListComponent implements OnInit, AfterViewInit {

  noRecordFound = CONSTANTS.noRecordFound;
  IsHouseAccount: boolean;
  GetListData: any;
  // Set input/output parameter for read
  @Input() commissionDashboardList: MiProperties;
  @Input() selectedRow: any;
  // @Input() isActive: boolean;
  @Input() isFieldSelected: any;
  @Input() isButtonDisabled: any;
  // @Input() getselect: any;
  @Output() onMenuItemClick = new EventEmitter<object>();
  @Output() OnCheckBoxClick = new EventEmitter<object>();
  @Output() SelectAllCheckBoxes = new EventEmitter<object>();
  @Output() onchangeClick = new EventEmitter<object>();
  @Output() onchange: EventEmitter<MatRadioChange>
  @Output() onRowClick = new EventEmitter<object>();
  @Output() onPageChange = new EventEmitter<object>();
  @Output() onSortChange = new EventEmitter<object>();
  @Output() onAfterDataLoaded = new EventEmitter<object>(); // this can we emit for getting response when from loaddata
  @Output() AfterLoadingData = new EventEmitter<object>();
  @Input() isValidationShown: any;
  // set view child for paginator.
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
    this.paginator.pageSize = this.commissionDashboardList.pageSize
    this.paginator.pageIndex = this.commissionDashboardList.initialPageIndex;
    this.sort.direction = this.commissionDashboardList.initialSortOrder;
    this.sort.active = this.commissionDashboardList.initialSortBy;

    if (this.paginator.pageSize === 0 && this.paginator.pageIndex === 0) {
      this.paginator.pageSize = 10;
      this.paginator.pageIndex = 0;
    }

    // Handler to refresh the listing
    this.commissionDashboardList.refreshHandler.subscribe(needRefresh => {
      if (needRefresh) {
        this.loadTableData();
        // Following is to set the sort state of list as specified after refresh
        this.sort._stateChanges.next();
      }
    })

    // handler to reset paging , if required
    if (this.commissionDashboardList.resetPagingHandler) {
      this.commissionDashboardList.resetPagingHandler.subscribe(needPageReset => {
        if (needPageReset) {
          this.resetPaging();
        }
      })
    }
    // Handler to emit - data loading is done
    this.commissionDashboardList.miDataSource.loadingSubject.subscribe(isLoadingDone => {
      if (!isLoadingDone) {
        this.onDataLoaded();
      }
    })
    this.loadTableData();
  }

  ngAfterViewInit() {
    if (this.commissionDashboardList.clientSideSearch) {
      this.commissionDashboardList.clientSideSearch.subscribe(doSearch => {
        if (doSearch) {
          this.commissionDashboardList.miDataSource.reloadData(this.commissionDashboardList.cachedList);
        }
      });
    }
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = this.commissionDashboardList.initialPageIndex;

      // this.onSortChange.emit(event);
      if (this.commissionDashboardList.isClientSideList === true) {
        let type = 'string';
        if (this.commissionDashboardList.columnDataTypes) {
          for (let i = 0; i < this.commissionDashboardList.columnDataTypes.length; i++) {
            if (this.commissionDashboardList.columnDataTypes[i][0] === this.sort.active) {
              type = this.commissionDashboardList.columnDataTypes[i][1];
              break;
            }
          }
        }
        this.commissionDashboardList.miDataSource.reloadData
          (this.sortArrayOfObjects(this.commissionDashboardList.miDataSource.tableData, this.sort.active, this.sort.direction, type));
      }
    });
    if (this.commissionDashboardList.isClientSideList === false) {
      this.dataObservable = merge(this.sort.sortChange, this.paginator.page);
      this.dataObservable.pipe(tap(() => this.loadTableData())).subscribe();
    }
  }

  // method to do client side search
  searchData(list) {
    this.commissionDashboardList.miDataSource.reloadData(list);
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
    // set value if headerSelCompany contains value 'All' then pass ''  other wise provide selected value;
    //const selectedCompnay = (this.appData.headerSelCompany === 'All') ? '' : this.appData.headerSelCompany;
    // Append sorting and pagination parameter in request.
    this.commissionDashboardList.requestPostData.SortType = this.sort.direction;
    this.commissionDashboardList.requestPostData.SortBy = this.sort.active;
    this.commissionDashboardList.requestPostData.PageIndex = this.paginator.pageIndex;
    this.commissionDashboardList.requestPostData.PageSize = this.paginator.pageSize;
    this.commissionDashboardList.miDataSource.loadData(this.commissionDashboardList.requestPostData, this.commissionDashboardList.url,
      this.commissionDashboardList.cachedList);
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  // ------------------------------------------------- event emitters for passing data to parent control-----------------------------------
  CheckBoxClicked(obj) {
    this.OnCheckBoxClick.emit({ data: obj })
  }
  SelectAllCheckBox() {
    this.SelectAllCheckBoxes.emit({});
  }
  menuItemClicked(nameOfItemClicked, obj, event?: any, events?: any) {
    this.onMenuItemClick.emit({ name: nameOfItemClicked, data: obj, event: event, events: events });
  }
  onchangedClick(nameOfItemClicked, obj) {
    this.onchangeClick.emit({ name: nameOfItemClicked, data: obj });
  }
  onDataLoaded() {
    if (this.commissionDashboardList.miDataSource.tableData) {
      this.onAfterDataLoaded.emit({ response: this.commissionDashboardList.miDataSource.getResponse });
      this.AfterLoadingData.emit({ data: this.commissionDashboardList })
    }
  }
  // ###########################################################################################################################

  onPaginateChange(event) {
    this.onPageChange.emit({
      'index': event['previousPageIndex'],
      'nextIndex': event['pageIndex'],
      'pageSize': this.commissionDashboardList.requestPostData.PageSize,
      'newPageSize': event['pageSize'],
      'data': this.commissionDashboardList.miDataSource.tableData/*.filter(x=>x["IsConnected"] == true)*/
    });
  }

  resetPaging() {
    this.paginator.pageIndex = this.commissionDashboardList.initialPageIndex;
    this.paginator.pageSize = 10;
    this.sort.direction = this.commissionDashboardList.initialSortOrder;
    this.sort.active = this.commissionDashboardList.initialSortBy;

  }

  isObject(val) {
    if (val == null) {
      return false;
    } else {
      return typeof val === 'object';
    }
  }

}
