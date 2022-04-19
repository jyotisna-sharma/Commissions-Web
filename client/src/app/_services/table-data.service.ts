import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class TableDataService {
  constructor() { }
  // Abstract method for get table data. We need to implement this method in respactive service pages to fetch table data.
  abstract getTableData(postData: any, url: any): Observable<any>;
}
