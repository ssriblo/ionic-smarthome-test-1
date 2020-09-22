import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public isJWT: boolean = false;
  public serverLocation = {
    server: 'local',
    display: "локальный"
  };
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
    
  private updateServer() {
    if ( environment.serverLoc == "local" ) {
        this.serverLocation.server = 'local'
        this.serverLocation.display = 'локальный'
        this.SERVER_URL = environment.SERVER_URL_LOCAL
    }else {
      this.serverLocation.server = 'cloud'
      this.serverLocation.display = 'облачный'
    this.SERVER_URL = environment.SERVER_URL_GOOGLE
    }
  }

  public initApi() {
    this.updateServer();

    this.storage.get('jwtString').then(async (val) => {
        this.jwtString = val;
        console.log('[initApi]: get jwtString from storage: ', this.jwtString );  
        if (val) {
          this.httpParams =  this.initHttpParams(this.jwtString);
          let res =  await this.testJwtViaGetRequest('temperatureWeather')
          if (res == true) {
            console.log('[ApiService.initApi()] JWT test passed well', res);
          }
          else {
            console.log('[ApiService.initApi()] JWT test failed');
          }
    

        }else{
          console.log("[ApiService.initApi] jwtString not exist yet !! ")
        }
      });


  }
  
public getApiAsync(urlSurf: string): Promise<any>{
  this.updateServer();
  const url = this.SERVER_URL.concat(urlSurf)
  this.http.get(url, this.httpParams)
  return new Promise((resolve, reject) =>
    {
      return this.http.get(url, this.httpParams)
        .subscribe(
          result => {
            console.log('[ApiService.getApiAsync] success', result);
            resolve(result); // MAIN POINT - "resolve" - function; result - value, argument for resolve !!
          },
          error => {
            console.log('[ApiService.getApiAsync] oops', error);
            reject(error)
          }
        );
    })
  }

  public async testJwtViaGetRequest(url: string) {
    let res = false;
//    console.log('[ApiService.testJwtViaGetRequest-------1]')
    try {
      const result = await this.getApiAsync(url);
//      console.log('[ApiService.testJwtViaGetRequest-------2]')
      res = true
    }
    catch(e) {
      console.log('[ApiService.testJwtViaGetRequest ERROR]',e)
    }
    return res;
  }
  
  initHttpParams(term: string) {
    const options = term ?
    { params: new HttpParams().set('jwt', term) } : {};
    return options;
  }

  public getApiCB(urlSurf: string, onSuccess) {
    this.updateServer();
    const url = this.SERVER_URL.concat(urlSurf)
    this.http.get(url, this.httpParams)
    .subscribe(onSuccess);
  }

  public postApi(urlSurf: string, postData: {}) {
    this.updateServer();
    const url = this.SERVER_URL.concat(urlSurf)
    this.http.post(url, postData, this.httpParams )
    .subscribe(
      (data) => { 
        console.log('[postApi]:   ', postData, urlSurf, data); 
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
