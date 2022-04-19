import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PeopleManagerAPIUrlService {
  public PeoplemanagerAPIRoute: any = {
    'GetAgentDetails': '/api/Peoplemanager/getAgentDetails',
    'PeoplemanagerAPIRoute': '/api/PeopleManager/getUserListing',
    'AddUpdateAgentDetailsAPIRoute': '/api/PeopleManager/addUpdateAgentDetails',
    'GetGoogleLocationsAPIroute': '/api/peoplemanager/getGoogleLocations',
    'HouseAccountUpdateAPIroute': '/api/peoplemanager/houseAccountUpdate',
    'UsermappingListing': '/api/PeopleManager/userMappingListing',
    'LinkedUserListUpdate': '/api/PeopleManager/addUpdateLinkedUserList',
    'UpdateAgentSettingDetails': '/api/PeopleManager/addUpdateAgentSettingDetails',
    'GetHouseAccountDetails': '/api/PeopleManager/getHouseAccountDetails',
    'GetAgentSettingDetails': '/api/PeopleManager/getAgentSettingDetails ',
    'DeleteAgent': '/api/PeopleManager/deleteAgent',
    'GetUserCredentialId': '/api/PeopleManager/getUserCredentialId',
    'GetUserListingAPIRoute' : '/api/PeopleManager/getUserListing',
    'UpdateAdminStatus': '/api/PeopleManager/updateAdminStatus',
    'GetDataEntryUserList':'/api/PeopleManager/getDataEntryUserList'
  };

  constructor() { }
}
