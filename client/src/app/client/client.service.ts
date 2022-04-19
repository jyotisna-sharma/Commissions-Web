import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { ClientAPIUrlService } from './ClientAPIURLService';
import { post } from 'selenium-webdriver/http';
const headersOption = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient,
    private erroHttp: ErrorHandlerService,
    public clientUrlService: ClientAPIUrlService
  ) { }
  public getTableData(postData: any, url: any): Observable<any> {
    return (this.http.post<any[]>(url, postData, headersOption).timeout(50000000).pipe(catchError(this.erroHttp.handleError)))
  }

  public addUpdateClientdetails(postdata: any): Observable<any> {
    const url = this.clientUrlService.ClientAPIRoute.addupdateClientDetails;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }

  public getClientDetails(postdata: any): Observable<any> {
    const url = this.clientUrlService.ClientAPIRoute.GetClientDetails;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }

  public deleteClient(postdata: any): Observable<any> {
    const url = this.clientUrlService.ClientAPIRoute.DeleteClientDetails;
    return (this.http.post<any[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
}
