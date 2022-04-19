import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PolicyManagerUrlService {
  public PolicicyManagerListing: any = {
    'GetPoliciesListing': '/api/PolicyManager/getPoliciesListing',
    'GetAllClientName': '/api/PolicyManager/getAllClientName',
    'GetSelectedClientName': '/api/PolicyManager/getSelectedClientName',
    'GetSearchedClients': '/api/PolicyManager/getSearchedClientName',
    'GetClientName': '/api/PolicyManager/getClientName',
    'ImportPolicyDetails': '/api/PolicyManager/importPolicyDetails',
    'GetCachedList': '/api/PolicyManager/getcachedList',
    'ImportpolicyFileUpload': '/api/PolicyManager/importPolicyFileUpload',
    'GetAdvanceSearchPolicies': '/api/PolicyManager/getAdvanceSearchPolicies'
  }

  public PolicyDetails: any = {
    'GetPolicyDetails': '/api/PolicyManager/getPolicyDetails',
	'GetPolicyType': '/api/PolicyManager/getPolicyType',
    'AddUpdatePolicy': '/api/PolicyManager/addUpdateDetails',
    'DeletePolicy': '/api/PolicyManager/deletePolicy',
    'GetOutgoingSchedule': '/api/PolicyManager/getOutgoingSchedules',
    'AddUpdatePolicyNotes': '/api/PolicyManager/addUpdatePolicyNotes',
    'GetPolicyNotesList': '/api/PolicyManager/getpolicyNotesList',
    'DeletePolicyNote': '/api/PolicyManager/deletepolicyNote',
    'GetImcomingPaymentList': '/api/PolicyManager/getIncomingPaymentList',
    'GetSmartFieldDetails': '/api/PolicyManager/getSmartFieldDetails',
    'UpdateSmartFields': '/api/PolicyManager/updatePolicySmartFields',
    'GetOutgoingPaymentList': '/api/PolicyManager/getOutgoingPaymentList',
    'GetFollowUpissuesList': '/api/PolicyManager/getFollowupIssueslist',
    'CheckIncomingScheduleExist': '/api/PolicyManager/checkIncomingScheduleExist',
    'NamedScheduleList': '/api/Setting/namedScheduleList',
    'CheckSchedulesList': '/api/Setting/checkScheduleList',
    'CheckNamedScheduleExist': '/api/Setting/checkNamedScheduleExist',
    'GetSegmentsForPolicies':'/api/PolicyManager/GetSegmentsForPolicies',
    'GetSegmentsOnCoverageId':'/api/PolicyManager/GetSegmentsOnCoverageId',
    'CheckProductSegmentAssociation': '/api/PolicyManager/CheckProductSegmentAssociation',
  }
  public FollowUpIssues: any = {
    'UpdateLastRefresh': '/api/PolicyManager/updateLastRefresh',
    'FollowUpResolveInvoice': '/api/PolicyManager/followUpResolveInvoice',
    'FollowUpIssueClosed': '/api/PolicyManager/followUpIssueClosed',
    'FollowUpPaymentReceived': '/api/PolicyManager/followUpPaymentReceived',
    'GetFollowupPolicyDetails': '/api/PolicyManager/getFollowupPolicyDetails',
    'AddUpdateFollowUpIssues': '/api/PolicyManager/addUpdateFollowUpIssues'
  }
  public IncomingPayment: any = {
    'AddUpdateIncomingPayment': '/api/PolicyManager/addUpdateIncomingPayment',
    'RemoveIncomingPayment': '/api/PolicyManager/removeIncomingPayment',
    'UnLinkIncomingPayment': '/api/PolicyManager/unLinkIncomingPayment'
  }
  public OutgoingPayment: any = {
    'UpdateOutingPayment': '/api/PolicyManager/updateOutgoingPayment',
    'ReversePaymentUserList': '/api/PolicyManager/reversePaymentUserList',
    'ReverseOutgoingPayment': '/api/PolicyManager/reverseOutgoingPayment',
    'RemoveOutgoingPayment': '/api/PolicyManager/removeOutgoingPayment',
    'BatchStatusUpdate': '/api/PolicyManager/batchStatusUpdate'
  }

  constructor() { }

}
