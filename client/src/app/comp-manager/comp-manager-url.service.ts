import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompManagerURLService {
  public BatchManager: any = {
    'GetBatchList': '/api/CompManager/getBatchList',
    'GetStatementList': '/api/CompManager/getStatementList',
    'SaveBatchNotes': '/api/CompManager/saveBatchNotes',
    'DeleteBatch': '/api/CompManager/batchDelete',
    'DeleteStatement': '/api/CompManager/deleteStatement',
    'GetBatchDataToExport': '/api/CompManager/getDataToExport',
    'GetInsuredPaymentData': '/api/CompManager/getInsuredPayment',
    'UpdateStatementDate': '/api/CompManager/updateStatementDate'
  }
  public LinkPolicies: any = {
    'GetPendingPoliciesList': 'api/CompManager/getPendingPoliciesList',
    'GetActivePoliciesList': '/api/CompManager/getActivePoliciesList',
    'ActivatePolicy': '/api/CompManager/activatePolicy',
    'GetPolicyPaymentData': '/api/CompManager/getLinkedPolicyPayments',
    'GetConditionsForLink': '/api/CompManager/getConditionsForLink',
    'DoLinkPolicy': '/api/CompManager/doLinkPolicy',
    'ScheduleMatches': '/api/CompManager/scheduleMatches',
    'IsMarkedPaid': '/api/CompManager/isMarkedPaid',
    'IsAgencyVersion': '/api/CompManager/getAgencyVersion',
    'ValidatePaymentsForLinking': '/api/CompManager/validatePaymentsForLinking'
  }

  constructor() { }
}
