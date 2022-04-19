import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../_services/error-handler.service';
import { PolicyManagerUrlService } from '../policy-manager/policy-manager-url.service';
const headersOption = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

@Injectable({providedIn: 'root'})
export class PolicymanagerService {
  clientNameObj: any;
  ClientIdObj: any;
  clientListing: any;
  constructor(
    private http: HttpClient,
    private erroHttp: ErrorHandlerService,
    public policyManagerURL: PolicyManagerUrlService

  ) { }
  public getTableData(postData: any, url: any): Observable<any> {
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getAllClientName(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicicyManagerListing.GetAllClientName;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }

  public getClientName(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicicyManagerListing.GetClientName;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }

  public CheckNamedScheduleExist(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.CheckNamedScheduleExist;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getSelectedClientName(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicicyManagerListing.GetSelectedClientName;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }

  public getSearchedClientName(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicicyManagerListing.GetSearchedClients;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }

  public getPolicyDetails(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.GetPolicyDetails;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public getPolicyType(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.GetPolicyType;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public savePolicyDetails(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.AddUpdatePolicy;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public deletePolicy(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.DeletePolicy;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public deleteClientWithPolicy(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.DeletePolicy;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public checkIncomingScheduleExist(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.CheckIncomingScheduleExist;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public addUpdatePolicyNotes(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.AddUpdatePolicyNotes;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetPolicyNotesList(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.GetPolicyNotesList;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public DeletePolicyNote(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.DeletePolicyNote;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetsmartFieldDetails(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.GetSmartFieldDetails;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public FollowUpPaymentReceived(postData: any): Observable<any> {
    const url = this.policyManagerURL.FollowUpIssues.FollowUpPaymentReceived;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public FollowUpResolveInvoice(postData: any): Observable<any> {
    const url = this.policyManagerURL.FollowUpIssues.FollowUpPaymentReceived;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public FollowUpIssueClosed(postData: any): Observable<any> {
    const url = this.policyManagerURL.FollowUpIssues.FollowUpIssueClosed;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public UpdateLastRefresh(postData: any): Observable<any> {
    const url = this.policyManagerURL.FollowUpIssues.UpdateLastRefresh;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public AddUpdateFollowUpIssues(postData: any): Observable<any> {
    const url = this.policyManagerURL.FollowUpIssues.AddUpdateFollowUpIssues;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public UpdateSmartFields(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.UpdateSmartFields;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public FollowUpIssuePolicyDetails(postData: any): Observable<any> {
    const url = this.policyManagerURL.FollowUpIssues.GetFollowupPolicyDetails;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public AddUpdateIncomingPayment(postData: any): Observable<any> {
    const url = this.policyManagerURL.IncomingPayment.AddUpdateIncomingPayment;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public RemoveIncomingPayment(postData: any): Observable<any> {
    const url = this.policyManagerURL.IncomingPayment.RemoveIncomingPayment;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public UnLinkIncomingPayment(postData: any): Observable<any> {
    const url = this.policyManagerURL.IncomingPayment.UnLinkIncomingPayment;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public UpdateOutgoingPayment(postData: any): Observable<any> {
    const url = this.policyManagerURL.OutgoingPayment.UpdateOutingPayment;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetLicenseeUserList(postData: any): Observable<any> {
    const url = this.policyManagerURL.OutgoingPayment.ReversePaymentUserList;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public ReverseOutgoingPayment(postData: any): Observable<any> {
    const url = this.policyManagerURL.OutgoingPayment.ReverseOutgoingPayment;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public RemoveOutgoingPayment(postData: any): Observable<any> {
    const url = this.policyManagerURL.OutgoingPayment.RemoveOutgoingPayment;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public BatchStatusUpdate(postData: any): Observable<any> {
    const url = this.policyManagerURL.OutgoingPayment.BatchStatusUpdate;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public ImportPolicy(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicicyManagerListing.ImportPolicyDetails;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetSegmentsForPolicies(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.GetSegmentsForPolicies;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
  public GetSegmentsOnCoverageId(postdata: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.GetSegmentsOnCoverageId;
    return (this.http.post<any[]>(url, postdata).pipe(catchError(this.erroHttp.handleError)))
  }
  public CheckProductSegmentAssociation(postData: any): Observable<any> {
    const url = this.policyManagerURL.PolicyDetails.CheckProductSegmentAssociation;
    return (this.http.post<any[]>(url, postData).pipe(catchError(this.erroHttp.handleError)))
  }
}
