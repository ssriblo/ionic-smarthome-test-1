import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { GlobalService } from "../services/global.service";
import { StorageService, Item } from "../services/storage.service";
import {UUID} from 'uuid-generator-ts';
import { AlertsPage } from "../pages/alerts/alerts.page";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html', 
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {
  public comfortInpVal: number = 22.5;
  public economInpVal: number = 18;
  private alertController = new AlertController()
  testOption: string [] = this.globalVar.GlobalTestOption;
  titmetable_1_start: number = 0;
  titmetable_1_end: number = 0;
  titmetable_2_start: number = 0;
  titmetable_2_end: number = 0;
  titmetable_3_start: number = 0;
  titmetable_3_end: number = 0;
  tt_days = [
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
  ];
  tt_active = [false, false, false];

  constructor( 
    public router: Router, 
    private storage: Storage,
    public apiService: ApiService,
    public globalVar: GlobalService,
    private storageService: StorageService,
    private alertsPage: AlertsPage,
    ) { }

  ngOnInit() {
    this.getComfortT();
    this.getEconomT();
//    this.setServerOption(true);
    console.log('setup.page.ts - ngOnInit()', this.testOption)
  }

  setTestOption() {
    let opt=this;
    console.log('Test Option is:', opt.testOption);
    this.globalVar.GlobalTestOption = opt.testOption;
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
      this.comfortInpVal = (val == null)? 22.5 : val
      return this.comfortInpVal;
    });  
  }

  updateEconomT(val) {
    this.storage.set('economT', val);
  }

  getEconomT() {
    this.storage.get('economT').then((val) => {
      this.economInpVal = (val == null)? 18.5 : val
      console.log('economT is', val, this.economInpVal);
      return this.economInpVal
    });  
  }

  addAlert(typeItem: number, val: string, col: string) {
    this.alertsPage.addAlert(typeItem, val, col)
  }

  deleteAllAlerts() {
    this.alertsPage.deleteAllAlerts()
  }
  public async alertImitator() {

    // For TEST purpos only, need change to timetableSetup() for product!

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      animated: true,
      backdropDismiss: true,
      header: 'Выбери тип аварии:',
      buttons: [
        {
          text: 'ПРОТЕЧКА',
          handler: () => { this.addAlert(1, 'ПРОТЕЧКА', "danger"); }
        },
        {
          text: 'Протечки нет',
          handler: () => { this.addAlert(1, 'Протечки нет', "success"); }
        },
        {
          text: 'НЕТ ЭЛЕКТРОЭНЕРГИИ',
          handler: () => { this.addAlert(2, 'НЕТ ЭЛЕКТРОЭНЕРГИИ', "warning"); }
        },
        {
          text: 'Электроэнергия в норме',
          handler: () => { this.addAlert(2, 'Электроэнергия в норме', "success"); }
        },
        {
          text: 'ДАТЧИКА',
          handler: () => { this.addAlert(3, 'АВАРИЯ ДАТЧИКА', "tertiary"); }
        },
        {
          text: 'Датчик в норме',
          handler: () => { this.addAlert(3, 'Датчик в норме', "success"); }
        },
        {
          text: 'Удалить все сообщения',
          handler: () => { this.deleteAllAlerts(); }
        },
      ]
    });
    await alert.present();
  }

  deregistered() {
    this.presentAlert();
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
            this.apiService.removeJwt().then(val => {
              console.log('[deregistered]: remove jwtString from Local Store', val)
              this.apiService.isJWT = false;
              this.router.navigate(['introduction'])       
            });
          }
        }
      ]
    });
    await alert.present();
  }
  
  timeTableSetup() {

  }

  dayToggle(i0:number, i1:number) {
    this.tt_days[i0][i1] = !this.tt_days[i0][i1]
    let res = false;
    for (let val of this.tt_days[i0]) {
      if (val === true) {
        res = true;
        break;
      }
    }
    this.tt_active[i0] = res;
//    console.log("dayToggle tt_active", i0, this.tt_active[0], res)
    return res;
  }

  public async timeTableHelp() {
    // Alert page with help text
      //     Интервал расписания, в которм будет задана температура КОМФОРТ
      // - задается начальное и конечное время интервала (часы)
      // - задаются дни недели, где этот интервал применим
      // - вне интервалов будет задана температура ЭКОНОМ
      // - активный интервал выделяется цветом
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        animated: true,
        backdropDismiss: true,
//        header: 'Помощь',
        message: '<p><b>Интервал расписания, в которм будет задана температура КОМФОРТ</b></p> <ul><li>задается начальное и конечное время интервала (часы)</li> <li> задаются дни недели, где этот интервал применим</li> <li>вне интервалов будет задана температура ЭКОНОМ</li> <li> активный интервал выделяется цветом</li> </ul>',
        buttons: [
          {
            text: 'ОК',
            role: 'cancel',
          },
        ]
      });
      await alert.present();
    }

}
