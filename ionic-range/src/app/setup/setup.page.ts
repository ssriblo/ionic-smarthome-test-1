import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {
  comfortInpVal: number = 22.5;
  economInpVal: number = 18;
  private alertController = new AlertController()
  
  public data: any = {
    server: 'local',
    display: "локальный"
  };


  onChangeHandler($event) {
    this.data.server = $event.target.value;
    if (this.data.server == 'local') {
      this.data.display = "локальный"
    }else {
      this.data.display = "облачный"
    }
    console.log("[onChangeHandler]", this.data.server)
  }

  public setServerOption(optLocal: boolean) {
    if (optLocal == true) {
      this.data.server = 'local'
      this.data.display = "локальный"
    }else {
      this.data.server = 'cloud'
      this.data.display = "облачный"
    }
  }
  constructor( 
    public router: Router, 
    private storage: Storage,
    private apiService: ApiService,
    ) { }

  ngOnInit() {
    this.getComfortT();
    this.getEconomT();
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

  timetableSetup() {
    // if (this.data.server == 'cloud') {
    //   this.data.server = 'local'
    //   this.data.display = "локальный"
    // }else {
    //   this.data.server = 'cloud'
    //   this.data.display = "облачный"
    // }
  }

  deregistered() {
    this.apiService.removeJwt().then(val => {
//    this.storage.remove('jwtString').then(val => { 
      console.log('[deregistered]: remove jwtString from Local Store', val)
      this.presentAlert();
      // this.apiService.isJWT = false;
      // this.router.navigate(['introduction']) 
    });
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      animated: true,
      backdropDismiss: true,
      header: 'Внимание',
      message: 'Вы уверены, что надо удалить текущую регистрацию? Это действие нельзя будет отменить!" ',
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Новая регистрация',
          handler: () => {
            console.log('New Registration clicked');
            this.apiService.isJWT = false;
            this.router.navigate(['introduction'])       
          }
        }
      ]
    });
    await alert.present();
  }
}
