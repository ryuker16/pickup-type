// Imports
import {
  Component, OnInit
} from '@angular/core';

// Modal Components
import {EventComponent} from '../event.modal/event';
import {MakeComponent} from '../make.modal/make';
//Interfaces
import {marker} from '../interface/marker';
import {user} from '../interface/user';
//Services
import {MapService} from '../sharedservice/map.service';
import {AuthLogin} from '../sharedservice/authlogin.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

// default event data that gmaps requires before loading our real data
const fakeEvent = require('./fakeevent.json');


/**
* Menu component is the parent component to everything: the stateful component
* that passes data to it's stateless child components. Right now passes map
*   data to map component(recieved via their @Inputs).
*
* Services: Services are located in shared services folder
*
* AuthLogin - handles user authentication
* MapService - handles Map data recieved from server and triggers event modal
* NgbModal - used to open/create boostrap modals from event.modal & make.modal
*
* Interfaces: namespaces containing types; in interface folder
*
* marker for event related data
* user for user data
*
* other interfaces are such as google map related or login related are loaded *  typings globally
*
* Child Components: in components folder

* Event Component modal - modal for showing event data
* Make Component modal - modal for making events via form
* Map Component - builds google maps and recieves needed data via Menu Component
*
*
*
* Ng-Switch used to activate wether profile is shown/user logged in depending on
* authStatus variable.
*
* Used NG2-ui-bootstrap with the bootstrap 4 css.
*/


@Component({
  selector: 'fountain-menu',
  template: require('./menu.html'),
  styles: [`

    .inputMobileNav {

    }

    .hide-bottom-menu {
      z-index: 2;
    }

    .inputMobileMenu {
      margin-left: 5px;
    }

    `]
})
export class MenuComponent implements OnInit {

  // stored profile data.
  userData: user.UserProfile;
  // authStatus state determines if user profile is shown; false for no
  authStatus: boolean = false;
  //copy of original set of markers retrieved from database
  firstMarkers: marker.MapMarker[];
  //google maps requires at least one marker identified before starting. Will be
  //replaced upon loading our events from server
  markers: marker.MapMarker[] = [fakeEvent];
  //collapse menu - optional
  isCollapsed: boolean = false;
  // search markers and push matches here
  returnedEvents: marker.MapMarker[] = [];
  //user made markers to list in profile.
  userMarkers: marker.MapMarker[];
  //user attending event markers to list in profile.
  userAttending: marker.MapMarker[];
  //user maybe attending markers to list in profile.
  userMaybe: marker.MapMarker[];
  //list of sport types sorted by alphabetical order
  sports: Array<string> = this.mapService.listSports.sort();

  constructor(private mapService: MapService, private authLogin: AuthLogin,
    private modalService: NgbModal) {
  }

  /**
   * [ngOnInit checks login status and gets map data from our API]
   */
  ngOnInit(): void {
    this.setAuth();
    this.setMarkersFirst();
  };

  /**
   * [open open my modal for making events or other stuff!]
   * @param {any} modalContent [any modal component]
   */
  open(modalContent?: any): void {
    if (modalContent) {
      let modal = this.modalService.open(modalContent);
    } else {
      let modal = this.modalService.open(MakeComponent);
      modal.componentInstance.userInfo = this.userData;
    }
  }
  /**
   * [openEvent open event for more details in modal]
   * @param  {marker.MapMarker} data [event to pass to modal]
   */
  openEvent(data: marker.MapMarker): void {
    let modalEvent;
    //console.log(data);
    if (data.group.who == 'facebook') {
      this.mapService.getEvent(data.id)
        .subscribe({
          next: (value) => {
            console.log(value[0]);
            modalEvent = this.modalService.open(EventComponent);
            modalEvent.componentInstance.model = value[0];
            modalEvent.componentInstance.userInfo = this.userData;
            modalEvent.componentInstance.status = this.authStatus;
            modalEvent.componentInstance.setMarkersFirst = this.setMarkersFirst;
            modalEvent.componentInstance.resetMarkers.subscribe(() => {
              this.setMarkersFirst();
            });
            modalEvent.componentInstance.login.subscribe(() => {
              this.login();
            });
            console.log(value);
          },
          error: (err: any) => console.log(err),
          complete: () => {
            console.log('Event data recieved to modal');
          }

        });

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


  /**
   * [login login via authLogin Service]
   */
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
      });
  }
  /**
   * [logout logs out, sets authstatus]
   */
  logout(): void {
    this.authLogin.logout();
    this.authStatus = false;
    localStorage.clear();
  }
  /**
   * [setAuth checks to see if user is logged in already onInit, will get his data if so]
   */
  setAuth(): void {
    if (this.authLogin.authorized()) {

      if (localStorage.getItem('facebookId') === undefined) {
        this.authStatus = false;
        this.logout();
      } else {
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

          });
      }
    } else {
      this.authStatus = false;
    }
  }

  /**
   * [setMarkers idenfify User Made events then set user attending/maybe going events for user profile]
   * @param {string} userId [user id string]
   */
  setMarkers(userId: string): void {
    // return first user match value/object
    let findGoing = (element: marker.RsvpSample) => {
      return element.member.facebookId == userId;
    };

    let newMaybeMarkers: marker.MapMarker[] = [];
    let newAttendingMarkers: marker.MapMarker[] = [];
    let newUserMarkers: marker.MapMarker[] = [];

    for (let i in this.markers) {
      if (this.markers[i].group.who == 'facebook') {
        if (this.markers[i].group.facebookId === userId) {
          newUserMarkers.push(this.markers[i]);
        } else {
          let attending: any = this.markers[i].rsvp_sample.find(findGoing);
          console.log(attending);
          if (attending !== undefined) {
            newAttendingMarkers.push(this.markers[i]);
          }
        }
      }
    }
    this.userMarkers = newUserMarkers;
    this.userAttending = newAttendingMarkers;
    this.userMaybe = newMaybeMarkers;

    console.log('User Events: ' + this.userAttending);
  };

  /**
   * [setMarkersFirst Get Markers for all sports once and set original marker
   *  events for reference]
   */
  setMarkersFirst(): void {
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
      });
  };

  /**
   * [searchSports sorts search bar results and return matching events]
   * @param {any} searchEntry [search bar event triggered by key up]
   */
  searchSports(searchEntry: any): void {
    let words: string = searchEntry.target.value;
    console.log(words);

    this.returnedEvents = [];

    if (words.length >= 2) {
      for (let i in this.markers) {
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
  /**
   * [sortSports find my sports by name in choosen sports; doesn't make API
   *  call. Merely determines visibility ]
   * @param  {string} sports [sport name]
   */
  sortSports(sports?: string): void {

    for (let i in this.markers) {
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
