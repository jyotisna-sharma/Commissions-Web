import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { ConfigAPIUrlService } from './configAPIURLService'
const headersOption = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class ConfigManagerService {
  constructor(
    private http: HttpClient,
    private erroHttp: ErrorHandlerService,
    public configUrlService: ConfigAPIUrlService
  ) { }

  public getTableData(postData: any, url: any): Observable<any> {
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }

  public AddUpdateCarrierDetails(postData: any): Observable<any> {
    const url = this.configUrlService.CarrierAPIRoute.AddUpdateCarrier;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }

  public DeleteCarrier(postData: any): Observable<any> {
    const url = this.configUrlService.CarrierAPIRoute.DeleteCarrier;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }

  public saveDeletePayor(postData: any): Observable<any> {
    const url = this.configUrlService.ConfigAPIRoute.SaveDeletePayor;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }

  public DeletePayorContact(postData: any): Observable<any> {
    const url = this.configUrlService.ConfigAPIRoute.DeletePayorContact;
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)))
  }
  public AddUpdatePayorContactDetails(postdata: any): Observable<any> {
    const url = this.configUrlService.ConfigAPIRoute.AddUpdatePayorContact;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public GetPayorContactDetails(postdata: any): Observable<any> {
    const url = this.configUrlService.ConfigAPIRoute.GetayorContactDetails;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public AddUpdateCoverageType(postdata: any): Observable<any> {
    const url = this.configUrlService.productAPIRoute.AddUpdateCoverageType;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public AddUpdateCoverage(postdata: any): Observable<any> {
    const url = this.configUrlService.productAPIRoute.AddUpdateCoverage;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public AddUpdateCompType(postdata: any): Observable<any> {
    const url = this.configUrlService.CompTypeAPIRoute.AddUpdateCompTypeDetails;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public DeleteCompType(postdata: any): Observable<any> {
    const url = this.configUrlService.CompTypeAPIRoute.DeleteCompType;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public DeleteProductType(postdata: any): Observable<any> {
    const url = this.configUrlService.productAPIRoute.DeleteProductType;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public DeleteProducts(postdata: any): Observable<any> {
    const url = this.configUrlService.productAPIRoute.DeleteCoverages;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public SaveFollowUpSetting(postdata: any): Observable<any> {
    const url = this.configUrlService.FollowUpSettingAPIRoute.UpdateFollowUpSetting;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public GetFollowUpSettingDetails(postdata: any): Observable<any> {
    const url = this.configUrlService.FollowUpSettingAPIRoute.GetFollowUpSettingDetails;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
}
