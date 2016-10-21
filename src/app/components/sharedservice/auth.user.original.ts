import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Injectable } from '@angular/core';

export const authConfig = {
  apiKey: "AIzaSyAE2JCmg7s8pNN0XTGe6FWojaTaBK4xkig",
  authDomain: "pickup-sports-ec444.firebaseapp.com",
  databaseURL: "https://pickup-sports-ec444.firebaseio.com",
  storageBucket: "pickup-sports-ec444.appspot.com",
  messagingSenderId: "782978287800"
};

@Injectable()
export class AuthUser {
  user = {};

  constructor(
    public af: AngularFire
  ) {
    this.af.auth.subscribe(user => {
      if (user) {
        // user logged in
        localStorage.setItem("lastname", "Smith");

        this.user = user;
      }
      else {
        // user not logged in
        this.user = {};
        //console.log(this.user);
      }
    });

  }

  login() {
    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    }).then((token) => {
      console.log(token);
      return token;
    }).then((error) => {
      console.log(error);
      return error;
    })
  }

  logout() {
    this.af.auth.logout();
  }
}
