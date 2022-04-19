import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportManagerURLService {
  public payeeStatementReport: any = {
    'GetBatchesList': 'api/ReportManager/getReportBatchesDetail',
    'GetPayeeList': 'api/ReportManager/getPayeeList',
    'GetSegmentList': 'api/ReportManager/getSegmentList',
    'GetReportNameListing': 'api/ReportManager/getReportNameListing',
    'PrintReport': 'api/ReportManager/PrintReport',
    'SavePayeeStatementReport': 'api/ReportManager/savePayeeStatementReport',
    'SetBatchMarkedPaid': 'api/ReportManager/setBatchMarkedPaid'
  }
  public AuditReport: any = {
    'GetPayorList': '/api/ReportManager/getPayorsList',
    'SaveAuditReport': 'api/ReportManager/saveAuditStatementReport'
  }
  public ManagementReport: any = {
    'GetCarrierList': '/api/ReportManager/getCarrierList',
    'GetProductsList': '/api/ReportManager/getProductsList',
    'SaveManagementReport': '/api/ReportManager/saveManagementReport'
  }
  constructor() { }
}
