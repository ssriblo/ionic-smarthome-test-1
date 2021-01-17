import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ApiService } from './services/api.service';
import { AuthGuardService } from './services/auth-guard.service';
import { SetupPage } from './setup/setup.page'
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { GlobalService } from "./services/global.service";
import { AlertsPage } from './pages/alerts/alerts.page';

import { SmartAudioService } from  './services/smart-audio.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot({
//      name: '__mydb',
//      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ApiService,
    AuthGuardService,
    SetupPage,
    OneSignal,
    GlobalService, 
    AlertsPage,
    SmartAudioService,
    NativeAudio,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
