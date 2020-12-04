import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meters',
  templateUrl: './meters.page.html',
  styleUrls: ['./meters.page.scss'],
})
export class MetersPage implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }
  toHomePage() {
    this.router.navigate(['home']);  
  }
}
