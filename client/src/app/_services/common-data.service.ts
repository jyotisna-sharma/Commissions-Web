import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { CommonDataUrlService } from './common-data-url.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const headerOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})

export class CommonDataService {

  public value: any;
  constructor(
    private http: HttpClient,
    private erroHttp: ErrorHandlerService,
    public commonURL: CommonDataUrlService

  ) { }

  public getPayorsList(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetPayorsList;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }

  public getCarrierList(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetCarriers;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }

  public getProductsList(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetProducts;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getLicenseeList(): Observable<any> {
    const url = this.commonURL.DomainDataList.GetLicenseeList;
    const postData = '';
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getProductTypes(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetProductTypes;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getAllClientName(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetAllClientName;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getGlobalPayorCarriers(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetGlobalPayorCarriers;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }

  public getAccountExecByLicensee(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetAccExecByLicensee;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getListOfTermReason(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetTermReasonList;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getIncomingPaymentTypes(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetIncomingPayTypes;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getPrimaryAgent(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetPrimaryAgent;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getTableData(postData: any, url: any): Observable<any> {

    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportBatchFile(json: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json,
      {
        header: ['Batch', 'Statement', 'Payor', 'Carrier', 'Product', 'PolicyNumber',
          'Client', 'Premium', 'CommPercent', 'InvoiceDate', 'Units', 'Fee', 'SharePercent', 'TotalPayment', 'EnteredTime']
      });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, '');
  }

  public UploadFile(URL: any, formData: any) {

    // const url = this.commonURL.DomainDataList.UploadBatchPath;
    // const postData = {
    //   url: URL,
    //   file: formData
    // }
    // return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
    // // this.http.post(URL, formData).map((res:Response) => res.json()).subscribe(
    // //   //map the success function and alert the response
    // //    (success) => {
    // //            return 'success';
    // //   },
    // //   (error) => {return 'success';})

  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  public GetUploadBatchNumber(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.GetUploadBatchNumber
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public UpdateBatchFileName(postData: any): Observable<any> {
    const url = this.commonURL.DomainDataList.UpdateBatchFileName
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetPayorRegions(): Observable<any> {
    const url = this.commonURL.DomainDataList.GetPayorRegions
    return (this.http.post<any[]>(url, []).pipe(catchError(this.erroHttp.handleError)))
  }
  public RequestSendsToAPI(postData: any): Observable<any> {
    const url = '/api/CommonData/CommRequestSendsToAPI';
    return (this.http.post<any[]>(url, postData, headerOptions).pipe(catchError(this.erroHttp.handleError)))
  }
  // public getTableData(postData: any): Observable<any> {
  //   const url = '/api/CommonData/CommTableListRequestSends';
  //   return (this.http.post<any[]>(url, postData, headerOptions).pipe(catchError(this.erroHttp.handleError)))
  // }
}
