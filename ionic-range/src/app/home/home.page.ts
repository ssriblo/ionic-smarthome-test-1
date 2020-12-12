import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { GlobalService } from "../services/global.service";
import { AlertsPage } from "../pages/alerts/alerts.page";
import { MenuController } from '@ionic/angular';
import { TimetableService } from "../services/timetable.service"

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
  isFillComfort = "outline";
  isFillEconom = "outline";
  isFillTimetable = "outline";
  isDisabledTimetable = false
  isDisabledComfort = false
  isDisabledEconom = false
  isMode = "Comfort"; // may be ["Timetable", "Comfort", "Econom"]
  tt_vals: any;
  tt_days: any;
  tt_active: any;

  constructor(
    public platform:Platform, 
    private routerOutlet: IonRouterOutlet,  
    public router: Router,
    private storage: Storage,
    private apiService: ApiService,
    public globalVar: GlobalService,
    private alertsPage: AlertsPage,
    private menu: MenuController,
    private timeTableService: TimetableService,
    ) {}

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.initVars();
      document.getElementById("version").innerHTML = environment.version;
//      document.getElementById("server-option").innerHTML = environment.serverLoc
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

    setInterval(async ()=> {
      const isActive = this.isActiveApp();
      if (await isActive == true) {
//        console.log("[setInterval]: every 60s - ACTIVE");
        this.apiService.getApiCB('temperatureWeather', (result) => {this.weather_t_s = result['value'] });
        this.apiService.getApiCB('temperatureRoom', (result) => {this.room_t_s = result['value'].toString(10).substring(0, 4); });
      }else {
//        console.log("[setInterval]: every 60s - NOT ACTIVE");
      }
      },60000);       
  } // ngOnInit() finished

  initVars() {
    this.room_t_s  = "20.5"
    this.storage.get('targetT').then((val) => {
      if(val){ this.rangeVal = val }else{
        val = 22;
        this.rangeVal = val;
        this.storage.set('targetT', val);
        console.log('[ngOnInit home.page.js]: targetT ', val)
      }
    });
    this.storage.get('comfortT').then((val) => {
      if(val){ this.comfortT = val }else{
        val = 22;
        this.comfortT = val;
        this.storage.set('comfortT', val);
        console.log('[ngOnInit home.page.js]: comfortT ', val)
      }
    });
    this.storage.get('economT').then((val) => {
      if(val){ this.economT = val }else{
        val = 22;
        this.economT = val;
        this.storage.set('economT', val);
        console.log('[ngOnInit home.page.js]: economT ', val)
      }
    });

  } // initVars()


  async isActiveApp() {
    return (await App.getState()).isActive
  }

  toSetupPage() {
    this.router.navigate(['setup']);  
  }

  toAlertPage() {
    this.alertsPage.updateAlerts();
    this.router.navigate(['alerts']);  
  }

  toMetersPage() {
    this.router.navigate(['meters']);  
  }

  toHomePage() {
    this.menu.toggle();
  }

  //////////////
  private  updateRangeDisplay() {
    console.log('[updateRange] rangeVal, Comfort Econom', this.rangeVal, this.comfortT, this.economT)
    // Does not needed -> Buttons handlers deal with this more properly:
    // if ((this.rangeVal != this.comfortT * 10) && (this.rangeVal != this.economT * 10)) {
    //   this.isFillComfort = "outline"
    //   this.isFillEconom = "outline"
    // }
    // if (this.rangeVal == this.comfortT * 10 ) {
    //   this.isFillComfort = "solid"
    // }
    // if (this.rangeVal == this.economT * 10) {
    //   this.isFillEconom = "solid"
    // }
  }

  updateRange() {
    this.updateRangeDisplay()
    this.storage.set('targetT', this.rangeVal);
    this.apiService.postApi('updateTargetTemperature', {"id":"target_room_t", "value":this.rangeVal})

    this.tt_vals = this.timeTableService.timeTableInit(false)
    this.tt_vals = this.timeTableService.getTimeTable_vals()
    console.log("tt_vals", this.tt_vals[0][0], this.tt_vals[0][1])
    this.apiService.postApi('updateTimeTable', {
      "id":"timetable", 
      "value": [
            {"line0": 25},
            {"line1": 26},
          ]
    })
  }

  clickComfort() {
    this.isFillComfort = "solid"
    this.isFillEconom = "outline"
    this.isFillTimetable = "outline"
    this.storage.get('comfortT').then((val) => {
      console.log('[clickComfort]: comfortT is', val)
      this.rangeVal = (val == null)? 22.5 * 10 : val * 10
    });
  }

  clickEconom() {
    this.isFillComfort = "outline"
    this.isFillEconom = "solid"
    this.isFillTimetable = "outline"
    this.storage.get('economT').then((val) => {
      console.log('[clickEconom]: economT is', val)
      this.rangeVal = (val == null)? 18.5 * 10 : val * 10
    });
  }

  clickTimetable() {
    this.isFillComfort = "outline"
    this.isFillEconom = "outline"
    this.isFillTimetable = "solid"
    let res = 0;
    if (this.timeTableService.targetIsComfort() === true ) {
      this.storage.get('comfortT').then((val) => {
        this.rangeVal = val * 10
      });
    }else {
      this.storage.get('economT').then((val) => {
        this.rangeVal = val * 10
      });
    }
    console.log('[clickTimetable]: TartetT is', this.rangeVal)
  }

}

