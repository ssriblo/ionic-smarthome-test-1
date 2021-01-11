import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from './../../environments/environment';

///////////////////////////////////////////////////////////////////////////////
// from video How to Create Basic Ionic Storage CRUD Operations
// Simon Grimm devdactic 
// https://www.youtube.com/watch?v=h_IhS8QQjUA
///////////////////////////////////////////////////////////////////////////////

export interface Item {
  value: any,
  timestamp: string,
  id: string,
  level: number,
  type: number,
  color: string,
}
 

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) { }

  async addItem(key: string, item: Item): Promise<any>  {
    const items = await this.storage.get(key);
    //      if(items) {  
    if (!items || items.length === 0 || items === undefined) {
      return this.storage.set(key, [item]);
    } else {
      let newItem: Item[] = items;
      //        for (let i of items) { newItem.push(i) }
      if (newItem.length >= environment.ALERT_STORED_MAX) {
        newItem.shift();
      }
      newItem.push(item);
      return await this.storage.set(key, newItem);
    }
  }

  getItem(key: string): Promise<Item[]>{
    return this.storage.get(key);
  }

  updateItem(key: string, item: Item) {
    return this.storage.get(key).then((items: Item[]) => {
      if (!items || items.length === 0) {
//        return null; // was initially at the video
//        console.log('[storage.service.updateItem- set([item]) ----- 1]', item, items.length);
        return this.storage.set(key, [item]) 
      }
      let newItem: Item[] = []
      for (let i of items) {
        if (i.type === item.type) {
          newItem.push(item)
//          console.log('[storage.service.updateItem- push ----- 3]', item,  items.length);
        } else {
          newItem.push(i)
//          console.log('[storage.service.updateItem- push ----- 4]', i,  items.length);
        }
      }
//      console.log('[storage.service.updateItem- set(newItem) ----- 2]', newItem,  newItem.length);
      return this.storage.set(key, newItem)
    });
  }

  async deleteItem(key: string): Promise<Item[]> {
    let newItem: Item[];
    return await this.storage.set(key, newItem);
  }
}
