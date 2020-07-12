import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {
  comfortInpVal: number = 22.5;
  economInpVal: number = 18;
  constructor( public router: Router, private storage: Storage) { }

  ngOnInit() {
    this.getComfortT();
    this.getEconomT();
  }
  toHomePage() {
    this.router.navigate(['home']);  
  }

  comfortInput() {
    this.updateComfortT(this.comfortInpVal);
    console.log(this.comfortInpVal, typeof this.comfortInpVal);
  }
  economInput() {
    this.updateEconomT(this.economInpVal);
    console.log(this.economInpVal)
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
}
