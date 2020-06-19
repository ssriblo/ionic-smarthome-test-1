import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  rangeVal:string;
  isFillComfort = "solid";
  isFillEconom = "outline";
  isFillTimetable = "outline";
  constructor(public platform:Platform) {
    this.platform.ready().then(()=>{
      this.rangeVal = "22";
    })
  }

  updateRange() {
    if ((this.rangeVal != "22") && (this.rangeVal != "18")) {
      this.isFillComfort = "outline"
      this.isFillEconom = "outline"
    }
    if (this.rangeVal == "22" ) {
      this.isFillComfort = "solid"
    }
    if (this.rangeVal == "18" ) {
      this.isFillEconom = "solid"
    }
    console.log('update rangeVal', this.rangeVal, this.isFillComfort, this.isFillEconom)
  }

  isDisabledTimetable = true

  clickComfort() {
    console.log('click Comfort')
    this.isFillComfort = "solid"
    this.isFillEconom = "outline"
    this.rangeVal = "22";
  }

  clickEconom() {
    console.log('click Econom')
    this.isFillComfort = "outline"
    this.isFillEconom = "solid"
    this.rangeVal = "18";
  }

  clickTimetable() {
    console.log('click Timetable')

  }
}

