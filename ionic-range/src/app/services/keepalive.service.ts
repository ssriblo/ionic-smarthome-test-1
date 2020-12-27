import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { GlobalService } from "../services/global.service";
import { AlertController } from '@ionic/angular';

export interface KeepAliveStatus {
  plc:boolean, 
  opcua:boolean, 
  api:boolean,
}

interface KeepAliveACK {
  plc:number,
  opcua:number,
  api:number,
}
 
@Injectable({
  providedIn: 'root'
})
export class Keepalive {
  private tkn:number;
  private alertController = new AlertController()
  statusApiServer = "НЕТ СВЯЗИ";
  statusOpcuaServer = "НЕТ СВЯЗИ";
  statusPLC = "НЕТ СВЯЗИ";

  constructor(
    private apiService: ApiService,
    public globalVar: GlobalService,
  ) { }

  public postKeepALive() {
    // generate random token "tkn" - 4 bytes/32bits number
    this.tkn = this.randomInt(0, 0x7fffffff);
    this.apiService.postApi("keepAliveSendToken", {"token":this.tkn});
  }

  public isKeepALive():KeepAliveStatus {
    let res: KeepAliveStatus = {
      plc: false,
      opcua: false,
      api: false,
    }

    this.apiService.getApiCB("keepAliveReceive", (result:KeepAliveACK) => {
        console.log("[isKeepALive] result=", result, this.tkn)
        const FAILSERVER = "НЕТ СВЯЗИ";
        const GOODSERVER = "НОРМА";

        if (this.tkn === result.plc) { 
          res.plc = true; 
          this.statusPLC = GOODSERVER;
        }else {
          res.plc = false; 
          this.statusPLC = FAILSERVER;
        }
        if (this.tkn === result.opcua) { 
          res.opcua = true; 
          this.statusOpcuaServer = GOODSERVER;
        }else {
          res.opcua = false; 
          this.statusOpcuaServer = FAILSERVER;
        }
        if (this.tkn === result.api) { 
          res.api = true; 
          this.statusApiServer = GOODSERVER;
        }else {
          res.api = false; 
          this.statusApiServer = FAILSERVER;
        }
        if ( res.plc === true && res.opcua === true && res.api === true ) {
          this.globalVar.isKeepAliveGood = true;
        }else {
          this.globalVar.isKeepAliveGood = false;
        }
        return res;
      });
      return res;
    }

  /**
   * Generates a random integer between min and max (inclusive)
   * @param  {number} min
   * @param  {number} max
   * @returns randomly generated integer
   */
  public randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  public async keepassAlertInfo(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      animated: true,
      backdropDismiss: true,
//        header: 'Информация о соединении',
      message: '<p><b>Информация о соединении с серверами и контроллером</b></p> \
      <ul><li>API сервер - ' + this.statusApiServer +
      '</li><li>OPCUA сервер - ' + this.statusOpcuaServer +
      '</li><li>Локальный контроллер - '+ this.statusPLC + '</li></ul>' ,
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
