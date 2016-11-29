import {
  Component, EventEmitter, Input, Output
} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {marker} from '../interface/marker';
import {user} from '../interface/user';

/**
map component

 Recieves markers for map via Input from it's parent(menu). The map service it uses relies on the module ng2-ui-maps that's still pretty limited compared to the angular 1 version. Hence all the extra work I have to do.

Default map configuration settings should go here(like latitude), more about map
module here: https://ng2map.github.io/#/google-map
*/

/**
*there was an issue getting the maps directive to accept additional mouse events
*so I'm adding them to protoype here: ng2-angular-maps is very alpha
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
*/

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

  constructor(
    private modalService: NgbModal) {
  }

  /**
  *default map settings - there are many more options availible
  *set to nashville now, will default to user location anywhere in future
  *https://ng2map.github.io/#/google-map
  */
  lat: number = 36.160338;
  lng: number = -86.778780;
  zoom: number = 12;
  zoomIn: boolean = true;

  /**
   * [openModalNow: trigger on parent component menu to launch modal using *Output ]
   * @param  {marker.MapMarker} data [an event]
   */
  openModalNow(data: marker.MapMarker): void {
    this.openModal.emit(data);
    console.log(data);
  }
  /**
   * [ icon maker: picks image icon based on group, can expand to add more * *sources, used as icon for map markers ]
   * @param  {string} group [source group(user events, meetup)]
   * @param  {string} sport [sport to match icon name]
   * @return {[string]}
   */
  iconMaker(group: string, sport?: string): string {
    if (group == 'facebook') {
      return sport ? 'app/images/bluesporticons/sporticons-original_' + sport + '.png' : 'app/images/bluesporticons/sporticons-original_sport.png';
    } else {
      return sport ? 'app/images/redsporticons/sporticons-original_' + sport + '.png' : 'app/images/redsporticons/sporticons-original_sport.png';
    }
  }


}
