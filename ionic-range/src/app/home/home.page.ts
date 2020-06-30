import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  rangeVal:string;
  weather_t_s:string = "0";
  room_t_s:string = "0";
  isFillComfort = "solid";
  isFillEconom = "outline";
  isFillTimetable = "outline";
  constructor(public platform:Platform) {
    this.platform.ready().then(()=>{
      this.rangeVal = "22";
    })
  }

  async postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
//        'Content-Type': 'text/html'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
//      body: {data} // body data type must match "Content-Type" header
});
    return await response.json(); // parses JSON response into native JavaScript objects
  }

 

 async fetch_fun() {
   let response = await fetch('http://127.0.0.1:8080/temperature/26');
   console.log(response.type)
   if (response.ok) { // если HTTP-статус в диапазоне 200-299
     // получаем тело ответа 
     let text = await response.text();
     console.log("TEXT RESPOSE: ",text)
   } else {
     alert("Ошибка HTTP: " + response.status);
   }
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
 //   this.fetch_fun()

 this.postData('http://127.0.0.1:8080/api/post_data', { target_t: this.rangeVal })
  .then((data) => {
      console.log('FROM SERVER: ', data); 
      console.log("ROOM t=", data['room_temp'], "WEATHER t=", data["weather_temp"])
      this.room_t_s = data['room_temp']
      this.weather_t_s = data['weather_temp']
    });
  
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

