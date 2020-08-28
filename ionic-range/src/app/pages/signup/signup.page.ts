import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  data: any;

  constructor(
      private modalCtrl: ModalController,
      private auth: AuthService,
      private loadingController: LoadingController,
      private alertController: AlertController,
      private router: Router,
      private barcodeScanner: BarcodeScanner,
      private storage: Storage,
      private apiService: ApiService,
      ) {}

  ngOnInit() {}

//  continue() {}

  // async signUp() {
  //   const loading = await this.loadingController.create();
  //   await loading.present();


  //   // send token to server and obtain response:
  //   this.auth.jwtSignup(
  //       this.data
  //     )
  //     .then(
  //       (res) => {
  //         loading.dismiss();
  //         this.close();
  //         this.router.navigateByUrl('/app');
  //       },
  //       async (err) => {
  //         loading.dismiss();
  //         const alert = await this.alertController.create({
  //           header: 'Sign up failed',
  //           message: err.message,
  //           buttons: ['OK'],
  //         });

  //         await alert.present();
  //       }
  //     );
  // }

  close() {
    this.modalCtrl.dismiss();
  }  
  

  scan_qr() {
//    this.data = null;
    this.barcodeScanner.scan(
      {
        preferFrontCamera : false, // iOS and Android
        showFlipCameraButton : true, // iOS and Android
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
//          saveHistory: true, // Android, save scan history (default false)
        prompt : "НАВЕДИТЕ КАМЕРУ НА QR КОД", // Android
        resultDisplayDuration: 1500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
        orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations : true, // iOS
        disableSuccessBeep: false // iOS and Android
    }
    ).then(barcodeData => {
//      console.log('Barcode data', barcodeData);
//      this.data = barcodeData;
      // TODO: crate api.servises and call GET request to check obtained QR code - JWT Token
      // Let setn API GET request - let it be weater. If response will be 200 - it's ok, then this QR code is good
      let res = this.apiService.testJwtViaGetRequest('temperatureWeather')
      if (res != null) {
        this.storage.set('jwtString', barcodeData.text);
        console.log('[SignupPage.scan_qr()] JWT test passed well');
      }
    
    }).catch(err => {
      console.log('[SignupPage.scan_qr] Error', err);
    });

  }

  

}
