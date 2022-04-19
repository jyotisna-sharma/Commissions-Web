
import {throwError as observableThrowError, Observable} from 'rxjs';

import {timeoutWith} from 'rxjs/operators';
import { Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpEvent, HttpHandler} from '@angular/common/http';


@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
    defaultTimeout: any;
    constructor() {
        this.defaultTimeout = 1000 * 60 * 550;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const timeout = this.defaultTimeout;
      
        return next.handle(req).pipe(timeoutWith(timeout, observableThrowError('Request timed out')));
    }
}

