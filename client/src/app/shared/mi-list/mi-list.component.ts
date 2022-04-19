import { Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { Observable, merge, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MiProperties } from './mi-properties';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { Router, ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { TableDataSource } from '../../_services/table.datasource';


@Component({
  selector: 'app-mi-list',
  templateUrl: './mi-list.component.html',
  styleUrls: ['./mi-list.component.scss']
})
export class MiListComponent implements OnInit, AfterViewInit {
  // displays message if no record is found
  noRecordFound = CONSTANTS.noRecordFound;
  IsHouseAccount: boolean;
  GetListData: any;
  // Set input/output parameter for read
  @Input() MiListProperties: MiProperties;
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

  @Output() onPageChange = new EventEmitter<object>();
  @Output() onSortChange = new EventEmitter<object>();
  @Output() onAfterDataLoaded = new EventEmitter<object>(); // this can we emit for getting response when from loaddata
  @Output() AfterLoadingData = new EventEmitter<object>();
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
    this.paginator.pageSize = this.MiListProperties.pageSize;
    this.paginator.pageIndex = this.MiListProperties.initialPageIndex;
    this.sort.direction = this.MiListProperties.initialSortOrder;
    this.sort.active = this.MiListProperties.initialSortBy;

    if (this.paginator.pageSize === 0 && this.paginator.pageIndex === 0) {
      this.paginator.pageSize = 10;
      this.paginator.pageIndex = 0;
    }

    // Handler to refresh the listing
    this.MiListProperties.refreshHandler.subscribe(needRefresh => {

      if (needRefresh) {
        this.loadTableData();
        // Following is to set the sort state of list as specified after refresh
        this.sort._stateChanges.next();
      }
    })

    // handler to reset paging , if required
    if (this.MiListProperties.resetPagingHandler) {
      this.MiListProperties.resetPagingHandler.subscribe(needPageReset => {
        if (needPageReset) {
          this.resetPaging();
        }
      })
    }
    // Handler to emit - data loading is done
    this.MiListProperties.miDataSource.loadingSubject.subscribe(isLoadingDone => {
      if (!isLoadingDone) {
        this.onDataLoaded();
      }
    })

    this.loadTableData();
  }

  ngAfterViewInit() {

    if (this.MiListProperties.clientSideSearch) {
      this.MiListProperties.clientSideSearch.subscribe(doSearch => {
        if (doSearch) {
          this.MiListProperties.miDataSource.reloadData(this.MiListProperties.cachedList);
        }
      });
    }
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = this.MiListProperties.initialPageIndex;
       this.onSortChange.emit({result : 'true'});
      if (this.MiListProperties.isClientSideList === true) {

        // get column type
        let type = 'string';
        if (this.MiListProperties.columnDataTypes) {
          for (var i = 0; i < this.MiListProperties.columnDataTypes.length; i++) {
            if (this.MiListProperties.columnDataTypes[i][0] === this.sort.active) {
              type = this.MiListProperties.columnDataTypes[i][1];
              break;
            }
          }
        }

        this.MiListProperties.miDataSource.reloadData
          (this.sortArrayOfObjects(this.MiListProperties.miDataSource.tableData, this.sort.active, this.sort.direction, type));
      }
    });
    if (this.MiListProperties.isClientSideList === false) {
      this.dataObservable = merge(this.sort.sortChange, this.paginator.page);
      this.dataObservable.pipe(tap(() => this.loadTableData())).subscribe();
    }
  }

  // method to do client side search
  searchData(list) {
    this.MiListProperties.miDataSource.reloadData(list);
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

        let firstElemnet = a[key].replace(/,/g, '')
        firstElemnet = (firstElemnet ? Number(firstElemnet.replace('$', '')) : firstElemnet);
        let secondElement = b[key].replace(/,/g, '')
        secondElement = (secondElement ? Number(secondElement.replace('$', '')) : secondElement);

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

  // Load request paramter for pagination and sorting and reload the table
  public loadTableData() {
    // set value if headerSelCompany contains value 'All' then pass ''  other wise provide selected value;
   // const selectedCompnay = (this.appData.headerSelCompany === 'All') ? '' : this.appData.headerSelCompany;
    // Append sorting and pagination parameter in request.
    this.MiListProperties.requestPostData.SortType = this.sort.direction;
    this.MiListProperties.requestPostData.SortBy = this.sort.active;
    this.MiListProperties.requestPostData.PageIndex = this.paginator.pageIndex;
    this.MiListProperties.requestPostData.PageSize = this.paginator.pageSize;
    this.MiListProperties.miDataSource.loadData(this.MiListProperties.requestPostData, this.MiListProperties.url,
      this.MiListProperties.cachedList);
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  // ------------------------------------------------- event emitters for passing data to parent control-----------------------------------
  CheckBoxClicked(obj, events?: any) {
    this.OnCheckBoxClick.emit({ data: obj, event: events })
  }
  SelectAllCheckBox() {
    this.SelectAllCheckBoxes.emit({});
  }
  menuItemClicked(nameOfItemClicked, obj, event, events?: any) {
    this.onMenuItemClick.emit({ name: nameOfItemClicked, data: obj, event: event, events: events });
  }

  onchangedClick(nameOfItemClicked, obj) {
    this.onchangeClick.emit({ name: nameOfItemClicked, data: obj });
  }
  onDataLoaded() {
    if (this.MiListProperties.miDataSource.tableData) {
      this.onAfterDataLoaded.emit({ response: this.MiListProperties.miDataSource.getResponse });
      this.AfterLoadingData.emit({ data: this.MiListProperties })
    }
  }
  // ###########################################################################################################################

  onPaginateChange(event) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.onPageChange.emit({
      'index': event['previousPageIndex'],
      'nextIndex': event['pageIndex'],
      'pageSize': this.MiListProperties.requestPostData.PageSize,
      'newPageSize': event['pageSize'],
      'data': this.MiListProperties.miDataSource.tableData/*.filter(x=>x["IsConnected"] == true)*/
    });
  }

  resetPaging() {
    this.paginator.pageIndex = this.MiListProperties.initialPageIndex;
    this.paginator.pageSize = 10;
    this.sort.direction = this.MiListProperties.initialSortOrder;
    this.sort.active = this.MiListProperties.initialSortBy;

  }

  isObject(val) {
    if (val == null) {
      return false;
    } else {
      return typeof val === 'object';
    }
  }
}
