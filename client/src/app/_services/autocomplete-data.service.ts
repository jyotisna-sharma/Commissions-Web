import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AutocompleteData, IAutocompleteData} from '../shared/mi-autocomplete/mi-data';
import { isObject } from 'util';
const headerOption = { headers: new HttpHeaders({ 'content-type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class AutocompleteDataService {

  constructor(private _http:  HttpClient) { }

  searchData(object: any, dataURL: string, postData: any): Observable<IAutocompleteData> {
   if (isObject(object)) {
     // we have to send the postdata= {any variable like abc:''}
    postData['SearchString'] = object.formattedName;
   } else {
    postData['SearchString'] =  object; }
    const time = Date.now();
    return this._http.post<IAutocompleteData>(dataURL + '?t=' + time, postData, headerOption)
    .pipe(
      tap((response: IAutocompleteData) => { if (response) {
        response.TotalRecords = response.TotalRecords
        .map(user =>  new AutocompleteData(user.formattedName, user.formattedValue));
        return response;
      } else { return null }})
      );
  }
}
