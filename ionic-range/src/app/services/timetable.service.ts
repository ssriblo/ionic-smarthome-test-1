import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  tt_vals = [
    {line0: "0", start:0, end:1},
    {line1: "1", start:0, end:1},
    {line2: "2", start:0, end:1},
  ]

  tt_days = [
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
  ];
  
  tt_active = [false, false, false];

  constructor(
    private storage: Storage,
    ) { 
      this.timeTableInit(false);
  }

  public timeTableInit(isCleared: boolean) {
    if (isCleared === true) {
      this.storage.remove('tt_vals')
      this.storage.remove('tt_days')
      this.storage.remove('tt_active')
    }
    this.storage.get('tt_vals').then((val) => {
//      console.log('[timeTableInit] tt_vals is', val);
      if(val){ this.tt_vals = val }else{
        this.storage.set('tt_vals', this.tt_vals);
        console.log('[timeTableInit]: tt_vals init', this.tt_vals)
      }
    }); 
    this.storage.get('tt_days').then((val) => {
//      console.log('[timeTableInit] tt_days is', val);
      if(val){ this.tt_days = val }else{
        this.storage.set('tt_days', this.tt_days);
        console.log('[timeTableInit]: tt_days init', this.tt_days)
      }
    }); 
    this.storage.get('tt_active').then((val) => {
//      console.log('[timeTableInit] tt_active is', val);
      if(val){ this.tt_active = val }else{
        this.storage.set('tt_active', this.tt_active);
        console.log('[timeTableInit]: tt_active init', this.tt_active)
      }
    }); 
  }

  public getTimeTable_vals() { return this.tt_vals } 

  public getTimeTable_days() { return this.tt_days }
  
  public getTimeTable_active() { return this.tt_active }

  public updateTimeTable_vals(val) { 
    this.storage.set('tt_vals', val);
    this.tt_vals = val; 
  }

  public updateTimeTable_days(val) { 
    this.storage.set('tt_days', val);
    this.tt_days = val;
  }

  public updateTimeTable_active(val) { 
    this.storage.set('tt_active', val);
    this.tt_active = val;
  }

  public targetIsComfort(): boolean {
    var today = new Date();
    var day = (today.getDay())
    var hour = (today.getHours())
//    console.log(today, day, hour);
    let isTargetComfort = false;
    let i = 0;
    for (let interwal of this.tt_days) {
      if (this.tt_days[i][day-1] === true) { // day=1...7 but tt_days[i][0...6]
        console.log("dump", i, hour, day, this.tt_vals[i]['start'], this.tt_vals[i]['end'])
        if ( ( hour >= this.tt_vals[i]['start'] )  && ( hour < this.tt_vals[i]['end'] ) ) {
          isTargetComfort = true;
          break;
        }
      }
      i=i+1
    }
    console.log("[targetIsComfort] isTargetComfort", isTargetComfort);
    return isTargetComfort;
  } // targetIsComfort()
}
