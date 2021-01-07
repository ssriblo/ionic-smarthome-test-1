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
import { Keepalive, KeepAliveStatus } from "../services/keepalive.service"

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
  mode:string = ""; // may be ["Timetable", "Comfort", "Econom"]
  tt_vals:any;
  tt_days:any;
  tt_active:any;
  progress = 0;   
  private keeALiveStatus: KeepAliveStatus;
  private flagKeepAliveFirst30S: boolean = true;
  private time5s:number = 0;
  private flagOdMinute:boolean = true;
  private faultStatus:number = 0;

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
    public keepalive: Keepalive,
    ) {}

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.initVars();
//      this.getTimeTable();
      document.getElementById("version").innerHTML = environment.version;
//      document.getElementById("server-option").innerHTML = environment.serverLoc
    }) // this.platform.ready().then()

    // this is for Android Back Button. Shoudl works at Android only:
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });

    setInterval( () => {  
      this.progress += .1;  
    }, 250 );  
      
    setTimeout(()=> {
      console.log("[setTimeout]: after 2.5s");
      this.apiService.getApiCB('temperatureWeather', (result) => {this.weather_t_s = result['value'] });
      this.apiService.getApiCB('temperatureRoom', (result) => {this.room_t_s = result['value'].toString(10).substring(0, 4); });
      this.getMode();
      this.getTimeTable();
      this.keepalive.postKeepALive();
    }, 2500);

    setTimeout(()=> {
      this.flagKeepAliveFirst30S = false;
      this.globalVar.isKeepAliveActual = true;
      console.log("[ngOnInit home.page]: after 30s this.keeALiveStatus", this.keeALiveStatus);
    }, 30000);    
   
    setInterval(()=> { // persisting GET KeepAlive first 30 seconds
      if (this.flagKeepAliveFirst30S === true) {
        this.keeALiveStatus = this.keepalive.isKeepALive();
        this.time5s = this.time5s + 5;
        console.log("[ngOnInit home.page] every 5s", "seconds=", this.time5s, " this.keeALiveStatus", this.keeALiveStatus);
      }
    }, 5000);

