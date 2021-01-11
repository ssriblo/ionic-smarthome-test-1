import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetersPageRoutingModule } from './meters-routing.module';

import { MetersPage } from './meters.page';
import { Storage, IonicStorageModule } from '@ionic/storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetersPageRoutingModule,
    IonicStorageModule.forRoot({
//      name: '__mydb',
//      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  declarations: [MetersPage]
})
export class MetersPageModule {}
