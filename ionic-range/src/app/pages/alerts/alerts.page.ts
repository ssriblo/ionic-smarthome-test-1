import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, Item } from "../../services/storage.service";
import { GlobalService } from "../../services/global.service";
import { NgZone } from "@angular/core";
import {UUID} from 'uuid-generator-ts';

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
    private globalVar: GlobalService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.storageService.getItem(this.globalVar.GlobalAlertKey ).then(i => {
      this.items = i;
      if (this.items != null) {
//        console.log('[aletrs.page.ngOnInit()]', this.items, this.items.length);
      }
    })
  }

  deleteAllAlerts() {
    this.storageService.deleteItem(this.globalVar.GlobalAlertKey).then(i => {
      this.items = i;
      this.updateAlerts();
    })
  }

  public async addAlert(typeItem: number, val: string, col: string) {
    const uuid = new UUID();
    let id = uuid.getDashFreeUUID();
    let currDate =new Date().toISOString();  
//    console.log('CURRENT DATE', currDate, id);
    let item: Item = {
      value: val,
      timestamp: currDate,
      id: id,
      level: 1,
      type: typeItem,
      color: col,
      }
    await this.storageService.addItem(this.globalVar.GlobalAlertKey, item );
    this.storageService.getItem(this.globalVar.GlobalAlertKey ).then(i => {
      this.items = i;
//      console.log('[aletrs.page.addAlert()]', this.items, this.items.length);
    })
    this.updateAlerts();
  }

  public updateAlerts() {
    this.storageService.getItem(this.globalVar.GlobalAlertKey ).then(i => {
      this.items = i;
      if (this.items != null) {
//        console.log('[aletrs.page.updateAlerts()]', this.items, this.items.length);
      }
    })    

    this.cdr.detectChanges(); // Try to fix refresh *ngFor for Alerts List at the Html Template alerts.page.html

    this.ngZone.run(() => {
      this.globalVar.isAlert = false; // Not used yet, let save just for case...
    }); 
  }

  toHomePage() {
    this.router.navigate(['home']);  
  }
}
