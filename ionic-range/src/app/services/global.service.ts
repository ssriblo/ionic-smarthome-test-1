import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() { }
  public GlobalTestOption: string [];
  public readonly GlobalAlertKey: string = "ALERTS_KEY_23550";
  public isAlert: boolean = false;
  public testBit_1: boolean = false;
  public testBit_2: boolean = false;
  public isKeepAliveGood: boolean = false; // true, if KeepAlive passed for all steps - servers, PCL
  public isKeepAliveActual: boolean = false; // ture, if KeepAlive POST/GET passed already
}
