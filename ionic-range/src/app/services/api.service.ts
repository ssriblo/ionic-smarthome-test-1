import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public isJWT: boolean = false;
  private SERVER_URL: string = "";
  private jwtString: string;
  private httpParams: { params: HttpParams; } | { params?: undefined; };

  constructor(
    private http: HttpClient, 
    private storage: Storage,
  ) { 
      this.initApi();       
    }

  initApi() {
    if ( environment.serverLocal == true ) {
      this.SERVER_URL = environment.SERVER_URL_LOCAL
    }else {
      this.SERVER_URL = environment.SERVER_URL_GOOGLE
    }

    if( (environment.forceWriteJwt == true) && (environment.mobileBuild == false)) {
      // One Time write down JWT Token to Store. Next time it will be reading well
      this.storage.set(
        'jwtString', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGFydElEIjoiMTExIiwibmFtZSI6ItCh0LXRgNCz0LXQuSDQoSIsInRva2VuTnVtYmVyIjoxLCJwcm9qZWN0IjoidGVzdFByb2plY3QtMSIsImlhdCI6MTU5NzczMjY3NiwiZXhwIjozODA2ODU2ODc5fQ.b9rTPTEiBTo-eexqA14TOPP66u0-nWOkjPEFc3047Gk'
        ).then(val => {console.log('Forse store default JWT Token at Local Store')})
    }

    if ( environment.forceDeleteJwt == true) {
      this.storage.remove('jwtString').then(val => { console.log('remove jwtString from Local Store', val)});
    }

    this.storage.get('jwtString').then((val) => {
        this.jwtString = val;
        console.log('get jwtString from storage: ', this.jwtString );  
        if (val) {
            this.isJWT = true;
            this.httpParams =  this.initHttpParams(this.jwtString);
            this.getApi('temperatureWeather?q=444');
          }
      });

  }

  initHttpParams(term: string) {
    const options = term ?
    { params: new HttpParams().set('jwt', term) } : {};
    return options;
  }

  getApi(urlSurf: string) {
    const body = {jwtKey: this.jwtString};
    const url = this.SERVER_URL.concat(urlSurf)
    this.http.get(url, this.httpParams)
    .subscribe(
      data => { 
        console.log('GET Result: '.concat(urlSurf), data['value']); 
        return data['value'];
      },
      err => {
        console.log('GET - Something went wrong!'.concat(urlSurf), err);
        return null;
      }
    );
  }

  postApi(urlSurf: string, postData: {}) {
    const body = {jwtKey: this.jwtString};
    const url = this.SERVER_URL.concat(urlSurf)
    this.http.post(url, this.httpParams)
    .subscribe(
      data => { 
        console.log('GET Result: '.concat(urlSurf), data['value']); 
        return data['value'];
      },
      err => {
        console.log('GET - Something went wrong!'.concat(urlSurf), err);
        return null;
      }
    );
  }

}
