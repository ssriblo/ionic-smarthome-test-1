import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Alert {
  timestamp: string;
  title: string;
  text: string;
  level: number;
}

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
})
export class AlertsPage implements OnInit {
  alertList: Alert [] = [
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Нет электроэнергии', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Авария датчика', level: 1},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
    {timestamp: "2012-12-15T13:47:20.789", title: 'Авария', text: ' Протечка в квартире', level: 0},
  ];

  constructor(
    public router: Router,
  ) {}

  ngOnInit() {
  }


  addAlert(alertEvent: Alert) {

  }

  toHomePage() {
    this.router.navigate(['home']);  
  }
}
