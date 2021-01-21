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
import { SmartAudioService } from '../services/smart-audio.service';

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
    public smartAudio: SmartAudioService,
    ) {}   

  // ionViewWillEnter() {let  dateTime = new Date(); console.log(">>>>>>>>> ionViewWillEnter", dateTime.getTime() )}
  // ionViewDidEnter() {let  dateTime = new Date(); console.log(">>>>>>>>> ionViewDidEnter", dateTime.getTime() )}
  // ionViewWillLeave() {let  dateTime = new Date(); console.log(">>>>>>>>> ionViewWillLeave", dateTime.getTime() )}
  // ionViewDidLeave() {let  dateTime = new Date(); console.log(">>>>>>>>> ionViewDidLeave", dateTime.getTime() )}

  ionViewWillEnter() {
    this.getMode(3);
    this.updateTimeTabelStatus();
    // befor home page entering - let renovate all
//    this.refreshAll(); // do not call "refreshAll()" here due to fault at runtime at getApiCB(...room_t_s...)
  }

  refreshAll() {
    this.platform.ready().then(()=>{
      this.initVars();
      this.getMode(1);
      this.updateTimeTabelStatus();
      this.apiService.getApiCB('temperatureWeather', (result) => {this.weather_t_s = result['value'] });
      this.apiService.getApiCB('temperatureRoom', (result) => {
        let val = result['value']
        if (val) { // need check due to fault at the start of Home Page
          this.room_t_s  = val.toString(10).substring(0, 4); 
        }
      });
      this.checkAllVals();
      console.log("$$$$$$$$$ ionViewWillEnter $$$$$$$ mode=", this.globalVar.mode)
      });
  }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.refresherAction(null);
      this.initVars();
      this.timeTableService.checkActiveTotal();
      document.getElementById("version").innerHTML = environment.version;
//      document.getElementById("server-option").innerHTML = environment.serverLoc
    }) // this.platform.ready().then()

    // this is for Android Back Button. Shoudl works at Android only:
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
    var refreshIntervalId = setInterval( () => {  
      this.progress += .15; 
      console.log("********** 0.1"); 
    }, 200 );  
      
    setTimeout(()=> {
//      console.log("[setTimeout]: after 2.5s");
      this.apiService.getApiCB('temperatureWeather', (result) => {this.weather_t_s = result['value'] });
      this.apiService.getApiCB('temperatureRoom', (result) => {this.room_t_s = result['value'].toString(10).substring(0, 4); });
      this.getMode(2);
      this.timeTableService.timeTableInit(false)
      this.keepalive.postKeepALive();
      this.timeTableService.checkActiveTotal();
      clearInterval(refreshIntervalId);
    }, 2500);

    setTimeout(()=> {
      this.flagKeepAliveFirst30S = false;
      this.globalVar.isKeepAliveActual = true;
//      console.log("[ngOnInit home.page]: after 30s this.keeALiveStatus", this.keeALiveStatus);
    }, 30000);    
   
    setInterval(()=> { // persisting GET KeepAlive first 30 seconds
      if (this.flagKeepAliveFirst30S === true) {
        this.keeALiveStatus = this.keepalive.isKeepALive();
        this.time5s = this.time5s + 5;
//        console.log("[ngOnInit home.page] every 5s", "seconds=", this.time5s, " this.keeALiveStatus", this.keeALiveStatus);
      }
    }, 5000);

