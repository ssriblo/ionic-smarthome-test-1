import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { GlobalService } from "../services/global.service";

@Injectable({
  providedIn: 'root'
})
export class TimetableService {


  constructor(
    private storage: Storage,
    private apiService: ApiService,
    private globalVar: GlobalService,

    ) { 
      this.timeTableInit(false);
  }

  public timeTableInit(isCleared: boolean) {
    if (isCleared === true) {
      this.storage.remove('modeComfEconTime')
      this.storage.remove('tt_vals')
      this.storage.remove('tt_days')
      this.storage.remove('tt_active')
    }
    this.globalVar.mode = this.getTimeTable_mode();
    this.globalVar.tt_vals = this.getTimeTable_vals();
    this.globalVar.tt_days = this.getTimeTable_days();
    this.globalVar.tt_active = this.getTimeTable_active();
  }

  public getTimeTable_mode() { 
    this.storage.get('modeComfEconTime').then((val) => {
      if(val){ 
        this.globalVar.mode = val 
      }else{
        this.storage.set('modeComfEconTime', this.globalVar.mode);
      }
    }); 
    return this.globalVar.mode
  }

  public getTimeTable_vals() { 
    this.storage.get('tt_vals').then((val) => {
      if(val){ this.globalVar.tt_vals = val }else{
        this.storage.set('tt_vals', this.globalVar.tt_vals);
      }
    }); 
    return this.globalVar.tt_vals;
  }     
    
  public getTimeTable_days() { 
    this.storage.get('tt_days').then((val) => {
      if(val){ this.globalVar.tt_days = val }else{
        this.storage.set('tt_days', this.globalVar.tt_days);
      }
    }); 
    return this.globalVar.tt_days;
  }     

  public getTimeTable_active() { 
    this.storage.get('tt_active').then((val) => {
      if(val){ this.globalVar.tt_active = val }else{
        this.storage.set('tt_active', this.globalVar.tt_active);
      }
    }); 
    return this.globalVar.tt_active;
  } 

  public updateTimeTable_mode(val:string, val_comfort: number, val_econom: number) { 
    this.storage.set('modeComfEconTime', val);
    this.globalVar.mode = val; 
    this.postTimeTable(val_comfort, val_econom); // this POST only for "mode". Let move POST MODE to another call in the future!!
  }
   public updateTimeTable_vals(val) { 
    this.storage.set('tt_vals', val);
    this.globalVar.tt_vals = val; 
  }
  public updateTimeTable_days(val) { 
    this.storage.set('tt_days', val);
    this.globalVar.tt_days = val;
  }
  public updateTimeTable_active(val) { 
    this.storage.set('tt_active', val);
    this.globalVar.tt_active = val;
  }

  public targetIsComfort(): boolean {
    this.timeTableInit(false);
    var today = new Date();
    var day = (today.getDay())
    var hour = (today.getHours())
//    console.log(today, day, hour);
    let isTargetComfort = false;
    let i = 0;
    for (let interwal of this.globalVar.tt_days) {
      if (this.globalVar.tt_days[i][day-1] === true) { // day=1...7 but tt_days[i][0...6]
//        console.log("dump", i, hour, day, this.globalVar.tt_vals[i]['start'], this.globalVar.tt_vals[i]['end'])
        if ( ( hour >= this.globalVar.tt_vals[i]['start'] )  && ( hour < this.globalVar.tt_vals[i]['end'] ) ) {
          isTargetComfort = true;
          break;
        }
      }
      i=i+1
    }
//    console.log("[targetIsComfort] isTargetComfort", isTargetComfort);
    return isTargetComfort;
  } // targetIsComfort()

  postTimeTable(val_comfort: number, val_econom: number) {
    this.timeTableInit(false);
    
    // нехорошо, что ComrtT/EconomT хранятся не так, как TimeTable. Лучше все привести к единому виду. Пока как есть...
    let valC = val_comfort * 10;
    let valE = val_econom * 10;
//    console.log("[postTimeTable] val_comfort  vaval_economlE", val_comfort, val_econom)
    this.apiService.postApi('updateTimeTable', {
      "id":"timetable", 
      "mode": this.globalVar.mode,
      "comf_0": (valC & 0xff),
      "comf_1": (valC & 0xff00) >> 8,
      "econ_0": (valE & 0xff),
      "econ_1": (valE & 0xff00) >> 8,
      'reserve': 0, // TBD, let setup now and will modify in future
      "status": 0,  // TBD, let setup now and will modify in future
      "tt_vals": [
        { "start":this.globalVar.tt_vals[0]['start'], "end":this.globalVar.tt_vals[0]['end']  },
        { "start":this.globalVar.tt_vals[1]['start'], "end":this.globalVar.tt_vals[1]['end']  },
        { "start":this.globalVar.tt_vals[2]['start'], "end":this.globalVar.tt_vals[2]['end']  },
      ],
      "tt_days": [ 
        [ this.globalVar.tt_days[0][0], this.globalVar.tt_days[0][1], this.globalVar.tt_days[0][2], 
          this.globalVar.tt_days[0][3], this.globalVar.tt_days[0][4], this.globalVar.tt_days[0][5], this.globalVar.tt_days[0][6]
        ],
        [ this.globalVar.tt_days[1][0], this.globalVar.tt_days[1][1], this.globalVar.tt_days[1][2], 
          this.globalVar.tt_days[1][3], this.globalVar.tt_days[1][4], this.globalVar.tt_days[1][5], this.globalVar.tt_days[1][6]
        ],
        [ this.globalVar.tt_days[2][0], this.globalVar.tt_days[2][1], this.globalVar.tt_days[2][2], 
          this.globalVar.tt_days[2][3], this.globalVar.tt_days[2][4], this.globalVar.tt_days[2][5], this.globalVar.tt_days[2][6]
        ],
      ],
    
    }) // postApi()
  } // postTimeTable

}
