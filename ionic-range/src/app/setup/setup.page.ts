import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit {

  constructor( public router: Router) { }

  ngOnInit() {
  }
  toHomePage() {
    this.router.navigate(['home']);  
  }

}
