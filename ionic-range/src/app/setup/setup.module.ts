import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SetupPageRoutingModule } from './setup-routing.module';
import { SetupPage } from './setup.page';
import { Storage, IonicStorageModule } from '@ionic/storage';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SetupPageRoutingModule,
    IonicStorageModule.forRoot({
//      name: '__mydb',
//      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  declarations: [SetupPage]
})
export class SetupPageModule {
  constructor() { }
  
}
