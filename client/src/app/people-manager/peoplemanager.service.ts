import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { AddEditModel } from './add-edit-agent/addEdit.model';
const headersOption = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };
import { PeopleManagerAPIUrlService } from './people-manager-url.service';
@Injectable({
  providedIn: 'root'
})
export class PeoplemanagerService {

  constructor(
    private http: HttpClient,
    private erroHttp: ErrorHandlerService,
    public peopleUrlService: PeopleManagerAPIUrlService
  ) { }

  public getagentdetails(postdata: any): Observable<any> {
    const url = this.peopleUrlService.PeoplemanagerAPIRoute.GetAgentDetails;
    return (this.http.post<any>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public getTableData(postData: any, url: any): Observable<any> {
    //const headerOption = { 'headers': new HttpHeaders({ 'Content-type': 'application/json' , 'AuthToken': ''}) };
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public addUpdateAgentdetails(postdata: any): Observable<any> {
    const url = this.peopleUrlService.PeoplemanagerAPIRoute.AddUpdateAgentDetailsAPIRoute;
    return (this.http.post<AddEditModel[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public houseAccountUpdate(postadata: any): Observable<any> {
    const url = this.peopleUrlService.PeoplemanagerAPIRoute.HouseAccountUpdateAPIroute;
    return (this.http.post<any[]>(url, postadata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public addUpdateLinkedUserList(postadata: any): Observable<any> {
    const url = this.peopleUrlService.PeoplemanagerAPIRoute.LinkedUserListUpdate;
    return (this.http.post<any[]>(url, postadata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public addUpdateAgentSettingDetails(postadata: any): Observable<any> {
     const url = this.peopleUrlService.PeoplemanagerAPIRoute.UpdateAgentSettingDetails;
     return (this.http.post<any[]>(url, postadata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public getHouseAccountDetails(postadata: any): Observable<any> {
    const url = this.peopleUrlService.PeoplemanagerAPIRoute.GetHouseAccountDetails;
    return (this.http.post<any[]>(url, { 'userCredentialId': postadata }, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public DeleteAgent(postadata: any): Observable<any> {
    const url = this.peopleUrlService.PeoplemanagerAPIRoute.DeleteAgent;
    return (this.http.post<any[]>(url, postadata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public getSettingDetails(postdata: any): Observable<any> {
    const url = this.peopleUrlService.PeoplemanagerAPIRoute.getagentdetails;
    return (this.http.post<AddEditModel[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public getUsercredentialIdOfUser(postdata: any): Observable<any> {
    const url = this.peopleUrlService.PeoplemanagerAPIRoute.GetUserCredentialId;
    return (this.http.post<AddEditModel[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
  public ChangeAdminStatus(postdata: any): Observable<any> {
    const url = this.peopleUrlService.PeoplemanagerAPIRoute.UpdateAdminStatus;
    return (this.http.post<AddEditModel[]>(url, postdata, headersOption)).pipe(catchError(this.erroHttp.handleError));
  }
}
