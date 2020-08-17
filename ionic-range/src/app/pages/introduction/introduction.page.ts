import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  IonRouterOutlet,
} from '@ionic/angular';
import { SignupPage } from '../signup/signup.page';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.page.html',
  styleUrls: ['./introduction.page.scss'],
})
export class IntroductionPage implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
  ) {}

  async ngOnInit() {
  }

  async openSignup() {
    const modal = await this.modalCtrl.create({
      component: SignupPage,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
    });
    await modal.present();
  }
}
