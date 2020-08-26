import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Start the JWT register process
  async jwtSignup(token: any): Promise<any> {
    const credential = await this.getJWT(token);
    return credential;
  }

  getJWT(token: any){}


}
