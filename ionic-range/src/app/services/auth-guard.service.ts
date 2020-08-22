import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthGuardService implements CanActivate {
  private storage = new Storage(null)

  canActivate() {
    this.storage.get('jwtString').then((val) => {
//      this.jwtString = val;
      console.log('[AuthGuardService] get jwtString from storage: ', val );  
      if (val) { 
        this.router.navigate(['home']) 
      }else {
        this.router.navigate(['introduction']) 
      }

    });

    console.log('AuthGuard#canActivate called');
    return true;
  }

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) { }
}