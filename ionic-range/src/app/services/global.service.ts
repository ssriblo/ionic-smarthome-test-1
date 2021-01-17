import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() { }
  public GlobalTestOption: string [];
  public readonly GlobalAlertKey: string = "ALERTS_KEY_23550";
  public isAlert: boolean = false;
  public testBit_1: boolean = false;
  public testBit_2: boolean = false;
  public isKeepAliveGood: boolean = false; // true, if KeepAlive passed for all steps - servers, PCL
  public isKeepAliveActual: boolean = false; // ture, if KeepAlive POST/GET passed already
  public isFault: boolean = false; // if all bits of 'faultStatus' byte are Zero
  public isFlood: boolean = false;
  public isPowerFault: boolean = false;
  public isAirSensorFault: boolean = false;
  public isWaterSensorFault: boolean = false;

  mode:string = "Range"; // may be ["Timetable", "Comfort", "Econom", "Range"]
  tt_vals = [  // note: lineX - not used yet
    {line0: "0", start:0, end:1},
    {line1: "1", start:0, end:1},
    {line2: "2", start:0, end:1},
  ]
  tt_days = [
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
  ];
  // indicates that this TimeTable Interval has valid start/end hours and turn-on at some days
  tt_active = [false, false, false];
  // indicates that on of 3 TimeTable Intervals has valid start/end hours and turn-on at some days
  // tt_active_total = tt_active[0] OR tt_active[1] OR tt_active[2]
  tt_active_total = false; 

}
