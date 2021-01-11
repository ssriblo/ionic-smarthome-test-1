import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Storage, IonicStorageModule } from '@ionic/storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot({
//      name: '__mydb',
//      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
