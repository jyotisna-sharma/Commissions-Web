import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Rx';
import { TableDataService } from './table-data.service';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

export class TableDataSource implements DataSource<any> {
    public dataSubject: any = new BehaviorSubject<any[]>([]);
    public loadingSubject: any = new BehaviorSubject<boolean>(false);
    // public getResponseData = new BehaviorSubject<boolean>(false);
    public loading$: any = this.loadingSubject.asObservable();
    public pageLength: number;
    public tableData: any[];
    public footerData: any[];
    public getResponse: any;
    _filterChange: any = new BehaviorSubject<any>('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }
    constructor(private _tableDataService: TableDataService) {
    }

    // Reload data with a given list - mostly for client side serach/sort
    reloadData(data: any, pageLength?: any): void {
        
        this.tableData = data;
        this.pageLength = pageLength ? pageLength : data.length;
        this.dataSubject.next(this.tableData);
    }

    // Load data in table according to provided request parameters
    loadData(postData: any, url: any, cachedList: any, isClientSidePagination: Boolean = false): void {
        
        this.loadingSubject.next(true);
        this._tableDataService.getTableData(postData, url).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe((data) => {
            this.getResponse = data;

            //  this.getResponseData.next((true));
            this.pageLength = data['TotalLength'];
            this.footerData = data['footerData'];
            if (cachedList != null) {
                if (isClientSidePagination === true) {
                    this.tableData = this.ClientSidePagination(postData, cachedList);
                    this.pageLength = cachedList.length;
                } else {
                    this.tableData = cachedList;
                }
            } else {
                this.tableData = data['TotalRecords']
            }
            this.dataSubject.next(this.tableData);
        }, (error) => console.log(error)); // show error by console.
    }
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        const displayDataChanges = [
            this.dataSubject,
            this._filterChange,
        ];
        let that = this
        let test = Observable.merge(...displayDataChanges).map(() => {
            //
            const gettabledata = that.tableData || []
            return gettabledata.slice().filter((item: any) => {
                let searchStr = '';
                Object.keys(item).forEach(key => {
                    if (item[key]) {
                        searchStr += (item[key]).toString().toLowerCase();
                    }

                })

                return searchStr.indexOf(that.filter.toLowerCase()) !== -1;
            });
        });
        return test
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }

    ClientSidePagination(postData: any, tableData: any) {
        let list = [];
        let rowStart = (postData.PageSize === 0 && postData.PageIndex === 0) ? 0 : (postData.PageSize * (postData.PageIndex)) + 1;
        let rowEnd = (postData.PageSize === 0 && postData.PageIndex === 0) ? 0 : (postData.PageIndex + 1) * postData.PageSize;
        if (rowEnd > tableData.length) {
            rowEnd = tableData.length;
            rowStart = rowStart - 1;
            if (rowEnd <= postData.PageSize) {
                rowStart = 0;
            }
            for (let pagesize = rowStart; pagesize < rowEnd; pagesize++) {
                list.push(tableData[pagesize]);
            }
        } else if (tableData.length === 10) {
            list = tableData;
        } else {
            for (let pagesize = rowStart; pagesize <= rowEnd; pagesize++) {
                list.push(tableData[pagesize]);
            }
        }

        return list;
    }

}

