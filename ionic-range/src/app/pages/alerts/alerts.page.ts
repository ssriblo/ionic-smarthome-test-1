import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, Item } from "../../services/storage.service";
import { GlobalService } from "../../services/global.service";
import { NgZone } from "@angular/core";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
})
export class AlertsPage implements OnInit {
  items: Item[];
  // Colors: https://ionicframework.com/docs/theming/basics
  // "primary", "secondary", "tertiary", "success", "warning", "danger", "light", "medium"

  constructor(
    public router: Router,
    private storageService: StorageService,
    public globalVar: GlobalService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.storageService.getItem(this.globalVar.GlobalAlertKey ).then(i => {
      this.items = i;
      console.log('[aletrs.page.ngOnInit()]', this.items, this.items.length);
    })
//    this.globalVar.isAlert = false;
    // this.ngZone.run(() => {
    //   this.globalVar.isAlert = false;
    // }); 

    setInterval(()=> {
      this.ngZone.run(() => {
        this.globalVar.isAlert = false;
      }); 
    },10000);
  }

  addAlert(alertEvent: Item) {
  }

  toHomePage() {
    this.router.navigate(['home']);  
  }
}
