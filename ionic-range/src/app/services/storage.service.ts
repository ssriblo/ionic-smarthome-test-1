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
  level: number,
  type: number
}
 

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) { }

  addItem(key: string, item: Item): Promise<any>  {
    return this.storage.get(key).then((items: Item[]) => {
      if(items) {  
        return this.storage.set(key, items)
      }else {
        return this.storage.set(key, [item]) 
      } 
    });
  }

  getItem(key: string): Promise<Item[]>{
    return this.storage.get(key);
  }

  updateItem(key: string, item: Item) {
    return this.storage.get(key).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      let newItem: Item[] = []
      for (let i of items) {
        if (i.id === item.id) {
          newItem.push(item)
        } else {
          newItem.push(i)
        }
      }
      return this.storage.set(key, newItem)
    });
  }

  deleteItem(key: string, id: number): Promise<Item> {
    return this.storage.get(key).then((items: Item[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      let toKeep: Item[] = [];
      for (let i of items) {
        if (i.id != id) {
          toKeep.push(i);
        }
      }
      return this.storage.set(key, toKeep);
    });
  }

}
