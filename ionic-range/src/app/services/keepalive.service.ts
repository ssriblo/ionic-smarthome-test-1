import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { GlobalService } from "../services/global.service";

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
        if (this.tkn === result.plc) { res.plc = true; }
        if (this.tkn === result.opcua) { res.opcua = true; }
        if (this.tkn === result.api) { res.api = true; }
        console.log("[isKeepALive] res=", res, "result=", result)
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

}
