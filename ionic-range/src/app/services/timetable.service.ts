import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  mode:string = ""; // may be ["Timetable", "Comfort", "Econom"]

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
    private apiService: ApiService,
    ) { 
      this.timeTableInit(false);
  }

  public timeTableInit(isCleared: boolean) {
    if (isCleared === true) {
      this.storage.remove('mode')
      this.storage.remove('tt_vals')
      this.storage.remove('tt_days')
      this.storage.remove('tt_active')
    }
    this.storage.get('mode').then((val) => {
      //      console.log('[timeTableInit] mode is', val);
            if(val){ this.mode = val }else{
              this.storage.set('mode', this.mode);
              console.log('[timeTableInit]: mode init', this.mode)
            }
          }); 
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

  public getTimeTable_mode() { return this.mode } 
  public getTimeTable_vals() { return this.tt_vals } 
  public getTimeTable_days() { return this.tt_days }
  public getTimeTable_active() { return this.tt_active }

  public updateTimeTable_mode(val:string) { 
    this.storage.set('mode', val);
    this.mode = val; 
  }
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

  postTimeTable() {

    this.apiService.postApi('updateTimeTable', {
      "id":"timetable", 
      value: [
      {"mode": this.mode},
      {"tt_vals": [
        {"start":this.tt_vals[0]['start'], "end":this.tt_vals[0]['end']  },
        {"start":this.tt_vals[1]['start'], "end":this.tt_vals[1]['end']  },
        {"start":this.tt_vals[2]['start'], "end":this.tt_vals[2]['end']  },
      ]},
      {"tt_days": [ 
        [this.tt_days[0][0], this.tt_days[0][1], this.tt_days[0][2], 
          this.tt_days[0][3], this.tt_days[0][4], this.tt_days[0][5], this.tt_days[0][6]
        ],
        [this.tt_days[1][0], this.tt_days[1][1], this.tt_days[1][2], 
          this.tt_days[1][3], this.tt_days[1][4], this.tt_days[1][5], this.tt_days[1][6]
        ],
        [this.tt_days[2][0], this.tt_days[2][1], this.tt_days[2][2], 
          this.tt_days[2][3], this.tt_days[2][4], this.tt_days[2][5], this.tt_days[2][6]
        ],
      ]},
    ]
    })
  }

}
