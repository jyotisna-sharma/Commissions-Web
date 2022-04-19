import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientAPIUrlService {
  public ClientAPIRoute: any = {
    'GetClientListing': '/api/Client/getClientList',
    'addupdateClientDetails': '/api/Client/addupdateClientDetails',
    'GetGoogleLocationsAPIroute': '/api/peoplemanager/getGoogleLocations',
    'GetClientDetails': '/api/Client/getClientDetails',
    'DeleteClientDetails': '/api/Client/deleteClient',
    'GetClientName': '/api/Client/getClientName',
  };

  constructor() { }
}
