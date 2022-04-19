import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonDataUrlService {

  public DomainDataList: any = {
    'GetPayorsList': '/api/CommonData/getPayorsList',
    'GetCarriers': 'api/CommonData/getCarrierList',
    'GetProducts': 'api/CommonData/getProductsList',
    'GetProductTypes': 'api/CommonData/getProductTypes',
    'GetGlobalPayorCarriers': 'api/CommonData/getGlobalPayorCarriers',
    'GetAccExecByLicensee': 'api/CommonData/getAccountExecByLicensee',
    'GetTermReasonList': '/api/CommonData/getTermReasonList',
    'GetIncomingPayTypes': 'api/CommonData/getPayTypes',
    'GetPrimaryAgent': '/api/CommonData/getPrimaryAgent',
    'GetpoliciesList': '/api/PolicyManager/getPoliciesListing',
    'GetReplacedPolicyList': '/api/PolicyManager/getReplacedPolicyList',
    'GetUploadBatchNumber': '/api/CompManager/getUploadBatchNumber',
    'UpdateBatchFileName': '/api/CompManager/updateBatchFileName',
    'GetAllClientName': '/api/PolicyManager/getAllClientName',
    'GetLicenseeList': '/api/CommonData/getLicenseeList',
    'GetPayorRegions':'/api/CommonData/getPayorRegions'
  }
}
