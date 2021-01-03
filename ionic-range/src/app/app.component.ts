import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './services/api.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';
import { environment } from './../environments/environment';
import { SetupPage } from './setup/setup.page';
import { AlertsPage} from './pages/alerts/alerts.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
//  providers: [ApiService],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
    private setupPage: SetupPage,
    private alertsPage: AlertsPage,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      setTimeout(()=> {
//        console.log('>>>>>>>>>>>>>>> after 10s >>>>>>>>>>>>>>>>>>>>> ONESIGNAL_APP_ID ANDROID_ID', environment.ONESIGNAL_APP_ID, environment.ANDROID_ID);
        if (this.platform.is('cordova')) {
          this.setupPush();
        }
      }, 10000);


    });
  }

  setupPush() {
    //    this.oneSignal.startInit('YOUR ONESIGNAL APP ID', 'YOUR ANDROID ID');
    // Beginners tip: 'YOUR ANDROID ID' is called the "Sender ID" in Firebase and "Google Project Number" in some other documentation
    // this.oneSignal.startInit('8a1db084-b465-4cf6-8e12-22d38f8c9a14', '116945727421');
    this.oneSignal.startInit(environment.ONESIGNAL_APP_ID, environment.ANDROID_ID);
 
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
 
    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
      let colorEv = ""
      if ( msg.includes("нет") || (msg.includes("норме"))) {
        colorEv = "success";
      } else {
        colorEv = "danger"
      }
      this.alertsPage.addAlert(1, msg, colorEv)
// addAlert(1, 'ПРОТЕЧКА', "danger");
// addAlert(1, 'Протечки нет', "success");
// addAlert(2, 'НЕТ ЭЛЕКТРОЭНЕРГИИ', "warning");
// addAlert(2, 'Электроэнергия в норме', "success");
// addAlert(3, 'АВАРИЯ ДАТЧИКА', "tertiary");
// addAlert(3, 'Датчик в норме', "success");
    });
 
    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;
 
      this.showAlert('ВНИМАНИЕ', 'повтор:', additionalData.task);
    });
 
    this.oneSignal.endInit();
  }
 
  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `OK`,
          handler: () => {
            // E.g: Navigate to a specific screen
          }
        }
      ]
    })
    alert.present();
  }

}
