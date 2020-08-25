import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import {HttpParams} from "@angular/common/http";
import { Platform } from '@ionic/angular';

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
    public platform:Platform, 
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
        ).then(val => {console.log('[initApi]: Forse store default JWT Token at Local Store')})
    }

    if ( environment.forceDeleteJwt == true) {
      this.storage.remove('jwtString').then(val => { console.log('[initApi]: remove jwtString from Local Store', val)});
    }

    this.storage.get('jwtString').then((val) => {
        this.jwtString = val;
        console.log('[initApi]: get jwtString from storage: ', this.jwtString );  
        if (val) {
          this.httpParams =  this.initHttpParams(this.jwtString);
          this.getApiCB('temperatureWeather', (result) => {
            if(result != null) {
              this.isJWT = true;
            }
          });
          this.postApi('updateTargetTemperature', {"id":"target_room_t", "value":21})
        }else{
          console.log("[initApi] jwtString not exist yet !! ")
        }
      });
      
  }

  initHttpParams(term: string) {
    const options = term ?
    { params: new HttpParams().set('jwt', term) } : {};
    return options;
  }

  public getApiCB(urlSurf: string, onSuccess) {
    const body = {jwtKey: this.jwtString};
    const url = this.SERVER_URL.concat(urlSurf)
    this.http.get(url, this.httpParams)
    .subscribe(onSuccess);
  }

  public postApi(urlSurf: string, postData: {}) {
    const body = {jwtKey: this.jwtString};
    const url = this.SERVER_URL.concat(urlSurf)
    this.http.post(url, postData, this.httpParams )
    .subscribe(
      (data) => { 
        console.log('[postApi]:   ',  urlSurf, data); 
        return data['value'];
      },
      err => {
        console.log('[postApi] - Something went wrong!   ',  urlSurf, err);
        return null;
      },
      // () => {
      //   console.log("[postApi]: The POST observable is now completed.")}
    );
  }

  public removeJwt() {
    return this.storage.remove('jwtString').then(val => { console.log('[removeJwt]: remove jwtString from Local Store', val)});
  }

}
