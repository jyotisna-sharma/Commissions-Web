import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { AppLevelDataService, } from '../_services/app-level-data.service';
import { AuthenticationUrlService } from '../authentication/authentication-url.service';
import { Router, ActivatedRoute } from '@angular/router';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    returnUrl: any;
    constructor(
        private authenticationService: AuthenticationService,
        private appData: AppLevelDataService,
        private router: Router,
        private authenUrl: AuthenticationUrlService,
        private route: ActivatedRoute,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                localStorage.clear(); // set dashboard title.
                localStorage.removeItem('loggedUser');
                this.appData.licenseeList = '';
                this.router.navigate([this.returnUrl]);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))

    }
}
