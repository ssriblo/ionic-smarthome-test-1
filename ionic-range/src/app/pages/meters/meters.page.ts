import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../services/api.service';
import { Plugins } from '@capacitor/core';

const { App } = Plugins;

@Component({
  selector: 'app-meters',
  templateUrl: './meters.page.html',
  styleUrls: ['./meters.page.scss'],
})
export class MetersPage implements OnInit {
  electroMeterT1: number;
  electroMeterT2: number;
  warmMeter:number;
  waterColdMeter:number;
  waterHotMeter:number;

  constructor(
    public router: Router,
    private storage: Storage,
    private apiService: ApiService,

  ) { }

  ngOnInit() {

    setTimeout(()=> {
//      console.log("[setTimeout]: after 5s");
      this.apiService.getApiCB('electroMeterT1', (result) => {this.electroMeterT1 = result['value'].toFixed(2) });
      this.apiService.getApiCB('electroMeterT2', (result) => {this.electroMeterT2 = result['value'].toFixed(2) });
      this.apiService.getApiCB('warmMeter', (result) => {this.warmMeter = result['value'].toFixed(2) });
      this.apiService.getApiCB('waterColdMeter', (result) => {this.waterColdMeter = result['value'].toFixed(2) });
      this.apiService.getApiCB('waterHotMeter', (result) => {this.waterHotMeter = result['value'].toFixed(2) });
    }, 50);

    setInterval(async ()=> {
      const isActive = this.isActiveApp();
      if (await isActive == true) {
//        console.log("[setInterval]: every 60s - ACTIVE");
        this.apiService.getApiCB('electroMeterT1', (result) => {this.electroMeterT1 = result['value'].toFixed(2) });
        this.apiService.getApiCB('electroMeterT2', (result) => {this.electroMeterT2 = result['value'].toFixed(2) });
        this.apiService.getApiCB('warmMeter', (result) => {this.warmMeter = result['value'].toFixed(2) });
        this.apiService.getApiCB('waterColdMeter', (result) => {this.waterColdMeter = result['value'].toFixed(2) });
        this.apiService.getApiCB('waterHotMeter', (result) => {this.waterHotMeter = result['value'].toFixed(2) });
      }else {
//        console.log("[setInterval]: every 60s - NOT ACTIVE");
      }
      },60000);       
  } // ngOnInit() finished

  async isActiveApp() {
    return (await App.getState()).isActive
  }

  toHomePage() {
    this.router.navigate(['home']);  
  }
}
