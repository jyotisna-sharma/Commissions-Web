import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { ReportManagerURLService } from './report-manager-url.service';
const headersOption = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class ReportManagerService {

  constructor(
    private http: HttpClient,
    private erroHttp: ErrorHandlerService,
    public reportManagerURLSvc: ReportManagerURLService
  ) { }
  public getTableData(postData: any, url: any): Observable<any> {
    //alert("urlAA="+url);
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public printReport(postData: any): Observable<any> {
    const url = this.reportManagerURLSvc.payeeStatementReport.PrintReport;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public SaveReportDetails(postData: any, url: any): Observable<any> {
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public SetBatchMarkedPaid(postData: any): Observable<any> {
    const url = this.reportManagerURLSvc.payeeStatementReport.SetBatchMarkedPaid;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public SendECRReportEmail(postData: any): Observable<any> {
    const url = this.reportManagerURLSvc.payeeStatementReport.SetBatchMarkedPaid;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
}
