import { Component, OnInit, ViewChild, Input, AfterViewInit, Output, QueryList, EventEmitter, ElementRef, OnChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { merge, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { Router, ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
import { TableDataSource } from '../../_services/table.datasource';
import { CompManagerService } from '../../comp-manager/comp-manager.service';
import { CompManagerURLService } from '../../comp-manager/comp-manager-url.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonMethodsService } from '../../_services/common-methods.service';
import { DataEntryUnitService } from '../data-entry-unit.service';
@Component({
  selector: 'app-batch-statement-list',
  templateUrl: './batch-statement-list.component.html',
  styleUrls: ['./batch-statement-list.component.css']
})
export class BatchStatementListComponent implements OnInit, AfterViewInit, OnChanges {

  @Output() OnSelectionChange: any = new EventEmitter<object>();
  @Output() OnPageDetailsChange: any = new EventEmitter<object>();
  @Output() OnDivScrolling: any = new EventEmitter<object>();
  @Input() batchStatementList: MiProperties;
  @Input() selectedRow: any = 0;
  @Input() isListRefresh: Subject<boolean> = new Subject<any>();
  @Input() isPageReset: Subject<boolean> = new Subject<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('matTable', { read: ElementRef }) matTableRef: ElementRef;
  @Input() matTabIndex: Number = 0;
  @ViewChild('divMatTable', { read: ElementRef }) divMatTableRef: ElementRef;
  @Input() onFixedDivScroll: any = new BehaviorSubject<any>({});
  pageSizeOptions: number[] = [10, 400, 600, 800, 1000];
  @Input() isLoaderToHide: boolean = false;
  // length: any = 100;

  lastIndex: Number = 0;
  @Input() isFirstRowSelected: Boolean = false;
  dataObservable: Observable<any>;
  selectedRowIndex: any;

  minimumpagesize: any = 10;
  selectionSuppModel: any = new SelectionModel<any>(false, []);
  constructor(
    public appData: AppLevelDataService,
    public router: Router,
    public activateroute: ActivatedRoute,
    public commonMethodService: CommonMethodsService,
    public dataEntryUnitSvc: DataEntryUnitService
  ) {

  }

  ngOnInit(): void {
    // this.minimumpagesize = 11;
    // this.ParentTab = this.activateroute.snapshot.params['ParentTab'];
    // this.datafound = false;
    this.paginator.pageSize = this.batchStatementList['pageSize'];
    this.paginator.pageIndex = this.batchStatementList.initialPageIndex;
    this.sort.direction = this.batchStatementList.initialSortOrder;
    this.sort.active = this.batchStatementList.initialSortBy;
    if (this.paginator.pageSize === 0 && this.paginator.pageIndex === 0) {
      this.paginator.pageSize = this.pageSizeOptions[0];
      this.paginator.pageIndex = 0;

    }
    // Handler to refresh the listing
    this.batchStatementList.refreshHandler.subscribe(needRefresh => {

      if (needRefresh) {
        this.loadTableData();
        this.sort._stateChanges.next();
      }
    });
    // Handler to emit - data loading is done
    this.batchStatementList.miDataSource.loadingSubject.subscribe(isLoadingDone => {
      if (!isLoadingDone) {
        this.onDataLoaded();
      }
    });
    this.loadTableData();
  }
  ngAfterViewInit(): void {
    this.onFixedDivScroll.subscribe(response => {
      if (this.divMatTableRef) {
        this.divMatTableRef.nativeElement.scrollTop = response;
      }
    });
    this.isListRefresh.subscribe(isLoadingDone => {

      if (isLoadingDone) {
        this.onDataLoaded();
      }
    });
    // this.OnClientSideSorting();
    if (this.batchStatementList.isClientSideListRefresh) {

      this.batchStatementList.isClientSideListRefresh.subscribe(result => {

        if (result) {
          this.batchStatementList.miDataSource.reloadData(this.batchStatementList.cachedList, this.batchStatementList.cachedListPageLength);
        }
      });
    }

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = this.batchStatementList.initialPageIndex;

      // this.onSortChange.emit(event);
      if (this.batchStatementList.isClientSideList === true) {

        // get column type
        let type = 'string';
        if (this.batchStatementList.columnDataTypes) {
          for (var i = 0; i < this.batchStatementList.columnDataTypes.length; i++) {
            if (this.batchStatementList.columnDataTypes[i][0] === this.sort.active) {
              type = this.batchStatementList.columnDataTypes[i][1];
              break;
            }
          }
        }
        this.batchStatementList.miDataSource.reloadData
          (this.commonMethodService.sortArrayOfObjects(this.batchStatementList.miDataSource.tableData,
            this.sort.active, this.sort.direction, type));
      }
    });
    if (this.batchStatementList.isClientSideList === false) {

      this.dataEntryUnitSvc.paymentPageDetails = this.OnGettingPageDetails('');
      this.OnPageDetailsChange.emit({ data: '' });
      this.dataObservable = merge(this.sort.sortChange, this.paginator.page);
      this.dataObservable.pipe(tap(() => this.loadTableData())).subscribe();
    }
    if (this.batchStatementList.resetPagingHandler) {
      this.batchStatementList.resetPagingHandler.subscribe(needPageReset => {
        if (needPageReset) {
          this.ResetPaging();
        }
      });
    }
    this.isPageReset.subscribe(result => {
      if (result) {
        this.paginator.pageIndex = this.batchStatementList.initialPageIndex;
      }
    });

  }
  GetClassName(rowDetails: any): Boolean {

    const value = rowDetails.hasOwnProperty('isSuccess');
    if (value) {

      return rowDetails['isSuccess'] ? false : true;
    }

  }
  OnClientSideSorting(): void {
    this.sort.sortChange.subscribe(() => {
      // 
      this.paginator.pageIndex = this.batchStatementList.initialPageIndex;
      // this.onSortChange.emit(event);
      if (this.batchStatementList.isClientSideList === true) {
        // get column type
        let type = 'string';
        if (this.batchStatementList.columnDataTypes) {

          for (var i = 0; i < this.batchStatementList.columnDataTypes.length; i++) {

            if (this.batchStatementList.columnDataTypes[i][0] === this.sort.active) {

              type = this.batchStatementList.columnDataTypes[i][1];
              break;
            }
          }
        }
        this.batchStatementList.miDataSource.reloadData
          (this.commonMethodService.sortArrayOfObjects(this.batchStatementList.miDataSource.tableData,
            this.sort.active, this.sort.direction, type));
      }
    });
  }
  ngOnChanges(): void {
    if (this.selectedRow || this.selectedRow === 0) {
      this.onDataLoaded();
    }
    // if (this.scrollingBatchCoordinate) {
    //   debugger;
    //   this.matTableRef.nativeElement.scrollTop = this.scrollingBatchCoordinate;
    // }

  }

  public loadTableData(): void {
    this.batchStatementList.requestPostData.SortType = this.sort.direction;
    this.batchStatementList.requestPostData.SortBy = this.sort.active;
    this.batchStatementList.requestPostData.PageIndex = this.paginator.pageIndex;
    this.batchStatementList.requestPostData.PageSize = this.paginator.pageSize;
    this.batchStatementList.miDataSource.loadData(this.batchStatementList.requestPostData, this.batchStatementList.url,
      this.batchStatementList.cachedList);
  }
  // ------------------------------------------------- event emitters for passing data to parent control-----------------------------------
  onDataLoaded(): void {
    if (this.batchStatementList.miDataSource.tableData) {
      if (this.selectedRow == -1) {
        this.selectionSuppModel.select([]);
      } else {

        const rowIndex = this.selectedRow;
        this.selectionSuppModel.select(this.batchStatementList.miDataSource.tableData[this.selectedRow]);
        this.OnSelectionChange.emit({ data: this.batchStatementList.miDataSource.tableData[this.selectedRow], index: rowIndex });
      }

    }
  }
  OnRowSelectionChange = (index: any, rowData?: any, actionName?: any) => {
    if (rowData && this.selectedRow !== index) {

      this.selectionSuppModel.toggle(rowData);
      this.OnSelectionChange.emit({ data: rowData, index: index, actionName: actionName });
    }
  }
  OnPaginateChange(event: any): void {
    this.matTableRef.nativeElement.scrollIntoView();
    this.dataEntryUnitSvc.paymentPageDetails = this.OnGettingPageDetails(event);
    this.OnPageDetailsChange.emit({ data: event });
  }
  ResetPaging(): void {
    this.paginator.pageIndex = this.batchStatementList.initialPageIndex;
    this.paginator.pageSize = this.pageSizeOptions[0];
    this.sort.direction = this.batchStatementList.initialSortOrder;
    this.sort.active = this.batchStatementList.initialSortBy;

  }
  OnScrollingIngrid(events: any): void {
    console.log(events);
  }
  OnGettingPageDetails(event: any): any {
    const data = {
      'index': event ? event['previousPageIndex'] : this.paginator ? this.paginator.pageIndex : 0,
      'nextIndex': event ? event['pageIndex'] : this.paginator ? this.paginator.pageIndex : 0,
      'newPageSize': event ? event['pageSize'] : this.paginator ? this.paginator.pageSize : this.pageSizeOptions[0],
      'pageSize': this.paginator ? this.paginator.pageSize : this.pageSizeOptions[0]
      // 'data': this.batchStatementList.miDataSource.tableData/*.filter(x=>x["IsConnected"] == true)*/
    }
    return data;

  }
  OnScrolling(event: any): void {
    this.OnDivScrolling.emit({ scrollingCoordinate: event.currentTarget.scrollTop });
  }

}