/*******************************************************************************************
 * KeepAlive посылается (POST) каждую нечетную минуту и ожидается (GET) каждую четную минуту
 * flagOdMinute 
********************************************************************************************/
    setInterval(async ()=> {
      const isActive = this.isActiveApp();
      if (await isActive == true) {
        console.log("[setInterval]: every 60s - ACTIVE");
        this.apiService.getApiCB('temperatureWeather', (result) => {this.weather_t_s = result['value'] });
        this.apiService.getApiCB('temperatureRoom', (result) => {this.room_t_s = result['value'].toString(10).substring(0, 4); });
        this.checkAllVals();
        this.flagOdMinute = !this.flagOdMinute;
        if (this.flagOdMinute === true) {
          console.log("********* KEEPASS POST MINUTE")
          this.keepalive.postKeepALive();
        }else {
          console.log("********* KEEPASS GET MINUTE")
          this.keeALiveStatus = this.keepalive.isKeepALive();
        }
      }else {
//        console.log("[setInterval]: every 60s - NOT ACTIVE");
      }
      },60000);    

      setInterval(async ()=> {
        const isActive = this.isActiveApp();
        if (await isActive == true) {
          this.updateFaultStatus();
          }
        },10000);      
      

  } // ngOnInit() finished

  updateFaultStatus() {
    this.apiService.getApiCB('faultStatus', (result) => {
      this.faultStatus = result['value'].toFixed(3) 
      if ( this.faultStatus != 0 ) {
        this.globalVar.isFault = true;
      }else {
        this.globalVar.isFault = false;
      }
// FLAGs1 ('faultStatus') format (from main.py):
// WATER_SENSOR_FAIL[128] AIR_SENSOR_FAIL[64] FLOOD[32] spare[16] DI4[8] DI3[4] DI2[2] POWER_FAIL[1](1-failed)
      if ( (this.faultStatus & 1) != 0) { 
        this.globalVar.isPowerFault = true;
      }else {
        this.globalVar.isPowerFault = false;
      }
      if ( (this.faultStatus &32) != 0) { 
        this.globalVar.isFlood = true;
      }else {
        this.globalVar.isFlood = false;
      }
      if ( (this.faultStatus & 64) != 0) { 
        this.globalVar.isAirSensorFault = true;
      }else {
        this.globalVar.isAirSensorFault = false;
      }
      if ( (this.faultStatus & 128) != 0) { 
        this.globalVar.isWaterSensorFault = true;
      }else {
        this.globalVar.isWaterSensorFault = false;
      }
    });

  }

  checkAllVals() {
    // This is rare issue - may be due to something RangeT or MODE may not sent properly
    // For instanse if RangeT was jump many times and last of them missed
    // How to check it? Let GET RangeT and if this is wrong then re-POST it
    this.apiService.getApiCB('targetTemperature', (result) => {
      let val = result['value']; 
      if ( this.rangeVal != val) {
        this.apiService.postApi('updateTargetTemperature', {"id":"target_room_t", "value":this.rangeVal})
        this.timeTableService.updateTimeTable_mode(this.mode, this.comfortT, this.economT);
        console.log("[home.page][checkAllVals] - !!!!!!!!!!!!!!!!!!!!!!!! rangeval != targetTemperature; rangeVal=", this.rangeVal, "targetTemperature=", val)
      }
    });
  }

  getMode() {
    this.timeTableService.timeTableInit(false)
    this.mode = this.timeTableService.getTimeTable_mode()
    console.log("[home.page getMode()] mode", this.mode)
    if ( this.mode == "Comfort" ) { this.clickComfort() }
    if ( this.mode == "Econom" ) { this.clickEconom() }
    if ( this.mode == "TimeTable" ) { this.clickTimetable() }
    if ( this.mode == "Range" ) { } // do nothing
  }

  getTimeTable() {
    this.timeTableService.timeTableInit(false)
    this.tt_vals = this.timeTableService.getTimeTable_vals()
    this.tt_days = this.timeTableService.getTimeTable_days()
    this.tt_active = this.timeTableService.getTimeTable_active()
  }

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

  updateRange() {
    this.storage.set('targetT', this.rangeVal);
    this.apiService.postApi('updateTargetTemperature', {"id":"target_room_t", "value":this.rangeVal})
    this.isFillComfort = "outline"
    this.isFillEconom = "outline"
    this.isFillTimetable = "outline"
    this.mode = "Range"
    console.log("updateRange() mode=", this.mode)
    this.timeTableService.updateTimeTable_mode(this.mode, this.comfortT, this.economT);
  }

  clickComfort() {
    this.storage.get('comfortT').then((val) => {
      console.log('[clickComfort]: comfortT is', val)
      this.rangeVal = (val == null)? 22.5 * 10 : val * 10
    });
    this.mode = "Comfort"
    this.timeTableService.updateTimeTable_mode(this.mode, this.comfortT, this.economT);
    setTimeout(()=> {
      this.isFillComfort = "solid"
      this.isFillEconom = "outline"
      this.isFillTimetable = "outline"
      console.log("clickComfort()")
      }, 500);
  }

  clickEconom() {
    this.storage.get('economT').then((val) => {
      console.log('[clickEconom]: economT is', val)
      this.rangeVal = (val == null)? 18.5 * 10 : val * 10
    });
    this.mode = "Econom"
    this.timeTableService.updateTimeTable_mode(this.mode, this.comfortT, this.economT);
    setTimeout(()=> {
      this.isFillComfort = "outline"
      this.isFillEconom = "solid"
      this.isFillTimetable = "outline"
      console.log("clickEconom()")
      }, 500);
  }

  clickTimetable() {
    this.isFillComfort = "outline"
    this.isFillEconom = "outline"
    this.isFillTimetable = "solid"
    let res = 0;
    this.storage.get('comfortT').then((val) => {
      this.comfortT = val
      this.storage.get('economT').then((val) => {
        this.economT = val
      });
    });
    if (this.timeTableService.targetIsComfort() === true ) {
      this.rangeVal = this.comfortT * 10
    }else{
      this.rangeVal = this.economT * 10
    }
    console.log('[clickTimetable]: TartetT is', this.rangeVal)

    this.timeTableService.postTimeTable(this.comfortT, this.economT);
    this.mode = "TimeTable"
    this.timeTableService.updateTimeTable_mode(this.mode, this.comfortT, this.economT);
    setTimeout(()=> {
      this.isFillComfort = "outline"
      this.isFillEconom = "outline"
      this.isFillTimetable = "solid"
      console.log("clickTimetable()")
      }, 500);
  }

}

