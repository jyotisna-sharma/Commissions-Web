import { CommonMethodsService } from './../../_services/common-methods.service';
import { Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { merge } from 'rxjs'
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { Router, ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { TableDataSource } from 'src/app/_services/table.datasource';
import { CompManagerService } from '../../comp-manager/comp-manager.service';
import { CompManagerURLService } from '../../comp-manager/comp-manager-url.service';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-comp-manager-list',
  templateUrl: './comp-manager-list.component.html',
  styleUrls: ['./comp-manager-list.component.scss'],
})
export class CompManagerListComponent implements OnInit, AfterViewInit {
  @Output() onMenuItemClick = new EventEmitter<object>();
  @Output() OnCheckBoxClick = new EventEmitter<object>();
  @Output() SelectAllCheckBoxes = new EventEmitter<object>();
  @Output() OnSelectionChange = new EventEmitter<object>();
  @Output() onPageChange = new EventEmitter<object>();
  @Output() onSortChange = new EventEmitter<object>();
  @Output() onAfterDataLoaded = new EventEmitter<object>(); // this can we emit for getting response when from loaddata
  @Output() AfterLoadingData = new EventEmitter<object>();
  @Output() OnDataSorting = new EventEmitter<object>();
  @Input() isValidationShown: any;
  @Input() isListRefresh: Subject<boolean> = new Subject();
  @Input() isSortingRefresh: Subject<boolean> = new Subject();

