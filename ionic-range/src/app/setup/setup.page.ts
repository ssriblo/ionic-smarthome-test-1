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
  }
  toHomePage() {
    this.router.navigate(['home']);  
  }

  comfortInput() {
    this.updateComfortT(this.comfortInpVal);
    console.log(this.comfortInpVal, typeof this.comfortInpVal);
  }
  economInput() {
    console.log(this.economInpVal)
  }

  updateComfortT(val) {
    this.storage.set('comfortT', val);

  }

  getComfortT() {
    // Or to get a key/value pair
    this.storage.get('comfortT').then((val) => {
      console.log('comfortT is', val, typeof val);
      this.comfortInpVal = val;
    });  
  }
}
