import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
//import { templateJitUrl } from '@angular/compiler';
import { ApiService } from '../services/api.service';

const { App } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage  implements OnInit  {
  rangeVal:number;
  comfortT: number;
  economT: number;
  weather_t_s:string = "";
  room_t_s:string = "";
  isFillComfort = "solid";
  isFillEconom = "outline";
  isFillTimetable = "outline";
//  url_post = 'http://127.0.0.1:8080/api/post_data'
url_serv = 'http://localhost:8080/OVK/OVK_mob1/1.0.6/'
url_post = 'https://web-serv13802.nw.r.appspot.com/api/post_data'

  constructor(
    public platform:Platform, 
    private routerOutlet: IonRouterOutlet,  
    private http: HttpClient, 
    public router: Router,
    private storage: Storage,
    private apiService: ApiService,
    ) 
    {
      this.platform.ready().then(()=>{
        this.room_t_s  = "20.5"
        this.storage.get('targetT').then((val) => {
          if(val){
            this.rangeVal = val
            this.storage.get('comfortT').then((val) => {
              this.comfortT = val;
            });
            this.storage.get('economT').then((val) => {
              this.economT = val;
            });
            console.log('(constructor)HOME-targetT is', val, 'Comfort:', this.comfortT, 'Econom:', this.economT)      
          }else{
            val = 22;
            this.rangeVal = val;
            this.storage.set('targetT', val);
            console.log('(constructor init val)HOME-targetT is', val)
          }
        });
    
      }) // this.platform.ready().then()
      this.platform.backButton.subscribeWithPriority(-1, () => {
        if (!this.routerOutlet.canGoBack()) {
          App.exitApp();
        }
      });
      setInterval(()=> {
        console.log("every 60s");
//      this.postDataWrap();
//      this.ngPostData();
//      this.ngGetPostData();
      },600000);       
//    this.postDataWrap();
//      this.ngPostData();
//      this.ngGetPostData();
      
      this.storage.get('targetT').then((val) => {
        console.log('(constructor)HOME-targetT is', val)
      });
  }

  ngOnInit() {
    this.apiService.getApi('temperatureWeather');
  }

  toSetupPage() {
    this.router.navigate(['setup']);  
  }

  async postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
//        'Content-Type': 'text/html'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
//      body: {data} // body data type must match "Content-Type" header
});
    return await response.json(); // parses JSON response into native JavaScript objects
  }
//////////////  
  ngGetPostData(url=this.url_serv, data = {target_t: this.rangeVal}) {
    const body = data // body data type must match "Content-Type" header
    const urlPostSuff = 'updateTargetTemperature'
    const urlPostTarget = url.concat(urlPostSuff);
//    this.http.post(urlPostTarget, {"id":"target_room_t", "value":data['target_t']}).subscribe(
//      out => { console.log('POST FROM SERVER: ', out); 
//      }
//    );
    const urlGetRoomTSuff = 'temperatureRoom'
    const urlGetTargetTSuff = 'targetTemperature'
    const urlGetComfortTSuff = 'temperatureComfort'
    const urlGetEconomTSuff = 'temperatureEconom'
    const urlGetWeatherTSuff = 'temperatureWeather'
    let urlGet = url.concat(urlGetRoomTSuff);
    let temp: any
    let temp_s: string
    this.http.get(urlGet).subscribe(out => { 
      console.log("temperatureRoom", out['value'], typeof this.room_t_s); 
      temp_s = out['value'].toString(10).substring(0, 4);
      this.room_t_s = temp_s;
    })

    urlGet = url.concat(urlGetWeatherTSuff);
    this.http.get(urlGet).subscribe(out => { console.log("temperatureWeather", out['value']); this.weather_t_s = out['value'] })
  }
 //////////////
  updateRange() {
    if ((this.rangeVal != this.comfortT) && (this.rangeVal != this.economT)) {
      this.isFillComfort = "outline"
      this.isFillEconom = "outline"
    }
    if (this.rangeVal == this.comfortT ) {
      this.isFillComfort = "solid"
    }
    if (this.rangeVal == this.economT ) {
      this.isFillEconom = "solid"
    }
    console.log('update rangeVal', this.rangeVal, 
      'Comfort', this.comfortT,
      'Econom', this.economT,
      this.isFillComfort, this.isFillEconom)
    this.ngGetPostData();
    this.storage.set('targetT', this.rangeVal);

    this.apiService.postApi('updateTargetTemperature', {"id":"target_room_t", "value":'22.9'})

  }

  isDisabledTimetable = true

  clickComfort() {
    console.log('click Comfort')
    this.isFillComfort = "solid"
    this.isFillEconom = "outline"
    this.storage.get('comfortT').then((val) => {
      console.log('(click)HOME-comfortT is', val)
      this.rangeVal = val;
    });
  }

  clickEconom() {
    console.log('click Econom')
    this.isFillComfort = "outline"
    this.isFillEconom = "solid"
    this.storage.get('economT').then((val) => {
      console.log('(click)HOME-economT is', val)
      this.rangeVal = val;
    });
  }

  clickTimetable() {
    console.log('click Timetable')
  }
}

