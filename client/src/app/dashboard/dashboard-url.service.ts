import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardUrlService {
  public DashBoardAPIRoute: any = {
    'GetTop20Agents': '/api/dashboard/GetTop20AgentList',
    'GetRevenueByLOC': '/api/dashboard/GetRevenueByLoc',
    'GetNewPolicyList': '/api/dashboard/GetNewPolicyList',
    'GetRenewalsList': '/api/dashboard/GetRenewalsList',
    'GetReceivableList': '/api/dashboard/GetReceivableList',
    'GetClientsList': '/api/dashboard/GetClientsList',
    'GetReportDetails': '/api/dashboard/GetReportDetails'
  };

  constructor() { }
}
