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
import { environment } from '../../../environments/environment';


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
    ).then(async barcodeData => { 
      this.storage.set('jwtString', barcodeData.text)
      .then(async val => {
        console.log('[signup.scan_qr] Barcode data stored at LocalStorage', barcodeData);
        // Let reload app from scratch. It cause to re-read JWT and rout to home page and so on...
        document.location.href = 'index.html';
      })
    });
  }

  public jwtWithoutScan() {
    // for TEST only - load JWT test setup from hardcode without QR scanning
    this.storage.set( 'jwtString', environment.JWT_DEFAULT )
      .then(async val => {
        console.log('[signup.jwtWithoutScan]: Forse store default JWT Token at Local Store')
        // Let reload app from scratch. It cause to re-read JWT and rout to home page and so on...
        document.location.href = 'index.html';
      })

  }  
}
