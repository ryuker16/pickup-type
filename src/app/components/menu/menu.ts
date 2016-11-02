import {
  Component, OnInit, TemplateRef
} from '@angular/core';
import {MapService} from '../sharedservice/map.service';
import {AuthLogin} from '../sharedservice/auth.login';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {user} from '../sharedservice/interfaceClass/user';
import {marker} from '../sharedservice/interfaceClass/marker';
import {MakeComponent} from '../make.modal/make';
import {AuthService} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
const fakeEvent = require('./fakeevent.json');


/**
Menu component is the parent component to everything: the stateful component
that passes data to it's stateless child components. Right now pass map data to
map component(recieved via @Outputs).

Ng-Switch used to activate wether profile is shown/user logged in depending on
authStatus variable.

Used NG2-ui-bootstrap with the bootstrap 4 css.
*/


@Component({
  selector: 'fountain-menu',
  template: require('./menu.html'),
})
export class MenuComponent implements OnInit {
  // stored profile data. empty picture string required to avoid error.
  userData: user.UserProfile;
  // authStatus state determines if user profile is shown; false for no
  authStatus: boolean = false;
  //copy of original set of markers retrieved from database
  firstMarkers: Array<marker.MapMarker>;
  //google maps requires at least one marker identified before starting. Will be
  //replaced
  //markers: Array<marker.MapMarker>;
  markers: any = [fakeEvent];

  // search markers and push matches here

  returnedEvents: Array<marker.MapMarker> = [];

  //user markers to list in profile.
  userMarkers: Array<marker.MapMarker>;
  // list of sports
  sports = this.mapService.listSports.sort();

  constructor(private mapService: MapService, private authLogin: AuthLogin,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.setAuth();
    this.setMarkersFirst();
  };

  // open my modal!
  open() {
    this.modalService.open(MakeComponent);
    //modalRef.componentInstance.name = 'World';
  }

  // login via authLogin Service
  login(): void {
    this.authLogin.loginFacebook()
      .subscribe({
        next: (value) => {
          console.log(value);
          localStorage.setItem('facebookId', value.facebook.id);
        },
        error: (err: any) => console.log(err),
        complete: () => {
          this.setAuth();
          console.log('Logged IN');
        }
      })
  }

  logout(): void {
    this.authLogin.logout();
    this.authStatus = false;
    localStorage.clear();
  }
  //checks to see if user is logged in already onInit, will get his data if so.
  setAuth(): void {
    if (this.authLogin.authorized()) {

      this.authLogin.getUser(localStorage.getItem('facebookId') ||
        this.userData.facebook)
        .subscribe({
          next: (value) => {
            this.userData = value[0];
            console.log(this.userData);
          },
          error: (err: any) => console.log(err),
          complete: () => {
            this.authStatus = true;
            console.log('Authorized already');
          }

        })
    } else {
      this.authStatus = false;
    }
  }

  //idenfify User Made events and/or refresh events
  setMarkers(userId?: string): void {
    this.mapService.getMapData()
      .subscribe(
      value => {
        this.markers = value;
        if (userId) {
          let faceId: number = parseInt(userId, 20);
          for (var i in value) {
            let newUserMarkers;
            if (value[i].group.id == faceId) {
              newUserMarkers.push(value[i]);
            }
            this.userMarkers = newUserMarkers;
          }
        }
      })
  };

  // Get Markers for all sports once and set original marker events for reference
  setMarkersFirst() {
    this.mapService.getMapData()
      .subscribe({
        next: (value) => {
          this.markers = value;
          this.firstMarkers = value;
          console.log(value);
        },
        error: (err: any) => console.log(err),
        complete: () => console.log('values should be retrieved')
      })
  };
  searchSports(event: any) {
    let words: string = event.target.value;
    console.log(words);

    this.returnedEvents = [];

    if (words.length >= 2) {
      for (var i in this.markers) {
        let search1 =
          this.markers[i].group.name.toLowerCase().search(words.toLowerCase());
        let search2 =
          this.markers[i].description.toLowerCase().search(words.toLowerCase());

        if (search1 !=
          -1 || search2 != -1) {

          this.returnedEvents.push(this.markers[i]);
          console.log('match found!');
        }
      }
    }

  }
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
