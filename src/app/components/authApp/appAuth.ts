import { Component } from '@angular/core';
import { AngularFire, AuthProviders } from 'angularfire2';

export const authConfig = {
  apiKey: "AIzaSyAE2JCmg7s8pNN0XTGe6FWojaTaBK4xkig",
  authDomain: "pickup-sports-ec444.firebaseapp.com",
  databaseURL: "https://pickup-sports-ec444.firebaseio.com",
  storageBucket: "pickup-sports-ec444.appspot.com",
  messagingSenderId: "782978287800"
};

@Component({
  // moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppAuth {
  user = {};
  constructor(
    public af: AngularFire
  ) {
    this.af.auth.subscribe(user => {
      if (user) {
        // user logged in
        this.user = user;
      }
      else {
        // user not logged in
        this.user = {};
      }
    });
  }
}
