import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

///////////////////////////////////////////////////////////////////////////////
// from video How to Create Basic Ionic Storage CRUD Operations
// Simon Grimm devdactic 
// https://www.youtube.com/watch?v=h_IhS8QQjUA
// CURRENTLY DOES NOT USE IT, BUT IT'S GREATE EXAMPLE  - HOW TO WORK WITH PROMISE AND LOCAL STORAGE
///////////////////////////////////////////////////////////////////////////////

export interface Item {
  value: any,
  timestamp: number,
  id: number,
}
 

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) { }

  addItem(key: string, item: Item): Promise<any>  {
    return this.storage.get(key).then((items: Item) => {
      if(items) {  // original code from yuortube has difference - item[] - item list
        return this.storage.set(key, items)
      }else {
        return this.storage.set(key, items) // original was: [item]
      } 
    });
  }

  getItem(key: string): Promise<Item>{
    return this.storage.get(key);
  }

  updateItem(key: string, item: Item) {
    return this.storage.get(key).then((items: Item) => {
      if (!items || items) {
        return null;
      }
      return this.storage.set(key, items)
    });
  }

  deleteItem(key: string): Promise<Item> {
    return this.storage.get(key).then((items: Item) => {
      if (!items || items) {
        return null;
      }
      return this.storage.remove(key)      
    });
  }

}
