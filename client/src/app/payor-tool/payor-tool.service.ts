import { Observable } from 'rxjs/internal/Observable';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { Http } from '@angular/http';
import { catchError, switchMap } from 'rxjs/operators';
import { PayorToolUrlService } from './payor-tool-url.service';
const headerOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }

@Injectable({
  providedIn: 'root'
})
export class PayorToolService {

  constructor(
    public http: HttpClient,
    public erroHttp: ErrorHandlerService,
    public Urls: PayorToolUrlService

  ) { }
  public GetPayorTemplateList(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.TemplateList;
    return this.http.post<any>(url, postdata, headerOptions).pipe(catchError(this.erroHttp.handleError));
  }
  public GetFieldList(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.GetFieldList;
    return this.http.post<any[]>(url, postdata, headerOptions).pipe(catchError(this.erroHttp.handleError));
  }
  public AddPayorToolField(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.AddField;
    return this.http.post<any[]>(url, postdata, headerOptions).pipe(catchError(this.erroHttp.handleError));
  }
  public DeletePayorToolField(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.DeleteField;
    return this.http.post<any[]>(url, postdata, headerOptions).pipe(catchError(this.erroHttp.handleError));
  }
  public GetTemplateData(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.GetTemplateData;
    return this.http.post<any[]>(url, postdata, headerOptions).pipe(catchError(this.erroHttp.handleError));
  }
  public SavePayorToolData(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.SavePayorToolData;
    return this.http.post<any[]>(url, postdata, headerOptions).pipe(catchError(this.erroHttp.handleError));
  }



  public GetMaskFieldList(): Observable<any> {
    const url = this.Urls.PayorToolURL.GetMaskTypeFieldList;
    return (this.http.post<any[]>(url, headerOptions).pipe(catchError(this.erroHttp.handleError)))
  }

  public addTemplate(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.AddTemplate;
    return (this.http.post<any[]>(url, postdata, headerOptions)).pipe(catchError(this.erroHttp.handleError));
  }
  public getTableData(postData: any, url: any): Observable<any> {
    return (this.http.post<any[]>(url, postData, headerOptions).pipe(catchError(this.erroHttp.handleError)))
  }

  public DeleteTemplate(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.DeleteTemplateField;
    return this.http.post<any[]>(url, postdata, headerOptions).pipe(catchError(this.erroHttp.handleError));
  }

  public duplicateTemplate(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.DuplicateTemplate;
    return this.http.post<any[]>(url, postdata, headerOptions).pipe(catchError(this.erroHttp.handleError));
  }
  public getData(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        switchMap(response => this.readFile(response))
      );
  }

  private readFile(blob: Blob): Observable<string> {
    return Observable.create(obs => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result);
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(blob);
    });
  }
  public checkIfTemplateHasFields(postdata: any): Observable<any> {
    const url = this.Urls.PayorToolURL.IfPayorTemplateHasValue;
    return this.http.post<any[]>(url, postdata, headerOptions).pipe(catchError(this.erroHttp.handleError));
  }
  public FetchTestFormulaResult(postData: any): Observable<any> {
    const url = this.Urls.PayorToolURL.FetchTestFormulaResult;
    return (this.http.post<any[]>(url, postData, headerOptions).pipe(catchError(this.erroHttp.handleError)))
  }

  public RequestSendsToServer(postData: any, URL: any): Observable<any> {
    return (this.http.post<any[]>(URL, postData, headerOptions).pipe(catchError(this.erroHttp.handleError)))
  }

}   
