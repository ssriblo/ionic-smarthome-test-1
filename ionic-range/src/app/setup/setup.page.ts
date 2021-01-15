import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { GlobalService } from "../services/global.service";
import { StorageService, Item } from "../services/storage.service";
import {UUID} from 'uuid-generator-ts';
import { AlertsPage } from "../pages/alerts/alerts.page";
import { TimetableService } from "../services/timetable.service"
import { Platform } from '@ionic/angular';
import { SmartAudioService } from '../services/smart-audio.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html', 
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {
  public comfortInpVal  = 22.5;
  public economInpVal = 18;
  private alertController = new AlertController()
  testOption: string [] = this.globalVar.GlobalTestOption;
  isErrorInterval: boolean [] = [true, true, true];
  progress = 0;   
  ionicForm: FormGroup [];
  isSubmitted = false;

  constructor( 
    public router: Router, 
    private storage: Storage,
    public apiService: ApiService,
    public globalVar: GlobalService,
    private storageService: StorageService,
    private alertsPage: AlertsPage,
    private timeTableService: TimetableService,
    public platform:Platform,  
    public smartAudio: SmartAudioService,
    public formBuilder: FormBuilder,
    ) { }
    
  
  ionViewWillEnter() {
    // this.storage.get('modeComfEconTime').then((val) => {
    //   if(val){ 
    //     this.globalVar.mode = val 
    //   }else{
    //     this.storage.set('modeComfEconTime', this.globalVar.mode);
    //   }
    // }); 
    // return this.globalVar.mode
    // console.log("[setup.page ionViewWillEnter] mode=", this.globalVar.mode);
  }

  ionViewWillLeave() {
    // this.storage.get('modeComfEconTime').then((val) => {
    //   if(val){ 
    //     this.globalVar.mode = val 
    //   }else{
    //     this.storage.set('modeComfEconTime', this.globalVar.mode);
    //   }
    // }); 
    // return this.globalVar.mode
    // console.log("[setup.page ionViewWillEnter] mode=", this.globalVar.mode);
  }

  ngOnInit() {
    this.platform.ready().then(()=>{
      this.getTimeTable();
      this.getComfortT();
      this.getEconomT();

    setInterval( () => {  
      this.progress += .1;  
    }, 250 ); 

    setTimeout(()=> {
//        console.log("[setup.page ngOnInit]: after 5s");
        this.getTimeTable();
        this.getComfortT();
        this.getEconomT();
        console.log("setup.page >>>>>>> 2 seconds")
      }, 2000);
    }) 

    setInterval(async ()=> {
      // ToDo: add here re-calculate and change background color of the TimeTable Panel
      this.timeTableService.targetIsComfort() 
    },60000);   

    for (let j = 0; j < 3; j++) {
      this.ionicForm[j] = this.formBuilder.group({
        hours: ['', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-4])$')]],
      })
    }
  } // ngOnInit()

  getTimeTable() {
    this.timeTableService.timeTableInit(false)
    this.globalVar.tt_vals = this.timeTableService.getTimeTable_vals()
    this.globalVar.tt_days = this.timeTableService.getTimeTable_days()
    this.globalVar.tt_active = this.timeTableService.getTimeTable_active()
  }

  setTestOption() {
    let opt=this;
//    console.log('Test Option is:', opt.testOption);
    this.globalVar.GlobalTestOption = opt.testOption;
  }

  toHomePage() {
    this.router.navigate(['home']);  
  }

  updateComfortT() {
    if (this.comfortInpVal > 30) { 
      this.comfortInpVal = 30;
      console.log("[updateComfortT] this.comfortInpVal=", this.comfortInpVal)
    }
    if (this.comfortInpVal < 7) { this.comfortInpVal = 7; }
    this.storage.set('comfortT', this.comfortInpVal);
  }

  getComfortT() {
    this.storage.get('comfortT').then((val) => {
//      console.log('comfortT is', val);
      this.comfortInpVal = (val == null)? 22.5 : val
      return this.comfortInpVal;
    });  
  }

  updateEconomT() {
    if (this.economInpVal > 30) {this.economInpVal = 30};
    if (this.economInpVal < 7) {this.economInpVal = 7};
    this.storage.set('economT', this.economInpVal);
  }

  getEconomT() {
    this.storage.get('economT').then((val) => {
      this.economInpVal = (val == null)? 18.5 : val
//      console.log('economT is', val, this.economInpVal);
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
    this.smartAudio.play('faultBeep');

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
//            console.log('Cancel clicked');
          }
        },
        {
          text: 'Новая регистрация',
          handler: () => {
            this.apiService.removeJwt().then(val => {
//              console.log('[deregistered]: remove jwtString from Local Store', val)
              this.apiService.isJWT = false;
              this.router.navigate(['introduction'])       
            });
          }
        }
      ]
    });
    await alert.present();
  }
  
  dayToggle(i0:number, i1:number) {
    this.globalVar.tt_days[i0][i1] = !this.globalVar.tt_days[i0][i1]
    let res = false;
    for (let val of this.globalVar.tt_days[i0]) {
      if (val === true) {
        res = true;
        break;
      }
    }
    this.globalVar.tt_active[i0] = res;
//    console.log("dayToggle tt_active", i0, this.globalVar.tt_active[0], res)
    this.timeTableService.updateTimeTable_days(this.globalVar.tt_days)
    this.timeTableService.updateTimeTable_active(this.globalVar.tt_active)
    return res;
  }

  public async timeTableHelp() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      animated: true,
      backdropDismiss: true,
