import { Observable } from 'rxjs/Observable';
import { Http, XHRBackend, Request, RequestOptionsArgs, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthenticatedHttpService extends Http {
    constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options).catch((error: Response) => {
            console.log(error);
            console.log(window.location.href);
            if ((error.status === 401 || error.status === 403) && window.location.href.indexOf('/login') < 0) {
                window.location.href = '';
            }
            console.log('about to throw an error');
            return Observable.throw(error);
        });
    }
}
