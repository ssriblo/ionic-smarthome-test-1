import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  tt_vals = [
    {line0: "0", start:0, end:0},
    {line1: "1", start:0, end:0},
    {line2: "2", start:0, end:0},
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

  private timeTableInit(isCleared: boolean) {
    if (isCleared === true) {
      this.storage.remove('tt_vals')
      this.storage.remove('tt_days')
      this.storage.remove('tt_active')
    }
    this.storage.get('tt_vals').then((val) => {
      console.log('[timeTableInit] tt_vals is', val);
      if(val){ this.tt_vals = val }else{
        this.storage.set('tt_vals', this.tt_vals);
        console.log('[timeTableInit]: tt_vals init', this.tt_vals)
      }
    }); 
    this.storage.get('tt_days').then((val) => {
      console.log('[timeTableInit] tt_days is', val);
      if(val){ this.tt_days = val }else{
        this.storage.set('tt_days', this.tt_days);
        console.log('[timeTableInit]: tt_days init', this.tt_days)
      }
    }); 
    this.storage.get('tt_active').then((val) => {
      console.log('[timeTableInit] tt_active is', val);
      if(val){ this.tt_active = val }else{
        this.storage.set('tt_active', this.tt_active);
        console.log('[timeTableInit]: tt_active init', this.tt_active)
      }
    }); 
  }

  getTimeTable_vals() { return this.tt_vals } 

  getTimeTable_days() { return this.tt_days }
  
  getTimeTable_active() { return this.tt_active }

  updateTimeTable_vals(val) { 
    this.storage.set('tt_vals', val);
    this.tt_vals = val; 
  }

  updateTimeTable_days(val) { 
    this.storage.set('tt_days', val);
    this.tt_days = val;
  }

  updateTimeTable_active(val) { 
    this.storage.set('tt_active', val);
    this.tt_active = val;
  }

}
