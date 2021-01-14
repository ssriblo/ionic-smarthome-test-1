import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }

  toHomePage() {
    this.router.navigate(['home']);  
  }

}
