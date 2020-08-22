import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Injectable()
export class AuthGuardService implements CanActivate {
  private storage = new Storage(null)
  private alertController = new AlertController()


  private async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      animated: true,
      backdropDismiss: true,
      header: 'Внимание',
//      subHeader: 'Subtitle',
      message: 'Сначала надо зарегистритоваться, для этого приготовьте QR код регистрации и нажмите кнопку "Регистрация" ',
      buttons: ['OK']
    });

    await alert.present();
  }

  canActivate() {
    this.storage.get('jwtString').then((val) => {
//      this.jwtString = val;
      console.log('[AuthGuardService] get jwtString from storage: ', val );  
      if (val) { 
        this.router.navigate(['home']) 
      }else {
        this.router.navigate(['introduction']) 
        this.presentAlert();

      }
    });

    console.log('AuthGuard#canActivate called');
    return true;
  }

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) { }
}