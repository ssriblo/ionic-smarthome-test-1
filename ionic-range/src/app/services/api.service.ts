import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private isJWT: boolean = false;
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
    console.log(">>>>>>>>>>>>>>>>> - 1", this.SERVER_URL)
    
    // // TEMPORARY !!! -> One Time write down JWT Token to Store. Next time it will be reading well
    // this.storage.set('jwtString', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGFydElEIjoiMTExIiwibmFtZSI6ItCh0LXRgNCz0LXQuSDQoSIsInRva2VuTnVtYmVyIjoxLCJwcm9qZWN0IjoidGVzdFByb2plY3QtMSIsImlhdCI6MTU5NzczMjY3NiwiZXhwIjozODA2ODU2ODc5fQ.b9rTPTEiBTo-eexqA14TOPP66u0-nWOkjPEFc3047Gk');


    this.storage.get('jwtString').then((val) => {
        this.jwtString = val;
        console.log('get jwtString from storage: ', this.jwtString);  
        this.isJWT = true;
        this.httpParams =  this.initHttpParams(this.jwtString);
        this.getWeatherT();

      });

  }

  initHttpParams(term: string) {
    const options = term ?
    { params: new HttpParams().set('jwt', term) } : {};
    return options;
  }

  getWeatherT() {
    const body = {jwtKey: this.jwtString};
    const urlGetWeatherTSuff = 'temperatureWeather?q=444'
    const urlGetWeather = this.SERVER_URL.concat(urlGetWeatherTSuff)
    this.http.get(urlGetWeather, this.httpParams)
    .subscribe(
      // Successful responses call the first callback.
      data => { 
        console.log("getWeatherT() -> ", data['value']); 
        console.log("getWeatherT() -> .toString", data.toString()); 
      },
      // Errors will call this callback instead:
      err => {
        console.log('getWeatherT() -> Something went wrong!', err);
      }
    );
  }  
}