  @Input() isaccordionPanelShow: any;
  @Input() CompManagerList: MiProperties;
  @Input() accordionPanelList: MiProperties = new MiProperties();
  @Input() selectedRow: any;
  @Input() isFieldSelected: any;
  @Input() isButtonDisabled: any;
  // set view child for paginator.
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('table', { static: true }) table: ElementRef;
  // Default table parameters
  // positionOptions: TooltipPosition[] = ['above'];
  // noRecordFound = CONSTANTS.noRecordFound;
  //GetListData: any;
  // position = new FormControl(this.positionOptions[0]);
  // lstMapped: any[][];
  // getinputValue: any;
  length = 100;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  dataObservable: Observable<any>;
  selectedRowIndex: any;
  datafound: boolean;
  ParentTab: any;
  minimumpagesize: any;
  selectionSuppModel = new SelectionModel<any>(false, []);
  isExpansionDetailRow = (i: number, row: Object) => {
    return row.hasOwnProperty('detailRow');
  }
  constructor(
    public appData: AppLevelDataService,
    public router: Router,
    public compMangrSvc: CompManagerService,
    public compManagerUrl: CompManagerURLService,
    public commonMethods: CommonMethodsService,
    public activateroute: ActivatedRoute,
    //private ref: ChangeDetectorRef
  ) {
  }
  ngOnInit() {
    // this.getselect = 'PolicyId';
    this.minimumpagesize = 11;
    // document.getElementById
    this.ParentTab = this.activateroute.snapshot.params['ParentTab'];
    this.datafound = false;
    this.paginator.pageSize = this.CompManagerList.pageSize
    this.paginator.pageIndex = this.CompManagerList.initialPageIndex;
    this.sort.direction = this.CompManagerList.initialSortOrder;
    this.sort.active = this.CompManagerList.initialSortBy;
    if (this.paginator.pageSize === 0 && this.paginator.pageIndex === 0) {
      this.paginator.pageSize = 10;
      this.paginator.pageIndex = 0;
    }
    // Handler to refresh the listing
    this.CompManagerList.refreshHandler.subscribe(needRefresh => {
      if (needRefresh) {
        this.loadTableData();
        // Following is to set the sort state of list as specified after refresh
        this.sort._stateChanges.next();
      }
    })
    // handler to reset paging , if required
    if (this.CompManagerList.resetPagingHandler) {
      this.CompManagerList.resetPagingHandler.subscribe(needPageReset => {
        if (needPageReset) {
          this.resetPaging();
        }
      })
    }
    // Handler to emit - data loading is done
    this.CompManagerList.miDataSource.loadingSubject.subscribe(isLoadingDone => {
      // 
      if (!isLoadingDone) {
        this.onDataLoaded();
      }
    })
    this.loadTableData();
  }
  ngAfterViewInit() {
    if (this.CompManagerList.clientSideSearch) {
      this.CompManagerList.clientSideSearch.subscribe(doSearch => {
        if (doSearch) {
          this.CompManagerList.miDataSource.reloadData(this.CompManagerList.cachedList);
        }
      });
    }
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = this.CompManagerList.initialPageIndex;
      this.onSortChange.emit(event);
      if (this.CompManagerList.isClientSideList === true) {
        let type = 'string';
        if (this.CompManagerList.columnDataTypes) {
          for (let i = 0; i < this.CompManagerList.columnDataTypes.length; i++) {
            if (this.CompManagerList.columnDataTypes[i][0] === this.sort.active) {
              type = this.CompManagerList.columnDataTypes[i][1];
              break;
            }
          }
        }
        this.CompManagerList.miDataSource.reloadData
          (this.commonMethods.sortArrayOfObjects(this.CompManagerList.miDataSource.tableData, this.sort.active, this.sort.direction, type));
      }
    });
    if (this.CompManagerList.isClientSideList === false) {
      this.dataObservable = merge(this.sort.sortChange, this.paginator.page);
      this.dataObservable.pipe(tap(() => this.loadTableData())).subscribe(result => {
      }
      );
    }
    this.isListRefresh.subscribe(result => {
      // 
     // this.table.nativeElement.scrollIntoView();
      this.onDataLoaded();
    });

    this.isSortingRefresh.subscribe(result => {
      this.sort.direction = '';
      this.sort.active = '';
      this.onDataLoaded();
    });
  }

  OnChangeRadioButton = ($event?: any, rowData?: any) => {
    if ($event) {
      this.selectionSuppModel.toggle(rowData);
      this.OnSelectionChange.emit({ data: rowData });
    } else {
      return null;
    }
  }
  public loadTableData() {
    // set value if headerSelCompany contains value 'All' then pass ''  other wise provide selected value;
    const selectedCompnay = (this.appData.headerSelCompany === 'All') ? '' : this.appData.headerSelCompany;
    // Append sorting and pagination parameter in request.
    this.CompManagerList.requestPostData.SortType = this.sort.direction;
    this.CompManagerList.requestPostData.SortBy = this.sort.active;
    this.CompManagerList.requestPostData.PageIndex = this.paginator.pageIndex;
    this.CompManagerList.requestPostData.PageSize = this.paginator.pageSize;
    this.CompManagerList.miDataSource.loadData(this.CompManagerList.requestPostData, this.CompManagerList.url,
      this.CompManagerList.cachedList);
  }
  // setPageSizeOptions(setPageSizeOptionsInput: string) {
  //   this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  // }
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
  onDataLoaded() {
    if (this.CompManagerList.miDataSource.tableData) {
      this.selectedRowIndex = this.CompManagerList.miDataSource.tableData[0];
      // 
      this.selectionSuppModel.select(this.CompManagerList.miDataSource.tableData[0]);
      this.onAfterDataLoaded.emit({ response: this.CompManagerList.miDataSource.getResponse });
      this.AfterLoadingData.emit({ data: this.CompManagerList });
    }
  }
  SortingOnList() {
    this.OnDataSorting.emit({ data: this.CompManagerList });
  }
  onPaginateChange(event) {
    this.onPageChange.emit({
      'index': event['previousPageIndex'],
      'nextIndex': event['pageIndex'],
      'pageSize': this.CompManagerList.requestPostData.PageSize,
      'newPageSize': event['pageSize'],
      'data': this.CompManagerList.miDataSource.tableData/*.filter(x=>x["IsConnected"] == true)*/
    });
    if(this.table && this.table.nativeElement){
      this.table.nativeElement.scrollIntoView();
    }
  }
  resetPaging() {
    this.paginator.pageIndex = this.CompManagerList.initialPageIndex;
    this.paginator.pageSize = 10;
    this.sort.direction = this.CompManagerList.initialSortOrder;
    this.sort.active = this.CompManagerList.initialSortBy;
  }
  isObject(val) {
    if (val == null) {
      return false;
    } else {
      return typeof val === 'object';
    }
  }
}
