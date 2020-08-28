import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { catchError, map, tap} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

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

    this.storage.get('jwtString').then(async (val) => {
        this.jwtString = val;
        console.log('[initApi]: get jwtString from storage: ', this.jwtString );  
        if (val) {
          this.httpParams =  this.initHttpParams(this.jwtString);

          // this.getApiCB('temperatureWeather', (result) => {
          //   if(result != null) {
          //     this.isJWT = true;
          //   }
          // });

          let res =  await this.testJwtViaGetRequest('temperatureWeather')
          if (res == true) {
            console.log('[ApiService.initApi()] JWT test passed well', res);
          }
          else {
            console.log('[ApiService.initApi()] JWT test failed');
          }
    

        }else{
          console.log("[initApi] jwtString not exist yet !! ")
        }
      });


  }
  
public getApiAsync(urlSurf: string): Promise<any>{
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
    console.log('[ApiService.testJwtViaGetRequest-------1]')
    try {
      const result = await this.getApiAsync(url);
      console.log('[ApiService.testJwtViaGetRequest-------2]')
      res = true
    }
    catch(e) {
      console.log('[ApiService.testJwtViaGetRequest-------3]')
    }
    return res;
  }

  // // ported from https://www.freakyjolly.com/angular-7-8-httpclient-service-tutorial-to-consume-restfull-api-from-server/#.X0iMxnYzb0o
  // public getApiAsync2(urlSurf: string): Promise<any>{
  //   const url = this.SERVER_URL.concat(urlSurf)
  //   return new Promise((resolve, reject) =>
  //     {
  //       return this.http.get(url, this.httpParams)
  //       .pipe(
  //         catchError(this.handleError)
  //       )
  //     })
  //   }

  // // ported from https://www.freakyjolly.com/angular-7-8-httpclient-service-tutorial-to-consume-restfull-api-from-server/#.X0iMxnYzb0o
  // handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('[ApiService.getApiAsync2] An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     '[ApiService.getApiAsync2] Something bad happened; please try again later.');
  // };
  
  // public async testJwtViaGetRequest2(url: string) {
  //   const result = await this.getApiAsync2(url);
  //   return result !=null;
  // }
  
  initHttpParams(term: string) {
    const options = term ?
    { params: new HttpParams().set('jwt', term) } : {};
    return options;
  }

  public getApiCB(urlSurf: string, onSuccess) {
    const url = this.SERVER_URL.concat(urlSurf)
    this.http.get(url, this.httpParams)
    .subscribe(onSuccess);
  }

  public postApi(urlSurf: string, postData: {}) {
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
