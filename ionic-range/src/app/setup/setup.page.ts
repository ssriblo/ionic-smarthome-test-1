import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { IonRadioGroup } from '@ionic/angular';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {
  comfortInpVal: number = 22.5;
  economInpVal: number = 18;
  private alertController = new AlertController()
  
//  @ViewChild('radioGroup') radioGroup: IonRadioGroup
   radioGroup: IonRadioGroup

  private selectedRadioGroup:any;
  private selectedRadioItem:any;
  
  radio_list = [
    {
      id: '1',
      name: 'radio_list',
      value: 'local',
      text: 'Локальный',
      disabled: false,
      checked: false,
      color: 'primary'
    }, {
      id: '2',
      name: 'radio_list',
      value: 'cloud',
      text: 'Облачный',
      disabled: false,
      checked: true,
      color: 'secondary'
    }
  ];

  radioGroupChange(event) {
    console.log("radioGroupChange",event.detail);
    this.selectedRadioGroup = event.detail;
  }

  radioFocus() {
    console.log("radioFocus");
  }
  radioSelect(event) {
    console.log("radioSelect",event.detail);
    this.selectedRadioItem = event.detail;
  }
  radioBlur() {
    console.log("radioBlur");
  }

  constructor( 
    public router: Router, 
    private storage: Storage,
    private apiService: ApiService,
    ) { }

  ngOnInit() {
    this.getComfortT();
    this.getEconomT();
//    this.radioGroup.value = 'local' // cause of error...
  }

  toHomePage() {
    this.router.navigate(['home']);  
  }

  comfortInput() {
    this.updateComfortT(this.comfortInpVal);
  }
  economInput() {
    this.updateEconomT(this.economInpVal);
  }

  updateComfortT(val) {
    this.storage.set('comfortT', val);
  }

  getComfortT() {
    this.storage.get('comfortT').then((val) => {
      console.log('comfortT is', val);
      this.comfortInpVal = val;
    });  
  }

  updateEconomT(val) {
    this.storage.set('economT', val);
  }

  getEconomT() {
    this.storage.get('economT').then((val) => {
      console.log('economT is', val);
      this.economInpVal = val;
    });  
  }
  deregistered() {
    this.apiService.removeJwt().then(val => {
//    this.storage.remove('jwtString').then(val => { 
      console.log('[deregistered]: remove jwtString from Local Store', val)
      this.apiService.isJWT = false;
      this.router.navigate(['introduction']) 
    });
  }

}
