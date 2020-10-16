import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, Item } from "../../services/storage.service";
import { GlobalService } from "../../services/global.service";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
})
export class AlertsPage implements OnInit {
  items: Item[];

  constructor(
    public router: Router,
    private storageService: StorageService,
    public globalVar: GlobalService,
  ) {}

  ngOnInit() {
    this.storageService.getItem(this.globalVar.GlobalAlertKey ).then(i => {
      this.items = i;
//      console.log('[aletrs.page.ngOnInit()]', this.items, this.items.length);
    }

    )

  }


  addAlert(alertEvent: Item) {
  }

  toHomePage() {
    this.router.navigate(['home']);  
  }
}
