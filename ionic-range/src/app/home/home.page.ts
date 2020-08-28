import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
//import { StorageService, Item } from '../services/storage.service'

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

//  item: Item;
//  newItem: Item = <Item>{}

  constructor(
    public platform:Platform, 
    private routerOutlet: IonRouterOutlet,  
    private http: HttpClient, 
    public router: Router,
    private storage: Storage,
    private apiService: ApiService,
//    private storageService: StorageService,
    ) {}

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.storage.get('targetT').then((val) => {
//        console.log('[ngOnInit] HOME-targetT is', val)
      });

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
//          console.log('[ngOnInit home.page.js]: targetT is', val, 'Comfort:', this.comfortT, 'Econom:', this.economT)      
        }else{
          val = 22;
          this.rangeVal = val;
          this.storage.set('targetT', val);
          console.log('[ngOnInit home.page.js]: targetT is', val)
        }

        // let res = this.apiService.testJwtViaGetRequest('temperatureWeather')
        // if (res != null) {
        //   console.log('[home.ngOnInit()] JWT test passed well', res);
        // }
        // else {
        //   console.log('[home.ngOnInit()] JWT test failed');
        // }
  
      });
  
    }) // this.platform.ready().then()

    // this is for Android Back Button. Shoudl works at Android only:
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });

    setTimeout(()=> {
      console.log("[setTimeout]: after 5s");
      this.apiService.getApiCB('temperatureWeather', (result) => {this.weather_t_s = result['value'] });
      this.apiService.getApiCB('temperatureRoom', (result) => {this.room_t_s = result['value'].toString(10).substring(0, 4); });
    }, 5000);

    setInterval(()=> {
        console.log("[setInterval]: every 60s");
        this.apiService.getApiCB('temperatureWeather', (result) => {this.weather_t_s = result['value'] });
        this.apiService.getApiCB('temperatureRoom', (result) => {this.room_t_s = result['value'].toString(10).substring(0, 4); });
      },60000);       
  } // ngOnInit() finished

  toSetupPage() {
    this.router.navigate(['setup']);  
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
    // console.log('update rangeVal', this.rangeVal, 
    //   'Comfort', this.comfortT,
    //   'Econom', this.economT,
    //   this.isFillComfort, this.isFillEconom)
    this.storage.set('targetT', this.rangeVal);

    this.apiService.postApi('updateTargetTemperature', {"id":"target_room_t", "value":this.rangeVal})
  }

  isDisabledTimetable = true

  clickComfort() {
    this.isFillComfort = "solid"
    this.isFillEconom = "outline"
    this.storage.get('comfortT').then((val) => {
      console.log('[clickComfort]: comfortT is', val)
      this.rangeVal = (val == null)? 22.5 * 10 : val * 10
    });
  }

  clickEconom() {
    this.isFillComfort = "outline"
    this.isFillEconom = "solid"
    this.storage.get('economT').then((val) => {
      console.log('[clickEconom]: economT is', val)
      this.rangeVal = (val == null)? 18.5 * 10 : val * 10
    });
  }

  clickTimetable() {
    console.log('[clickTimetable]')
  }
}

