import {
  Component, OnInit, Output, Input, EventEmitter
} from '@angular/core';
import {user} from '../sharedservice/interfaceClass/user';
import {marker} from '../sharedservice/interfaceClass/marker';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EventComponent} from '../event.modal/event';

import {
  SebmGoogleMapMarker,
} from 'angular2-google-maps/core';

/**
map component

pretty bare now until I add the custom marker overlay. Recieves markers for map
via Input from it's parent(menu). The map service it uses relies on the module
ng2-ui-maps that's still pretty limited compared to the angular 1 version. Hence
all the extra work I have to do. For example, there are no options to modify
an info window shows up or css....only click. So customer overlay it is.

Default map configuration settings should go here(like latitude) more about map
module here: https://ng2map.github.io/#/google-map


*/


//there was an issue getting the maps directive to accept additional mouse events
//so I'm adding them to protoype here: ng2-angular-maps is very alpha
const baseAddEventListeners = SebmGoogleMapMarker.prototype._addEventListeners;
SebmGoogleMapMarker.prototype._addEventListeners = function() {
  this._markerManager.createEventObservable('mouseover', this)
    .subscribe(() => {
      this._infoWindow.open();
    })
  this._markerManager.createEventObservable('mouseout', this)
    .subscribe(() => { this._infoWindow.close(); })
  baseAddEventListeners.call(this);
}



@Component({
  selector: 'fountain-map',
  styles: [`.map-container {
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: -1000;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.pac-container {
    z-index: 1051 !important;
}
.image-info-window {
display: inline-block;
}

.image-window {
padding-top: 3px;
display: inline-block;
max-width: 45px;
max-height: 45px;
}
`],
  template: require('./map.html'),
})
export class MapComponent {

  @Input() markers: marker.MapMarker;
  @Input() userInfo: user.UserProfile;
  @Input() status: boolean;
  @Output() openModal: EventEmitter<any> = new EventEmitter();



  //trigger on parent component menu to launch modal using Output
  // helps with communication with Bootstrap modal internal components
  openModalNow(data: marker.MapMarker) {
    this.openModal.emit(data);
    console.log(data + 'event emitted at map modal');
  }


  //@Output() openMarker = new EventEmitter();
  // open(data: marker.MapMarker) {
  //   let modalEvent = this.modalService.open(EventComponent);
  //   modalEvent.componentInstance.model = data;
  //   modalEvent.componentInstance.userInfo = this.userInfo;
  // }

  constructor(
    private modalService: NgbModal) {
  }

  // default map settings - there are many more options availible
  // set to nashville now, will default to user location anywhere in future
  //https://ng2map.github.io/#/google-map

  lat: number = 36.160338;
  lng: number = -86.778780;
  zoom: number = 12;
  zoomIn: boolean = true;

  clickMarker(visible: string, index: number) {
    console.log(`clicked the marker: ${visible || index}`)
  }



  //test click - delete later
  // mapClicked($event: any) {
  //   this.markers.push({
  //     latitude: $event.coords.lat,
  //     longitude: $event.coords.lng,
  //     title: 'A',
  //     date: 10,
  //     going: 10,
  //     maybeGoing: 19,
  //     sport: 'make new events',
  //     options: {
  //       visibile: true
  //     }
  //   });
  // }

}
