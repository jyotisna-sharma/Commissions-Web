import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }
   /**
     * @author: Ankit.
     * @description: Handle the error while sending Http request(get/post).
     * @dated: 16 Aug, 2018.
     * @parameters: error (Type: HttpErrorResponse )
     * @modified: 16 Aug, 2018.
     * @return: rendering the error on console.
     **/
    public handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
      } else {
          console.error(
              `Backend returned code ${error.status},` +
              `body was: ${error.error}`);
      }
      return throwError('Something bad happened; please try again later.');
  }
}
