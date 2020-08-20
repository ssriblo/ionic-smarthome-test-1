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

  constructor(
    private http: HttpClient, 
    private storage: Storage,
    private jwtString: any,
    private httpParams: { params: HttpParams; } | { params?: undefined; },
  ) { this.initApi(); }

  initApi() {
    if ( environment.serverLocal == true ) {
      this.SERVER_URL = environment.SERVER_URL_LOCAL
    }else {
      this.SERVER_URL = environment.SERVER_URL_GOOGLE
    }

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
        console.log("temperatureWeather", data['value']); 
        console.log("temperatureWeather.toString", data.toString()); 
      },
      // Errors will call this callback instead:
      err => {
        console.log('Something went wrong!', err);
      }
    );
  }  
}
