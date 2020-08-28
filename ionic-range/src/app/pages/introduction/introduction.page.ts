import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  IonRouterOutlet,
} from '@ionic/angular';
import { SignupPage } from '../signup/signup.page';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.page.html',
  styleUrls: ['./introduction.page.scss'],
})
export class IntroductionPage implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private apiService: ApiService,
    private router: Router,
  ) {}

  async ngOnInit() {}

  async openSignup() {
    const modal = await this.modalCtrl.create({
      component: SignupPage,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
    });
    await modal.present();
  }
}
