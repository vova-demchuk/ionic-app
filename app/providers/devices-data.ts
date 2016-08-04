import {Events} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';


@Injectable()
export class DevicesData {
    private headers: Headers;
    private urls: any = {};

    constructor(private http: Http, private events: Events) {
        let headers = { 'EIOT-AuthToken': '[your EIOT-AuthToken]' };
        this.headers = new Headers(headers);
        this.urls.module = 'http://cloud.iot-playground.com:40404/RestApi/v1.0/Module/';
        this.urls.parameter = 'http://cloud.iot-playground.com:40404/RestApi/v1.0/Parameter/';
    }

    getFirstDevice() {
        return this.getData(this.urls.module + '3');
    }

    getParameter(parameter) {
        return this.http.get(this.urls.parameter + parameter.Id, { headers: this.headers }).map((res: Response) => res.json());
    }

    getParameters(parameters) {
        let parameterRequests = [];
        parameters.map((item, index) => {
            parameterRequests.push(
                this.http.get(this.urls.parameter + item.Id, { headers: this.headers }).map((res: Response) => res.json())
            )
        });
        return Observable.forkJoin(parameterRequests);
    }

    updateParameter(parameter) {
        let url = this.urls.parameter + parameter.Id + '/Value/' + parameter.Value;
        let parameterJson = JSON.stringify({});
        return this.http.post(url, parameterJson, { headers: this.headers }).map((res: Response) => res.json());
    }

    /* private */

    private getData(url) {
        return this.http.get(url, { headers: this.headers }).map((response: Response) => {
            response._body += '}';
            return response.json();
        });
    }
}