//        header: 'Помощь',
      message: '<p><b>Интервал расписания, в которм будет задана температура КОМФОРТ</b></p> \
        <ul><li>задается начальное и конечное время интервала (часы)</li> \
        <li> задаются дни недели, где этот интервал применим</li> \
        <li>вне интервалов будет задана температура ЭКОНОМ</li> \
        <li>левое поле - начальное время, правое поле - конечное время интервала</li> \
        <li>активный интервал выделяется цветом</li> \
        <li>начальный интервал времени не может быть больше 23</li> \
        <li>конечный интервал времени не может быть меньше 1 и больше 24</li> \
        <li>если начальный интервал равен конечному, то это нулевой интервал</li> \
        <li>для выбора суток полностью надо указать 0 - 24</li></ul>' ,
      buttons: [
        {
          text: 'ОК',
          role: 'cancel',
        },
      ]
    });
    await alert.present();
  }
  
  refresherAction(event) {
    if (event) {
      event.target.complete();
    }
  }
 
  submitFormStart(ind, formData: any) {
    console.log("[submitFormStart] formData", ind, formData, formData['hours']);
    this.isSubmitted = true;
    this.globalVar.tt_vals[ind].start = formData['hours']
    this.isErrorValidation(ind, !this.ionicForm[ind].valid)
  }

  submitFormEnd(ind, formData: any) {
    console.log("[submitFormEnd] formData", ind, formData, formData['hours']);
    this.isSubmitted = true;
    this.globalVar.tt_vals[ind].end = formData['hours']
    this.isErrorValidation(ind, !this.ionicForm[ind].valid)
  }

  isErrorValidation(ind:number, isError:boolean) {
    if (isError) {
      console.log('Please provide all the required values! ind=', ind)
      this.isErrorInterval[ind]=true
      return false;
    } else {
      console.log("[isErrorValidation] this.ionicForm[ind].value", this.ionicForm[ind].value, "ind=", ind)
      let start = this.globalVar.tt_vals[ind].start
      let end = this.globalVar.tt_vals[ind].end
      if (start < end) {
        this.isErrorInterval[ind]=false
        this.timeTableService.updateTimeTable_vals(this.globalVar.tt_vals)
      }
      if (start >= end) {this.isErrorInterval[ind]=true}
    }
  }

  timeTableSetup(ind, ) { // not used more
    let start = this.globalVar.tt_vals[ind].start
    let end = this.globalVar.tt_vals[ind].end
    if (start > 23) {start = 23}
    if (end > 24) {end = 24}
    if (start < 0) {start = 0}
    if (end < 1) {end = 1}
//    this.isErrorInterval[ind] = (start < end)? true : false
    if (start < end) {this.isErrorInterval[ind]=true}
    if (start >= end) {this.isErrorInterval[ind]=false}
//    console.log("[timetableSetup]", ind, this.globalVar.tt_vals[ind].start, this.globalVar.tt_vals[ind].end, this.isErrorInterval[ind])
    this.globalVar.tt_vals[ind].start = Math.round(start)
    this.globalVar.tt_vals[ind].end = Math.round(end)
    this.timeTableService.updateTimeTable_vals(this.globalVar.tt_vals)
  }

}