/*******************************************************************************************
 * KeepAlive посылается (POST) каждую нечетную минуту и ожидается (GET) каждую четную минуту
 * flagOdMinute 
********************************************************************************************/
    setInterval(async ()=> {
      const isActive = this.isActiveApp();
      if (await isActive == true) {
//        console.log("[setInterval]: every 60s - ACTIVE");
        this.apiService.getApiCB('temperatureWeather', (result) => {this.weather_t_s = result['value'] });
        this.apiService.getApiCB('temperatureRoom', (result) => {this.room_t_s = result['value'].toString(10).substring(0, 4); });
        this.checkAllVals();
        this.flagOdMinute = !this.flagOdMinute;
        if (this.flagOdMinute === true) {
//          console.log("********* KEEPASS POST MINUTE")
          this.keepalive.postKeepALive();
        }else {
//          console.log("********* KEEPASS GET MINUTE")
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
          this.updateTimeTabelStatus();
          }
        },10000);      
      

  } // ngOnInit() finished

  updateFaultStatus() {
    this.apiService.getApiCB('faultStatus', (result) => {
      this.faultStatus = result['value'].toFixed(3) 
      if ( this.faultStatus != 0 ) {
        if ( this.globalVar.isFault == false) {
          this.smartAudio.play('faultBeep');
        }
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
        if ( (this.rangeVal != NaN) && (this.rangeVal != undefined)
          && (this.globalVar.mode != null) && (this.globalVar.mode != undefined)
          && (this.globalVar.mode != "") 
          && (this.comfortT != NaN) && (this.economT != NaN) 
          && (this.comfortT != undefined) && (this.economT != undefined) ) {
            this.apiService.postApi('updateTargetTemperature', {"id":"target_room_t", "value":this.rangeVal})
            this.timeTableService.updateTimeTable_mode(this.globalVar.mode, this.comfortT, this.economT);
            console.log("[home.page][checkAllVals] - !!!!!!!POST rangeVal !!! rangeval != targetTemperature; rangeVal=", this.rangeVal, "targetTemperature=", val);
            console.log("[home.page][checkAllVals] - !!!!!!!POST rangeVal !!! rangeval != targetTemperature; this.globalVar.mode=", this.globalVar.mode, "this.comfortT=", this.comfortT, "this.economT=",this.economT);
        }else {
          console.log("[home.page][checkAllVals] - !!!!!!!!!!!!!!!!!!!!!!!! rangeval != targetTemperature; rangeVal=", this.rangeVal, "targetTemperature=", val);
          console.log("[home.page][checkAllVals] - !!!!!!!!!!!!!!!!!!!!!!!! rangeval != targetTemperature; this.globalVar.mode=", this.globalVar.mode, "this.comfortT=", this.comfortT, "this.economT=",this.economT);
        }
      }
    });
  }

  public getMode(opt) { // opt - for debug, to find out who call it
    this.timeTableService.timeTableInit(false)
    this.globalVar.mode = this.timeTableService.getTimeTable_mode()
    console.log("[getMode] >>>>>>>>>>>>>>---->>>>>>>> opt=", opt, "mode=", this.globalVar.mode);
    if ( this.globalVar.mode == "Comfort" ) { this.clickComfort() }
    if ( this.globalVar.mode == "Econom" ) { this.clickEconom() }
    if ( this.globalVar.mode == "TimeTable" ) { this.clickTimetable() }
    if ( this.globalVar.mode == "Range" ) { } // do nothing
  }

  initVars() {
    this.storage.get('targetT').then((val) => {
      if(val){ this.rangeVal = val }else{
        val = 22;
        this.rangeVal = val;
        this.storage.set('targetT', val);
//        console.log('[ngOnInit home.page.js]: targetT ', val)
      }
    });
    this.storage.get('comfortT').then((val) => {
      if(val){ this.comfortT = val }else{
        val = 22;
        this.comfortT = val;
        this.storage.set('comfortT', val);
//        console.log('[ngOnInit home.page.js]: comfortT ', val)
      }
    });
    this.storage.get('economT').then((val) => {
      if(val){ this.economT = val }else{
        val = 22;
        this.economT = val;
        this.storage.set('economT', val);
//        console.log('[ngOnInit home.page.js]: economT ', val)
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

  toTutorial() {
    this.router.navigate(['tutorial']);  
  }
  async updateRange() {
    let val = await this.storage.get('targetT');
    console.log("<<<<<<< updateRange]val  this.rangeVal", val, this.rangeVal);
    if ( (val  === this.rangeVal)  || ( this.rangeVal === NaN ) ) {
        // do nothing
    }else {   
      this.storage.set('targetT', this.rangeVal);
      this.apiService.postApi('updateTargetTemperature', {"id":"target_room_t", "value":this.rangeVal})
      
      if ( (this.rangeVal === this.comfortT * 10) || (this.rangeVal === this.economT * 10) ) {
        // do nothing because this is OR Comfort OR Econom
      }else {
        this.isFillComfort = "outline"
        this.isFillEconom = "outline"
        this.isFillTimetable = "outline"
        this.globalVar.mode = "Range"
        console.log("updateRange() mode=>>>>>>> this.globalVar.mode, this.rangeVal, this.comfortT, this.economT >>>>>>>>>>>>>", this.globalVar.mode, this.rangeVal, this.comfortT*10, this.economT*10)
        this.timeTableService.updateTimeTable_mode(this.globalVar.mode, this.comfortT, this.economT);
      }  
    }
  }

  clickComfort() {
    this.storage.get('comfortT').then((val) => {
//      console.log('[clickComfort]: comfortT is', val)
      this.rangeVal = (val == null)? 22.5 * 10 : val * 10
      this.globalVar.mode = "Comfort"
      console.log("clickComfort() mode=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.globalVar.mode)
      this.timeTableService.updateTimeTable_mode(this.globalVar.mode, this.comfortT, this.economT);
    });
    setTimeout(()=> {
      this.globalVar.mode = "Comfort"
      console.log("clickComfort() mode=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.globalVar.mode)
      console.log("clickComfort() mode=>>>>>>> this.globalVar.mode, this.rangeVal, this.comfortT, this.economT >>>>>>>>>>>>>", this.globalVar.mode, this.rangeVal, this.comfortT*10, this.economT*10)
      this.timeTableService.updateTimeTable_mode(this.globalVar.mode, this.comfortT, this.economT);
      this.isFillComfort = "solid"
      this.isFillEconom = "outline"
      this.isFillTimetable = "outline"
//      console.log("clickComfort()")
      }, 500);
  }

  clickEconom() {
    this.storage.get('economT').then((val) => {
//      console.log('[clickEconom]: economT is', val)
      this.rangeVal = (val == null)? 18.5 * 10 : val * 10
      this.globalVar.mode = "Econom"
      console.log("clickEconom() mode=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.globalVar.mode)
      this.timeTableService.updateTimeTable_mode(this.globalVar.mode, this.comfortT, this.economT);
    });
    setTimeout(()=> {
      this.globalVar.mode = "Econom"
      console.log("clickEconom() mode=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.globalVar.mode)
      this.timeTableService.updateTimeTable_mode(this.globalVar.mode, this.comfortT, this.economT);
      this.isFillComfort = "outline"
      this.isFillEconom = "solid"
      this.isFillTimetable = "outline"
//      console.log("clickEconom()")
      }, 500);
  }

  clickTimetable() {
    this.isFillComfort = "outline"
    this.isFillEconom = "outline"
    this.isFillTimetable = "solid"
    setTimeout(()=> {
      this.globalVar.mode = "TimeTable"
      this.timeTableService.updateTimeTable_mode(this.globalVar.mode, this.comfortT, this.economT);
      this.updateTimeTabelStatus();
      console.log('[clickTimetable]: TartetT is', this.rangeVal)
      this.timeTableService.postTimeTable(this.comfortT, this.economT);
      console.log("clickTimetable() mode=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.globalVar.mode)
      this.isFillComfort = "outline"
      this.isFillEconom = "outline"
      this.isFillTimetable = "solid"
//      console.log("clickTimetable()")
      }, 500);
  }

  updateTimeTabelStatus() {
    this.globalVar.mode = this.timeTableService.getTimeTable_mode()
    this.storage.get('comfortT').then((val) => {
      this.comfortT = val
      this.storage.get('economT').then((val) => {
        this.economT = val
      });
    });
    if (this.globalVar.mode === "TimeTable") {
      if (this.timeTableService.targetIsComfort() === true ) {
        this.rangeVal = this.comfortT * 10
      }else{
        this.rangeVal = this.economT * 10
      }
      console.log("[updateTimeTabelStatus] ->->->->->->->->-> this.rangeVal", this.rangeVal, this.globalVar.mode );
    }
  }

  refresherAction(event) {
    this.keeALiveStatus = this.keepalive.isKeepALive();
    this.refreshAll();
//    console.log("[refresherAction] ->->->->->->->->-> ");
    if (event) {
      event.target.complete();
    }
  }
 
}

