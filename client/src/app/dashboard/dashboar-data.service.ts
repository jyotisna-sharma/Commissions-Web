import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { catchError } from 'rxjs/operators';
const headersOption = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
@Injectable({
  providedIn: 'root'
})
export class DashboarDataService {

  constructor(
    private http: HttpClient,
    private erroHttp: ErrorHandlerService
  ) { }

  public GetAgentsClientCount(postData): Observable<any[]> {
    const url = '/api/dashboard/GetAgentsClientCount'
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)));
  }
  public DisplayDashboardData(): Observable<any[]> {
    const url = '/api/dashboard/displayDashboardData'
    const postData = '';
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)));
  }
  public GetRevenueData(postData): Observable<any[]> {
    const url = '/api/dashboard/GetRevenueData'
    return (this.http.post<any[]>(url, postData, headersOption).pipe(catchError(this.erroHttp.handleError)));
  }
  public GetClientsData(postData: any): Observable<any> {
    const url = '/api/dashboard/GetClientsList'
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
}
