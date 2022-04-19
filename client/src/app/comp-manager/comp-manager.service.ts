import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { CompManagerURLService } from './comp-manager-url.service';
@Injectable({
  providedIn: 'root'
})
export class CompManagerService {
  constructor(
    private http: HttpClient,
    private erroHttp: ErrorHandlerService,
    public compManagerSvc: CompManagerURLService
  ) { }
  public getTableData(postData: any, url: any): Observable<any> {
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public SaveBatchNotes(postData: any): Observable<any> {
    const url = this.compManagerSvc.BatchManager.SaveBatchNotes;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public UpdateStatementDate(postData: any): Observable<any> {
    const url = this.compManagerSvc.BatchManager.UpdateStatementDate;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public DeleteBatch(postData: any): Observable<any> {
    const url = this.compManagerSvc.BatchManager.DeleteBatch;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public DeleteStatement(postData: any): Observable<any> {
    const url = this.compManagerSvc.BatchManager.DeleteStatement;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetBatchDataToExport(postData: any): Observable<any> {
    const url = this.compManagerSvc.BatchManager.GetBatchDataToExport;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public ActivatePolicy(postData: any): Observable<any> {
    const url = this.compManagerSvc.LinkPolicies.ActivatePolicy;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetPolicyPaymentEntries(postData: any): Observable<any> {
    const url = this.compManagerSvc.LinkPolicies.GetPolicyPaymentData;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public DoLinkPolicy(postData: any): Observable<any> {
    const url = this.compManagerSvc.LinkPolicies.DoLinkPolicy;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public IsAgencyVersion(postData: any): Observable<any> {
    const url = this.compManagerSvc.LinkPolicies.IsAgencyVersion;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public ScheduleMatches(postData: any): Observable<any> {
    const url = this.compManagerSvc.LinkPolicies.ScheduleMatches;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public IsMarkedPaid(postData: any): Observable<any> {
    const url = this.compManagerSvc.LinkPolicies.IsMarkedPaid;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public ValidatePaymentsForLinking(postData: any): Observable<any> {
    const url = this.compManagerSvc.LinkPolicies.ValidatePaymentsForLinking;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
}
