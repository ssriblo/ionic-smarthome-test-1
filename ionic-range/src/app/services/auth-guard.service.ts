import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  canActivate() {
    if ( this.apiService.isJWT == true) {
      this.router.navigate(['home']);
    }
    console.log('AuthGuard#canActivate called');
    return true;
  }

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) { }
}