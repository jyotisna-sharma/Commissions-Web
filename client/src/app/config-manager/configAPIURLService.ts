import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigAPIUrlService {
  public ConfigAPIRoute: any = {
    'GetPayorsListing': '/api/ConfigManager/getPayorsList',
    'GetCarrierListing': '/api/ConfigManager/getCarrierList',
    'GetProductListing': '/api/ConfigManager/getProductList',
    'SaveDeletePayor': '/api/ConfigManager/saveDeletePayor',
    'GetPayorContacts': '/api/ConfigManager/getPayorContacts',
    'DeletePayorContact': '/api/ConfigManager/deletePayorContact',
    'AddUpdatePayorContact': '/api/ConfigManager/addUpdatePayorContact',
    'GetayorContactDetails': '/api/ConfigManager/getPayorContactDetails',
    'GetGoogleLocationsAPIroute': '/api/peoplemanager/getGoogleLocations',

  };
  public CarrierAPIRoute: any = {
    'AddUpdateCarrier': '/api/ConfigManager/addUpdateCarrier',
    'GetCarrierDetails': '/api/ConfigManager/getCarrierDetails',
    'DeleteCarrier': '/api/ConfigManager/deleteCarrier'
  };
  public productAPIRoute: any = {
    'AddUpdateCoverageType': '/api/ConfigManager/addUpdateCoverageTypeDetails',
    'DeleteProductType': '/api/ConfigManager/deleteProductType',
    'GetProductListing':'api/ConfigManager/getProdctListing',
    'AddUpdateCoverage':'/api/ConfigManager/addUpdateCoverageDetails',
    'DeleteCoverages':'/api/ConfigManager/deleteCoverages'
  };
  public CompTypeAPIRoute: any = {
    'GetCoverageTypeListing': '/api/ConfigManager/getCoverageTypeListing',
    'AddUpdateCompTypeDetails': '/api/ConfigManager/addUpdateCompTypedetails',
    'DeleteCompType': '/api/ConfigManager/deleteCompType'
  };
  public FollowUpSettingAPIRoute: any = {
    'UpdateFollowUpSetting': '/api/ConfigManager/updateFollowUpSetting',
    'GetFollowUpSettingDetails':'/api/ConfigManager/getFollowUpSettingDetails'

  };
  constructor() { }
}
