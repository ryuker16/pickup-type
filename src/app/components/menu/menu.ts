import {
  Component, OnInit
} from '@angular/core';
//import {MapComponent} from '../map/map';
import {MapService} from '../sharedservice/map.service';
import {AuthLogin} from '../sharedservice/auth.login';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../sharedservice/interfaceClass/user';
import {AuthService} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';


//import { Ng2ArrayPipesModule } from 'angular-pipes';
//import {SearchArray} from '../pipes/searchField';

@Component({
  selector: 'fountain-menu',
  template: require('./menu.html'),
  providers: [NgbPopoverConfig],

})
export class MenuComponent implements OnInit {

  userData: any = {
    picture: ''
  };
  authStatus: boolean = false;
  firstMarkers: [{}];
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
  userMarkers: any;
  sports = this.mapService.listSports;

  constructor(private mapService: MapService, private authLogin: AuthLogin) {
  }

  login() {
    this.authLogin.loginFacebook()
      .subscribe({
        next: (value: any) => {
          //set to local storage
          localStorage.setItem('facebookId', value.facebook.id);

          //console.log(value.facebook.name);
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

  setAuth() {
    if (this.authLogin.authorized()) {
      this.authStatus = true;
      this.authLogin.getUser(localStorage.getItem('facebookId') || this.userData.id)
        .subscribe(
        value => { this.userData = value[0]; console.log(this.userData) },
        error => (err) => console.log(err)
        )
      console.log('Authorized already');
    } else {
      this.authStatus = false;
    }
  }

  //get User Made events and/or refresh events
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

  // Get Markers for all sports once and set original marker events
  setMarkersFirst(sports?: string[]) {
    this.mapService.getMapData(sports)
      .then(
      (marker) => {
        this.markers = marker;
        this.firstMarkers = marker;
      })
  };


  ngOnInit() {
    this.setAuth();
    this.setMarkersFirst();
  };

  //find my sports by name and sort map
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
