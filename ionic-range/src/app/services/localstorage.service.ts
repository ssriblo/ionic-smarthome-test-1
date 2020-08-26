import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor( 
    private store: Storage
  ) { }

  public  async get(key: string) {
    let res = await this.store.get(key)
    if (!res.ok ) {throw new Error('[LocalstorageService.get] error! status: ${res.status}');} 
    return res;
  }

  public async set(key: string, value: any) {
    let res = await this.store.set(key, value)
    if (!res.ok ) {throw new Error('[LocalstorageService.set] error! status: ${res.status}');}
    return res
  }

  public async remove(key: string) {
    let res = await this.store.remove(key)
    if (!res.ok ) {throw new Error('[LocalstorageService.remove] error! status: ${res.status}');}
    return res
  }

  public async check(key: string) {
    let ret = false
    let res = await this.store.get(key)
    if (!res.ok ) {throw new Error('[LocalstorageService.check] error! status: ${res.status}');}
    else {ret = true} 
    return ret;
  }

}
