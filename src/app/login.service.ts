import { Injectable } from '@angular/core';

/**
 * this service is used as a data bag to store thing. alternative for ngRx and such
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //due to this is a not a big app, so I just store this in a service, otherwise I will use local storage
  // or ngRx store
  private loginToken: string = "";

  constructor() { }

  set LoginToken(token: string){
    this.loginToken = token;
  }

  get LoginToken(){
    return this.loginToken;
  }
}
