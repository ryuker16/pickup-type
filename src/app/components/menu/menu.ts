import {
  Component, OnInit
} from '@angular/core';
import {MapService} from '../sharedservice/map.service';
import {AuthLogin} from '../sharedservice/auth.login';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../sharedservice/interfaceClass/user';
import {AuthService} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';

/**
Menu component is the parent component to everything: the stateless component
that passes data to it's stateless child components. Right now pass map data to
map component(recieved via @Outputs).

Ng-Switch used to activate wether profile is shown/user logged in depending on
authStatus variable. 

Used NG2-ui-bootstrap with the bootstrap 4 css.
*/


@Component({
  selector: 'fountain-menu',
  template: require('./menu.html'),
  providers: [NgbPopoverConfig],

})
export class MenuComponent implements OnInit {
  // stored profile data. empty picture string required to avoid error.
  userData: any = {
    picture: ''
  };
  // determines if user profile is shown
  authStatus: boolean = false;
  firstMarkers: [{}];
  //google maps requires at least one marker identified before starting. Will be
  //replaced
  markers: any = [
    {
      latitude: 36.160338,
      longitude: -86.778780,
      title: 'A',
      date: 10,
      going: 10,
      maybeGoing: 19,
      sport: 'test',
      options: {
        visibile: true
      }
    }
  ];
  //user markers to list in profile.
  userMarkers: any;
  // list of sports
  sports = this.mapService.listSports;

  constructor(private mapService: MapService, private authLogin: AuthLogin) {
  }

  ngOnInit() {
    this.setAuth();
    this.setMarkersFirst();
  };


  login() {
    this.authLogin.loginFacebook()
      .subscribe({
        next: (value: any) => {
          localStorage.setItem('facebookId', value.facebook.id);
        },
        error: (err: any) => console.log(err),
        complete: () => {
          this.setAuth();
          console.log('Logged IN');
        }
      })
  }

  logout() {
    this.authLogin.logout();
    this.authStatus = false;
    localStorage.clear();
  }
  //checks to see if user is logged in already onInit, will get his data if so.
  setAuth() {
    if (this.authLogin.authorized()) {
      this.authStatus = true;
      this.authLogin.getUser(localStorage.getItem('facebookId') || this.userData.id)
        .subscribe(
        value => {
          this.userData = value[0];
          console.log(this.userData)
        },
        error => (err) => console.log(err)
        )
      console.log('Authorized already');
    } else {
      this.authStatus = false;
    }
  }

  //idenfify User Made events and/or refresh events
  setMarkers(userId?: string): void {
    this.mapService.getMapData()
      .then(
      (markers) => {
        this.markers = markers;
        if (userId) {
          for (var i in markers) {
            let newUserMarkers;
            if (markers[i].group.id == userId) {
              newUserMarkers.push(markers[i]);
            }
            this.userMarkers = newUserMarkers;
          }
        }
      })
  };

  // Get Markers for all sports once and set original marker events for reference
  setMarkersFirst(sports?: string[]) {
    this.mapService.getMapData(sports)
      .then(
      (marker) => {
        this.markers = marker;
        this.firstMarkers = marker;
      })
  };



  //find my sports by name and sort map; doesn't make database call.
  sortSports(sports?: string) {

    for (var i in this.markers) {
      if (!sports) {
        this.markers[i].options.visible = true;
      } else if (this.markers[i].sport !== sports) {
        this.markers[i].options.visible = false;
      } else if (this.markers[i].sport == sports) {
        this.markers[i].options.visible = true;
      }
    }
  };


}
