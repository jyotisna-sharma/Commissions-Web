import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { merge, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { Router, ActivatedRoute } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';
@Component({
  selector: 'app-import-tool-statment-list',
  templateUrl: './import-tool-statment-list.component.html',
  styleUrls: ['./import-tool-statment-list.component.scss']
})
export class ImportToolStatmentListComponent implements OnInit, AfterViewInit {
  @Input() ImportToolStatmentList: MiProperties;
  @Output() OnMenuItemClick: any = new EventEmitter<object>();
  @Input() matSelectList: [];
  length: any = 100;
  pageSizeOptions: Number[] = [10, 25, 50, 100];
  dataObservable: Observable<any>;
  minimumpagesize: Number = 11;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    public appData: AppLevelDataService,
    public router: Router,
    public activateroute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paginator.pageSize = this.ImportToolStatmentList.pageSize;
    this.paginator.pageIndex = this.ImportToolStatmentList.initialPageIndex;
    this.sort.direction = this.ImportToolStatmentList.initialSortOrder;
    this.sort.active = this.ImportToolStatmentList.initialSortBy;
    if (this.paginator.pageSize === 0 && this.paginator.pageIndex === 0) {
      this.paginator.pageSize = 10;
      this.paginator.pageIndex = 0;
    }

    // Handler to refresh the listing
    this.ImportToolStatmentList.refreshHandler.subscribe(needRefresh => {
      if (needRefresh) {
        this.loadTableData();
        this.sort._stateChanges.next();
      }
    });

    this.loadTableData();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = this.ImportToolStatmentList.initialPageIndex;
    });
    if (this.ImportToolStatmentList.isClientSideList === false) {
      this.dataObservable = merge(this.sort.sortChange, this.paginator.page);
      this.dataObservable.pipe(tap(() => this.loadTableData())).subscribe();
    }
  }

  public loadTableData(): void {
    // Append sorting and pagination parameter in request.
    this.ImportToolStatmentList.requestPostData.SortType = this.sort.direction;
    this.ImportToolStatmentList.requestPostData.SortBy = this.sort.active;
    this.ImportToolStatmentList.requestPostData.PageIndex = this.paginator.pageIndex;
    this.ImportToolStatmentList.requestPostData.PageSize = this.paginator.pageSize;
    this.ImportToolStatmentList.miDataSource.loadData(this.ImportToolStatmentList.requestPostData, this.ImportToolStatmentList.url,
      this.ImportToolStatmentList.cachedList);
  }

  isObject(val: any): boolean {
    if (!val) {
      return false;
    } else {
      return typeof val === 'object';
    }
  }

}
