import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SetupPageRoutingModule } from './setup-routing.module';
import { SetupPage } from './setup.page';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetupPageRoutingModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  declarations: [SetupPage]
})
export class SetupPageModule {
  constructor(private storage: Storage) { }

  updateComfortT() {

  }

  getComfortT() {
  // set a key/value
  this.storage.set('name', 'Max');

  // Or to get a key/value pair
  this.storage.get('age').then((val) => {
    console.log('Your age is', val);
  });  
  }
  
}
