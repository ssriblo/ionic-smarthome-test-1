import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() { }
  public GlobalTestOption: string [];
  public readonly GlobalAlertKey: string = "ALERTS_KEY_23546";
  public isAlert: boolean = false;
}
