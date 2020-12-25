import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

export interface KeepAliveStatus {
  plc:boolean, 
  opcua:boolean, 
  api:boolean,
  token:number,
}

export interface KeepAliveACK {
  plc:number,
  opcua:number,
  api:number,
}
 
@Injectable({
  providedIn: 'root'
})
export class Keepalive {
  private tkn:number;

  constructor(
    private apiService: ApiService,
  ) { }

  public pushKeepalive() {
    // generate random token "tkn" - 4 bytes/32bits number
    this.tkn = this.randomInt(0, 0xffffffff);
    this.apiService.postApi("keepAliveSendToken", {"token":this.tkn});
  }

  public isLive(tkn:number) {
    let res: KeepAliveStatus = {
      plc: false,
      opcua: false,
      api: false,
      token: tkn,
    }
    this.apiService.getApiCB("keepAliveReceive", (result) => {
      if (this.tkn == result['plc']) { res['plc'] = true; }
      if (this.tkn == result['opcua']) { res['opcua'] = true; }
      if (this.tkn == result['api']) { res['api'] = true; }
//////////////////////////////////////////////////////////////////////////////////
//     ПРОБЛЕМА: вызываю этот метод и он возвращает ответ через задержку. 
//          Как переделать его на ASYNC/AWAIT
//            см. заметки Ильи
//////////////////////////////////////////////////////////////////////////////////
  });

  

    return res
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

}
