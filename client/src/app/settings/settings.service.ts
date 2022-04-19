import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { post } from 'selenium-webdriver/http';
import { SettingsAPIURLService } from './settings-api-url.service';
const headersOption = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient,
    private erroHttp: ErrorHandlerService,
    public sttngURLSvc: SettingsAPIURLService

  ) { }
  public getTableData(postData: any, url: any): Observable<any> {
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public AddupdateCommissionSchedule(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.AddUpdateCommissionSchedule;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public AddupdateNamedSchedule(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.AddUpdateNamedSchedule;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public IsScheduleExist(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.IsScheduleExist;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public IsNamedScheduleExist(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.IsNamedScheduleExist;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetScheduleDetails(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.GettingCommScheduleSettings;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public DeleteSettings(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.DeleteCommScheduleSetting;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public SaveSettings(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.UpdateReportSettings;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  //add by me
  public GetProductsSegmentsForUpdate(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.GetProductsSegmentsForUpdate;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetSegmentsListing(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.GetSegmentsListing;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public saveDeleteSegment(postData: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.SaveDeleteSegment;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetSegmentsOnCoverageId(postdata: any): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.GetSegmentsOnCoverageId;
    return (this.http.post<any[]>(url, postdata).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetSegmentListForPolicies(): Observable<any> {
    const url = this.sttngURLSvc.SettingAPIRoutes.GetSegmentsOnCoverageId;
    return (this.http.post<any[]>(url, null).pipe(catchError(this.erroHttp.handleError)))
  }
}
