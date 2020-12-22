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
  mode:string = ""; // may be ["Timetable", "Comfort", "Econom"]
  tt_vals:any;
  tt_days:any;
  tt_active:any;
  progress = 0;   


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
      console.log("[setTimeout]: after 5s");
      this.apiService.getApiCB('temperatureWeather', (result) => {this.weather_t_s = result['value'] });
      this.apiService.getApiCB('temperatureRoom', (result) => {this.room_t_s = result['value'].toString(10).substring(0, 4); });
      this.getMode();
      this.getTimeTable();
    }, 2500);

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

