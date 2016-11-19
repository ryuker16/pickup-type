import {
  Component, OnInit, TemplateRef
} from '@angular/core';
import {MapService} from '../sharedservice/map.service';
import {AuthLogin} from '../sharedservice/auth.login';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {user} from '../sharedservice/interfaceClass/user';
import {marker} from '../sharedservice/interfaceClass/marker';
import {MakeComponent} from '../make.modal/make';
import {EventComponent} from '../event.modal/event';
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
  // stored profile data.
  userData: user.UserProfile;
  // authStatus state determines if user profile is shown; false for no
  authStatus: boolean = false;
  //copy of original set of markers retrieved from database
  firstMarkers: Array<marker.MapMarker>;
  //google maps requires at least one marker identified before starting. Will be
  //replaced
  //markers: Array<marker.MapMarker>;
  markers: Array<marker.MapMarker> = [fakeEvent];

  // search markers and push matches here

  returnedEvents: Array<marker.MapMarker> = [];

  //user made markers to list in profile.
  userMarkers: Array<marker.MapMarker>;
  //user attending event markers to list in profile.
  userAttending: Array<marker.MapMarker>;
  //user maybe attending markers to list in profile.
  userMaybe: Array<marker.MapMarker>;
  //list of sports
  sports = this.mapService.listSports.sort();

  constructor(private mapService: MapService, private authLogin: AuthLogin,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.setAuth();
    this.setMarkersFirst();
  };

  // open my modal for making events!
  open() {
    let modal = this.modalService.open(MakeComponent);
    modal.componentInstance.userInfo = this.userData;
  }
  //open user interacted/created events from drop down
  openEvent(data: marker.MapMarker) {
    var modalEvent;
    if (data.group.who == 'facebook') {
      this.mapService.getEvent(data.id)
        .subscribe({
          next: (value) => {
            modalEvent = this.modalService.open(EventComponent);
            modalEvent.componentInstance.model = value[0];
            modalEvent.componentInstance.userInfo = this.userData;
            modalEvent.componentInstance.status = this.authStatus;
            modalEvent.componentInstance.login = this.login;
            modalEvent.componentInstance.setMarkersFirst = this.setMarkersFirst;
            modalEvent.componentInstance.resetMarkers.subscribe(() => {
              this.setMarkersFirst();
            });
            console.log(value[0]);
          },
          error: (err: any) => console.log(err),
          complete: () => {
            console.log('Event data recieved to modal');
          }

        })

    } else {
      modalEvent = this.modalService.open(EventComponent);
      modalEvent.componentInstance.model = data;
      modalEvent.componentInstance.userInfo = this.userData;
      modalEvent.componentInstance.status = this.authStatus;
      modalEvent.componentInstance.login = this.login;
      modalEvent.componentInstance.setMarkersFirst = this.setMarkersFirst;
    }
    console.log("recieved data from open event Modal");
  }


  // login via authLogin Service
  login(): void {
    this.authLogin.loginFacebook()
      .subscribe({
        next: (value) => {
          console.log(value);
          localStorage.setItem('facebookId', value.facebook.id);
          this.setMarkers(value.facebook.id);
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
            //set user events
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

  //idenfify User Made events or user attending/maybe going events

  setMarkers(userId: string): void {
    // return first user match value/object
    let findGoing = (element: marker.RsvpSample) => {
      return element.member.facebookId == userId
    };

    let newMaybeMarkers: Array<marker.MapMarker> = [];
    let newAttendingMarkers: Array<marker.MapMarker> = [];
    let newUserMarkers: Array<marker.MapMarker> = [];

    for (var i in this.markers) {

      //console.log(this.markers[i]);
      if (this.markers[i].group.who == 'facebook') {
        if (this.markers[i].group.facebookId === userId) {

          newUserMarkers.push(this.markers[i]);
        } else {
          let attending: any = this.markers[i].rsvp_sample.find(findGoing);
          if (attending !== undefined && attending.maybe_going == false) {
            newAttendingMarkers.push(this.markers[i]);
          } else if (attending !== undefined && attending.maybe_going == true) {
            newMaybeMarkers.push(this.markers[i]);
          }
        }
      }
    }
    this.userMarkers = newUserMarkers;
    this.userAttending = newAttendingMarkers;
    this.userMaybe = newMaybeMarkers;

    console.log('User Events: ' + this.userMarkers);
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
        complete: () => {
          console.log('values should be retrieved');
          if (this.authStatus && this.userData) {
            this.setMarkers(this.userData.facebook);
          }
        }
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
